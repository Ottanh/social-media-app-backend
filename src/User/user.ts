import { gql, UserInputError } from "apollo-server";
import Post from "../Post/postSchema";
import User, { UserType } from "./userSchema";


export const postTypeDef = gql`
  extend type Query {
    allUsers: [User]!
    findUser(username: String!): User
  }
  type User {
    id: ID!
    username: String!
    name: String!
    joined: String!
    description: String
    posts: [Post]!
  }
  type Mutation {
    createUser(
      username: String!
      name: String!
      joined: String!
    ): User
  }
`;

export const userResolver = {
  User: {
    posts: async (user: { posts: string[] }) => {
      return await Post.find({_id: {$in: user.posts}});
    }
  },
  Query: {
    allUsers: async () => {
      return await User.find({});
    },
    findUser: async (_root: undefined, args: { username: string; }) => {
      return await User.findOne({username: args.username});
    }
  },
  Mutation: {
    createUser: async (_root: undefined, args: UserType) => {
      const user = new User({ ...args });
      return user.save()
        .catch(error => {
          if(error instanceof Error) {
            throw new UserInputError(error.message, {
              invalidArgs: args,
            });
          }
        });
    }
  }
};