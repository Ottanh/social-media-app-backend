import { gql, UserInputError } from "apollo-server";
import User from "./userSchema";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import { CreateUser } from "./types";


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
    joined: String!
    description: String
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
      joined: String!
    ): User
    login(
    username: String!
    password: String!
  ): TokenAndUser
  }
`;

export const userResolver = {
  Query: {
    allUsers: async () => {
      return await User.find({});
    },
    findUser: async (_root: undefined, args: { username: string; }) => {
      return await User.findOne({username: args.username});
    },
    me: (_root: undefined, _args: undefined, context: { currentUser: { id: string }; }) => {
      return context.currentUser;
    }
  },
  Mutation: {
    createUser: async (_root: undefined, args: CreateUser) => {
      const saltRounds = 13;
      const passwordHash = await bcrypt.hash(args.password, saltRounds);

      const user = new User({ ...args, passwordHash });
      return user.save()
        .catch(error => {
          if(error instanceof Error) {
            throw new UserInputError(error.message, {
              invalidArgs: args,
            });
          }
        });
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

      const SECRET = process.env.SECRET;
      if(!SECRET) {
        throw new TypeError('MONGODB_URI is undefined');
      }
      return { token: jwt.sign(userForToken, SECRET), user };
    },
  }
};