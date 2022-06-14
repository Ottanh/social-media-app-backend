import { Types } from "mongoose";

export interface PostType {
  user: {
    id: string;
    name: string;
    username: string;
  };
  content: string;
  likes: number;
  replyTo: Types.ObjectId;
  replies: Types.ObjectId[];
}


export interface NewPost {
  content: string;
}

export interface NewReply {
  content: string;
  replyTo: Types.ObjectId;
}