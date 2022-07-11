import { AuthenticationError, gql, UserInputError } from "apollo-server";
import { CurrentUser } from "../User/types";
import { Post } from "./model";
import { NewPost } from "./types";
import mongoose, { Types } from 'mongoose';
import User from "../User/model";
import { arrayRemove } from "../util";
import { getSignedGet } from "../S3/s3_signed_url";


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
    image: String
    likes: Int!
    replyTo: ID
    replies: [ID]!
  }
  type LikeResponse {
    post: Post
    user: User
  }
  extend type Query {
    findPosts(username: String, replyTo: String, userIds: [String]): [Post]!
    findPost(id: String!): Post
    searchPost(searchword: String!): [Post]!
  }
  type Mutation {
    createPost(
      content: String!
      image: String
      replyTo: String
    ): Post
    addLike(id: ID!): LikeResponse
    deleteLike(id: ID!): LikeResponse
  }
`;

export const postResolver = {
  Post: {
    date: (root: { _id: Types.ObjectId} ) => {
      return root._id.getTimestamp().toISOString();
    },
    image: async (root: { image: string} ) => {
      if(!root.image) {
        return null;
      }

      return await getSignedGet(root.image);
    },
  },
  PostUser: {
    id: (root: { _id: Types.ObjectId } ) => {
      return root._id;
    },
  },
  Query: {
    findPosts: async (_root: undefined, args: { username: string; userIds: string[]; replyTo: string; }) => {
      if(args.username){
        return await Post.find({ 'user.username': args.username, replyTo: null }).sort({_id: -1});
      }
      if(args.userIds){
        return await Post.find({ "user._id": { $in: args.userIds}, replyTo: null }).sort({_id: -1});
      }
      if(args.replyTo){
        return await Post.find({replyTo: args.replyTo}).sort({_id: -1});
      }
      return await Post.find({}).sort({_id: -1});
    },
    findPost: async (_root: undefined, args: { id: string; }) => {
      return await Post.findById(args.id);
    },
    searchPost: async (_root: undefined, args: { searchword: string }) => {
      if(args.searchword.length < 3) {
        return [];
      }
      return await Post.find({ content: { $regex: `.*${args.searchword}.*`, $options: 'i' } });
    }
  },
  Mutation: {
    createPost: async (_root: undefined, args: NewPost, context: { currentUser: CurrentUser; }) => {
      const currentUser = context.currentUser;
      if (!currentUser) {      
        throw new AuthenticationError("Not authenticated");
      } 

      if(args.replyTo && !await Post.exists({ _id: args.replyTo })){
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
        throw new AuthenticationError('Not authenticated');
      }

      const user = await User.findById(currentUser._id);
      if(!user) {
        throw new TypeError('User not found');
      }

      if(user.likes.includes(new mongoose.Types.ObjectId(args.id))) {
        throw new UserInputError('User has already liked the post');
      } else {
        user.likes = user.likes.concat(new mongoose.Types.ObjectId(args.id));
        const savedUser = await user.save();
        const post = await Post.findByIdAndUpdate(args.id, { $inc: { likes: 1 }}, { new: true});
        if(!post) {
          throw new TypeError('Post not found');
        }
        return { post, user: savedUser };
      }
    },
    deleteLike: async (_root: undefined, args: { id: string}, context: { currentUser: CurrentUser }) => {
      const currentUser = context.currentUser;
      if (!currentUser) {      
        throw new AuthenticationError('Not authenticated');
      }

      const user = await User.findById(currentUser._id);
      if(!user) {
        throw new TypeError('User not found');
      }

      if(!user.likes.includes(new mongoose.Types.ObjectId(args.id))) {
        throw new UserInputError('User has not liked the post');
      } else {
        user.likes = arrayRemove(new mongoose.Types.ObjectId(args.id), user.likes);
        const savedUser = await  user.save();
        const post = await Post.findByIdAndUpdate(args.id, { $inc: { likes: -1}}, { new: true});
        if(!post) {
          throw new TypeError('Post not found');
        }
        return { post, user: savedUser };
      }
    }
  }
};