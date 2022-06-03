import { AuthenticationError, gql, UserInputError } from "apollo-server";
import { UserType } from "../User/types";
import Post from "./postSchema";
import { NewPost } from "./types";
import {Types} from 'mongoose';


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
    findPosts(username: String, id: String): [Post]! 
  }
  type Mutation {
    createPost(
      content: String!
      likes: Int!
    ): Post
    addLike(
      id: ID!
    ): Post
  }
`;

export const postResolver = {
  Post: {
    date: (root: { _id: Types.ObjectId} ) => {
      return root._id.getTimestamp().toISOString();
    }
  },
  Query: {
    findPosts: async (_root: undefined, args: { username: string; id: string }) => {
      if(args.username){
        return await Post.find({ 'user.username': args.username }).sort({_id: -1});
      }
      if(args.id){
        return await Post.find({ _id: args.id });
      }
      return await Post.find({}).sort({_id: -1});
      
    }
  },
  Mutation: {
    createPost: async (_root: undefined, args: NewPost, context: { currentUser: UserType; }) => {
      const currentUser = context.currentUser;

      if (!currentUser) {      
        throw new AuthenticationError("not authenticated");
      }

      const post = new Post({
         ...args, 
         user: { 
           id: currentUser.id,
           name: currentUser.name, 
           username: currentUser.username
          } 
        });
      return await post.save()
        .catch(error => {
          if(error instanceof UserInputError) {
            throw new UserInputError(error.message, {
              invalidArgs: args
            });
          }
        });

    },
    addLike: async (_root: undefined, args: { id: string}, context: { currentUser: UserType; }) => {
      const currentUser = context.currentUser;
      if (!currentUser) {      
        throw new AuthenticationError("not authenticated");
      }
      return await Post.findByIdAndUpdate(args.id, { $inc: { likes: 1}}, { new: true });
    }
  }
};