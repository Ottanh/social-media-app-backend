import { Types } from "mongoose";

export interface UserType {
  _id: Types.ObjectId;
  name: string;
  username: string;
  passwordHash: string;
  description: string;
  image: string;
  likes: Types.ObjectId[];
  followed: Types.ObjectId[];
}

export interface UserToken {
  username: string;
  id: string;
}

export interface NewUser  {
  name: string;
  username: string;
  password: string;
}


export interface CurrentUser {
  _id: Types.ObjectId;
  name: string;
  username: string;
}
