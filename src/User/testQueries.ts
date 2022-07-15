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

export const SEARCH_USER = gql`
  query SearchUser($searchword: String!) {
    searchUser(searchword: $searchword) {
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

export const CREATE_USER = gql`
  mutation CreateUser($username: String!, $password: String!, $name: String!) {
    createUser(username: $username, password: $password, name: $name) {
      token
      user {
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
  }
`;

export const LOGIN = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
      user {
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
  }
`;