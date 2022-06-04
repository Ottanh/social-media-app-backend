import { Types, Document } from "mongoose";


export interface UserType {
  id: string;
  username: string;
  passwordHash: string;
  name: string;
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

export type UserDoc = Document<unknown, UserType> & UserType & { _id: Types.ObjectId; };