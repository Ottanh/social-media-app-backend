import { Types, Document } from "mongoose";

export interface UserType {
  id: string;
  name: string;
  username: string;
  passwordHash: string;
  description: string;
  likes: Types.ObjectId[];
}

export interface UserToken {
  username: string;
  id: string;
}

export interface CreateUser extends Omit<UserType, 'passwordHash'> {
  password: string;
}


export interface CurrentUser {
  _id: Types.ObjectId;
  name: string;
  username: string;
}

export type UserDoc = Document<unknown, UserType> & UserType & { _id: Types.ObjectId; };