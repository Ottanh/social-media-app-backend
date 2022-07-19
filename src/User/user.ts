import { AuthenticationError, gql, UserInputError } from "apollo-server";
import User from "./model";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { NewUser, CurrentUser } from "./types";
import { Types } from "mongoose";
import config from "../config";
import { getSignedGet } from "../S3/s3_signed_url";


export const postTypeDef = gql`
  type User {
    id: ID!
    username: String!
    name: String!
    date: String!
    description: String
    image: String!
    likes: [ID]!
    followed: [ID]!
  }
  type Token {
    value: String!
  }
  type TokenAndUser {
    token: String!
    user: User!
  }
  extend type Query {
    allUsers: [User]!
    findUser(username: String!): User
    findUsers(userIds: [String]!): [User]
    me: User
    searchUser(searchword: String!): [User]
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
    follow(id: ID!): User!
    unFollow(id: ID!): User!
    editUser(description: String image: String): User!
  }
`;

export const userResolver = {
  User: {
    date: (root: { _id: Types.ObjectId} ) => {
      return root._id.getTimestamp();
    },
    image: async (root: { image: string} ) => {
      if(!root.image) {
        return null;
      }
      return await getSignedGet(root.image);
    },
  },
  Query: {
    allUsers: async () => {
      return await User.find({});
    },
    findUser: async (_root: undefined, args: { username: string; }) => {
      return await User.findOne({username: args.username});
    },
    findUsers: async (_root: undefined, args: { userIds: string[]; }) => {
      return await User.find({ _id: { $in: args.userIds} });
    },
    me: async (_root: undefined, _args: undefined, context: { currentUser: CurrentUser; }) => {
      if(!context.currentUser){
        return null;
      }
      return await User.findById(context.currentUser._id);
    },
    searchUser: async (_root: undefined, args: { searchword: string }) => {
      if(args.searchword.length < 3) {
        return [];
      }
      return await User.find({ username: { $regex: `.*${args.searchword}.*`, $options: 'i' } });
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
        .catch((error: { message: string; }) => {
          if(error instanceof Error) {
            throw new UserInputError(error.message, {
              invalidArgs: args,
            });
          }
        });

        return { token: jwt.sign(userForToken, (await config).JWT_SECRET), user: savedUser };
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

      return { token: jwt.sign(userForToken, (await config).JWT_SECRET), user };
    },
    follow: async (_root: undefined, args: { id: string }, context: { currentUser: CurrentUser }) => {
      const currentUser = context.currentUser;
      if (!currentUser) {      
        throw new AuthenticationError('Not authenticated');
      }

      return await User.findByIdAndUpdate(currentUser._id, { $addToSet: { followed: args.id } }, { new: true });
    },
    unFollow: async (_root: undefined, args: { id: string }, context: { currentUser: CurrentUser }) => {
      const currentUser = context.currentUser;
      if (!currentUser) {      
        throw new AuthenticationError('Not authenticated');
      }

      return await User.findByIdAndUpdate(currentUser._id, { $pull: { followed: args.id } }, { new: true });
    },
    editUser: async (_root: undefined, args: { description: string, image: string }, context: { currentUser: CurrentUser }) => {
      const currentUser = context.currentUser;
      if (!currentUser) {      
        throw new AuthenticationError('Not authenticated');
      }

      return await User.findByIdAndUpdate(currentUser._id,  { description: args.description, image: args.image }, { new: true });
    }
  }
};