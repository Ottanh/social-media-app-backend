import { gql, UserInputError } from "apollo-server";
import User from "./model";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { NewUser, CurrentUser } from "./types";
import { Types } from "mongoose";
import config from "../config";


export const postTypeDef = gql`
  extend type Query {
    allUsers: [User]!
    findUser(username: String!): User
    me: User
  }
  type User {
    id: ID!
    username: String!
    name: String!
    date: String!
    description: String
    likes: [ID]!
  }
  type Token {
    value: String!
  }
  type TokenAndUser {
    token: String!
    user: User!
  }
  type Mutation {
    createUser(
      username: String!
      password: String!
      name: String!
    ): TokenAndUser
    login(
    username: String!
    password: String!
  ): TokenAndUser
  }
`;

export const userResolver = {
  User: {
    date: (root: { _id: Types.ObjectId} ) => {
      return root._id.getTimestamp().toISOString();
    }
  },
  Query: {
    allUsers: async () => {
      return await User.find({});
    },
    findUser: async (_root: undefined, args: { username: string; }) => {
      return await User.findOne({username: args.username});
    },
    me: (_root: undefined, _args: undefined, context: { currentUser: CurrentUser; }) => {
      return context.currentUser;
    }
  },
  Mutation: {
    createUser: async (_root: undefined, args: NewUser) => {
      const saltRounds = 13;
      const passwordHash = await bcrypt.hash(args.password, saltRounds);

      const user = new User({ ...args, passwordHash });

      const userForToken = {
        username: user.username,
        id: user._id,
      };

      const savedUser = await user.save()
        .catch(error => {
          if(error instanceof Error) {
            throw new UserInputError(error.message, {
              invalidArgs: args,
            });
          }
        });

        return { token: jwt.sign(userForToken, config.SECRET), user: savedUser };
    },
    login: async (_root: undefined, args: { username: string; password: string; }) => {
      const user = await User.findOne({ username: args.username });
      const passwordCorrect = user === null
        ? false
        : await bcrypt.compare(args.password, user.passwordHash);

      if (!(user && passwordCorrect)) {
        throw new UserInputError("Wrong credentials");
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      };

      return { token: jwt.sign(userForToken, config.SECRET), user };
    },
  }
};