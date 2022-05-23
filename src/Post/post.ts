import { gql } from "apollo-server";
import Post from "./postSchema";


export const userTypeDef = gql`
  type PostUser {
    id: ID!
    name: String!
    username: String!
  }
  type Post {
    id: ID!
    user: PostUser!
    date: String!
    content: String!
    likes: Int!
  }
  extend type Query {
    findPosts(username: String): [Post]! 
  }
`;

export const postResolver = {
  Query: {
    findPosts: async (_root: undefined, args: { username: string; }) => {
      if(!args.username){
        return await Post.find({});
      }
      return await Post.find({ 'user.username': args.username });
    }
  },
};