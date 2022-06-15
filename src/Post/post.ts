import { AuthenticationError, gql, UserInputError } from "apollo-server";
import { CurrentUser } from "../User/types";
import { Post } from "./model";
import { NewPost } from "./types";
import { Types } from 'mongoose';
import User from "../User/model";


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
    replies: [ID]!
  }
  extend type Query {
    findPosts(username: String, id: String, replyTo: String): [Post]!
  }
  type Mutation {
    createPost(
      content: String!
    ): Post
    addLike(id: ID!): Post
    deleteLike(id: ID!): Post
  }
`;

export const postResolver = {
  Post: {
    date: (root: { _id: Types.ObjectId} ) => {
      return root._id.getTimestamp().toISOString();
    },
  },
  Query: {
    findPosts: async (_root: undefined, args: { username: string; id: string; replyTo: string; }) => {
      if(args.username){
        const a = await Post.find({ 'user.username': args.username }).sort({_id: -1});
        console.log(a[0]);
        return a;
      }
      if(args.id){
        const post = await Post.findById(args.id);
        console.log(post);
        return [post];
      }
      if(args.replyTo){
        return await Post.find({replyTo: args.replyTo}).sort({_id: -1});
      }
      return await Post.find({}).sort({_id: -1});
    },
  },
  Mutation: {
    createPost: async (_root: undefined, args: NewPost, context: { currentUser: CurrentUser; }) => {
      const currentUser = context.currentUser;
      if (!currentUser) {      
        throw new AuthenticationError("Not authenticated");
      } 

      if(args.replyTo && await Post.exists({ _id: args.replyTo })){
        throw new UserInputError('Could not find original post',{
          invalidArgs: args.replyTo
        });
      }

      const newPost = new Post({
        ...args, 
        user: { ...currentUser } 
       });

      try {
        return await newPost.save();
      }
      catch(error) {
        if(error instanceof UserInputError) {
          throw new UserInputError(error.message, {
            invalidArgs: args
          });
        } else if (error instanceof Error) {
          throw new Error(error.message);
        } else {
          console.log(error);
          return null;
        }
      }
    },
    addLike: async (_root: undefined, args: { id: string}, context: { currentUser: CurrentUser }) => {
      const currentUser = context.currentUser;
      if (!currentUser) {      
        throw new AuthenticationError('not authenticated');
      }

      const user = await User.updateOne({ _id: currentUser._id}, { $addToSet: { likes:  args.id}});

      if(user.modifiedCount > 0) {
        const post = await Post.findByIdAndUpdate(args.id, { $inc: { likes: 1}});
        if(!post) {
          throw new TypeError('Post not found');
        }
        return post;
      } else {
        throw new UserInputError('User has already liked the post');
      }
    },
    deleteLike: async (_root: undefined, args: { id: string}, context: { currentUser: CurrentUser }) => {
      const currentUser = context.currentUser;
      if (!currentUser) {      
        throw new AuthenticationError('not authenticated');
      }

      const user = await User.updateOne({ _id: currentUser._id}, { $pull: { likes:  args.id}});

      if(user.modifiedCount > 0) {
        const post = await Post.findByIdAndUpdate(args.id, { $inc: { likes: -1}});
        if(!post) {
          throw new TypeError('Post not found');
        }
        return post;
      } else {
        throw new UserInputError('User has not liked the post');
      }
    }
  }
};