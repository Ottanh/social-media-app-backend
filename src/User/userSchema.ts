import { Schema, model } from "mongoose";
import { UserType } from "./types";


const userSchema = new Schema<UserType>({
  username: {
    type: String,
    required: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  likes: [Schema.Types.ObjectId]
});

const User = model<UserType>('User', userSchema);
export default User;