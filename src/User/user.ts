import { gql } from "apollo-server";
import Post from "../Post/postSchema";
import User from "./userSchema";


export const postTypeDef = gql`
  extend type Query {
    allUsers: [User]!
    findUser(username: String!): User
  }
  type Post {
    id: ID!
    userId: ID!
    date: String!
    content: String!
    likes: Int!
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
  }
};