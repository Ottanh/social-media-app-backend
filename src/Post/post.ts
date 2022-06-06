import { AuthenticationError, gql, UserInputError } from "apollo-server";
import { UserDoc, UserType } from "../User/types";
import {Post, Reply} from "./model";
import { NewPost } from "./types";
import { Types } from 'mongoose';


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
    replyTo: ID
  }
  extend type Query {
    findPosts(username: String, id: String): [Post]! 
    getReplies(id: String!): [Post]!
  }
  type Mutation {
    createPost(
      content: String!
      replyTo: String
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
      
    },
    getReplies: async (_root: undefined, args: { id: string }) => {
      const post = await Post.findById(args.id);
      return await Reply.find({ replyTo: post?._id });
    }
  },
  Mutation: {
    createPost: async (_root: undefined, args: NewPost, context: { currentUser: UserType; }) => {
      const currentUser = context.currentUser;

      if (!currentUser) {      
        throw new AuthenticationError("not authenticated");
      }

      let newPost;
      if(args.replyTo){
        newPost = new Reply({
          ...args, 
          replies: [],
          likes: 0,
          user: { 
            id: currentUser.id,
            name: currentUser.name, 
            username: currentUser.username
           } 
         });
      } else {
        newPost = new Post({
          ...args, 
          replies: [],
          likes: 0,
          user: { 
            id: currentUser.id,
            name: currentUser.name, 
            username: currentUser.username
           } 
         });
      }

      return await newPost.save()
        .catch(error => {
          if(error instanceof UserInputError) {
            throw new UserInputError(error.message, {
              invalidArgs: args
            });
          }
        });
    },
    addLike: async (_root: undefined, args: { id: string}, context: { currentUser: UserDoc }) => {
      const currentUser = context.currentUser;
      if (!currentUser) {      
        throw new AuthenticationError('not authenticated');
      }

      const post = await Post.findById(args.id);

      if(!post) {
        throw new TypeError('Post found is undefined');
      }
      if(currentUser.likes.includes(post._id)) {
        throw new UserInputError('User has already liked the post');
      }

      post.likes = (post.likes + 1);
      currentUser.likes = currentUser.likes.concat(post._id);
      await currentUser.save();
      return await post.save();
    }
  }
};