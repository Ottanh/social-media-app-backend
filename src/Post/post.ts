import { AuthenticationError, gql, UserInputError } from "apollo-server";
import { UserDoc, UserType } from "../User/types";
import { Post, Reply } from "./model";
import { NewPost, NewReply } from "./types";
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
    replies: [ID]!
  }
  extend type Query {
    findPosts(username: String, id: String, replyTo: String): [Post]!
    countPostReplies(id: String): Int!
  }
  type Mutation {
    createPost(
      content: String!
    ): Post
    createReply (
      content: String!
      replyTo: String!
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
    findPosts: async (_root: undefined, args: { username: string; id: string; replyTo: string; }) => {
      if(args.username){
        return await Post.find({ 'user.username': args.username }).sort({_id: -1});
      }
      if(args.id){
        let post = await Post.findById(args.id);
        if(!post){
          post = await Reply.findById(args.id);
        }
        return [post];
      }
      if(args.replyTo){
        return await Reply.find({replyTo: args.replyTo}).sort({_id: -1});
      }
      return await Post.find({}).sort({_id: -1});
      
    },
    countPostReplies: async (_root: undefined, args: { id: string}) => {
      const [post, reply] = await Promise.allSettled([
        Post.findById(args.id), 
        Reply.findById(args.id)
      ]);
      if(post.status === 'fulfilled' && reply.status === 'fulfilled') {
        if(post.value && !reply.value) {
          return post.value?.replies.length;
        }
        if(reply.value && !post.value) {
          return reply.value?.replies.length;
        }
      } else {
        throw new Error('Error finding post');
      }
      return -1;
    }
  },
  Mutation: {
    createPost: async (_root: undefined, args: NewPost, context: { currentUser: UserType; }) => {
      const currentUser = context.currentUser;

      if (!currentUser) {      
        throw new AuthenticationError("not authenticated");
      }

      const newPost = new Post({
        ...args, 
        user: { 
          id: currentUser.id,
          name: currentUser.name, 
          username: currentUser.username
         } 
       });

      return await newPost.save()
        .catch(error => {
          if(error instanceof UserInputError) {
            throw new UserInputError(error.message, {
              invalidArgs: args
            });
          }
        });
    },
    createReply: async (_root: undefined, args: NewReply, context: { currentUser: UserType; }) => {
      const currentUser = context.currentUser;

      if (!currentUser) {      
        throw new AuthenticationError("not authenticated");
      }

      const newReply = new Reply({
          ...args, 
          user: { 
            id: currentUser.id,
            name: currentUser.name, 
            username: currentUser.username
           } 
         });

      const [originalPost, originalReply] = await Promise.allSettled([
        Post.findByIdAndUpdate(args.replyTo, { $push: { replies: newReply._id}}), 
        Reply.findByIdAndUpdate(args.replyTo, { $push: { replies: newReply._id}})
      ]);

      if(!originalPost && !originalReply) {
        throw new UserInputError('Could not find original post',{
          invalidArgs: args.replyTo
        });
      }

      return await newReply.save()
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