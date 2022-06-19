import { Schema, model } from "mongoose";
import { UserType } from "./types";


const userSchema = new Schema<UserType>({
  name: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  description: String,
  likes: [Schema.Types.ObjectId],
  followed: {
    type: [Schema.Types.ObjectId],
    required: false,
    default: [],
  }
});

const User = model<UserType>('User', userSchema);
export default User;