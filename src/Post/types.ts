import { Types } from "mongoose";

export interface PostType {
  _id: Types.ObjectId;
  user: {
    _id: string;
    name: string;
    username: string;
  };
  content?: string;
  image?: string;
  likes: number;
  replyTo?: Types.ObjectId;
  replies: Types.ObjectId[];
}


export interface NewPost {
  content: string;
  image?: string;
  replyTo?: Types.ObjectId;
}

