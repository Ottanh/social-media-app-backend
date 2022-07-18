"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EDIT_USER = exports.UNFOLLOW = exports.FOLLOW = exports.LOGIN = exports.CREATE_USER = exports.SEARCH_USER = exports.ME = exports.FIND_USER = exports.GET_ALL_USERS = void 0;
const apollo_server_1 = require("apollo-server");
exports.GET_ALL_USERS = (0, apollo_server_1.gql) `
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
exports.FIND_USER = (0, apollo_server_1.gql) `
  query FindUser($username: String!) {
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
exports.ME = (0, apollo_server_1.gql) `
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
exports.SEARCH_USER = (0, apollo_server_1.gql) `
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
exports.CREATE_USER = (0, apollo_server_1.gql) `
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
exports.LOGIN = (0, apollo_server_1.gql) `
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
exports.FOLLOW = (0, apollo_server_1.gql) `
  mutation Follow($followId: ID!) {
    follow(id: $followId) {
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
exports.UNFOLLOW = (0, apollo_server_1.gql) `
  mutation UnFollow($unFollowId: ID!) {
    unFollow(id: $unFollowId) {
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
exports.EDIT_USER = (0, apollo_server_1.gql) `
  mutation EditUser($description: String, $image: String) {
    editUser(description: $description, image: $image) {
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
