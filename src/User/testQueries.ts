import { gql } from "apollo-server";

export const GET_ALL_USERS = gql`
  query AllUsers {
    allUsers {
      id
      username
      name
      date
      description
      image
      likes
      followed
    }
  }
`;

export const FIND_USER = gql`
  query FindUser($username: String) {
    findUser(username: $username) {
      id
      username
      name
      date
      description
      image
      likes
      followed
    }
  }
`;

export const ME = gql`
  query Me {
    me {
      id
      username
      name
      date
      description
      image
      likes
      followed
    }
  }
`;