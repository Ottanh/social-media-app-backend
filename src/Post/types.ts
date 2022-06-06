import { Types } from "mongoose";

export interface PostType {
  user: {
    id: string;
    name: string;
    username: string;
  };
  content: string;
  likes: number;
  replies: Types.ObjectId[]; 
}


export interface NewPost {
  content: string;
  likes: number;
  replyTo: Types.ObjectId | null;
}