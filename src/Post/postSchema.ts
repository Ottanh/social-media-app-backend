import { Schema, model } from "mongoose";
import { PostType } from "./types";


const postSchema = new Schema<PostType>({
  userId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  date: {
    type: String,
    required: true
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

const Post = model<PostType>('Post', postSchema);
export default Post;