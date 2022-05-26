

export interface UserType {
  id?: string;
  username: string;
  passwordHash: string;
  name: string;
  description: string;
}

export interface UserToken {
  username: string;
  id: string;
}

export interface CreateUser extends Omit<UserType, 'passwordHash'> {
  password: string;
}