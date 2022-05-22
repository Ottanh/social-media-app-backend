import { Schema, model } from "mongoose";
import { PostType } from "../Post/postSchema";

export interface UserType {
  username: string;
  name: string;
  joined: string;
  description: string;
  posts: PostType[]
}


const userSchema = new Schema<UserType>({
  username: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  joined: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  posts: [{
    type: Schema.Types.ObjectId,
    required: false,
    default: []
  }],
});

const User = model<UserType>('User', userSchema);
export default User;