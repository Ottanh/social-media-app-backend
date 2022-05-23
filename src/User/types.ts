import { PostType } from "../Post/types";


export interface UserType {
  username: string;
  passwordHash: string;
  name: string;
  joined: string;
  description: string;
  posts: PostType[]
}

export interface UserToken {
  username: string;
  id: string;
}

export interface CreateUser extends Omit<UserType, 'passwordHash'> {
  password: string;
}