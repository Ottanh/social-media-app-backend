import { Schema, model } from "mongoose";
import { PostType } from "./types";


export const postSchema = new Schema<PostType>({
  user: {
    id: {
      type: Schema.Types.ObjectId,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    username: {
      type: String,
      required: true
    }
  },
  content: {
    type: String,
    required: true
  },
  likes: {
    type: Number,
    required: true
  }
});

export const Post = model<PostType>('Post', postSchema);
export const Reply = model<PostType>('Reply', postSchema);
