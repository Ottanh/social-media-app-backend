import { Schema, model } from "mongoose";
import { PostType } from "./types";


const postSchema = new Schema<PostType>({
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