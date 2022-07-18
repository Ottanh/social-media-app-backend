"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DELETE_LIKE = exports.ADD_LIKE = exports.CREATE_POST = exports.FIND_POST = exports.SEARCH_POST = exports.FIND_POSTS = void 0;
const apollo_server_1 = require("apollo-server");
exports.FIND_POSTS = (0, apollo_server_1.gql) `
  query findPosts($username: String, $replyTo: String, $userIds: [String]) {
    findPosts (username: $username, replyTo: $replyTo, userIds: $userIds) { 
      id
      user {
        id
        name
        username
      }
      date
      content
      image
      likes
      replyTo
      replies
    }
  }
`;
exports.SEARCH_POST = (0, apollo_server_1.gql) `
  query searchPost($searchword: String!) {
    searchPost(searchword: $searchword) { 
      id
      user {
      id
        name
        username
      }
       date
      content
      likes
      replies
    }
  }
`;
exports.FIND_POST = (0, apollo_server_1.gql) `
  query findPost($id: String!) {
    findPost(id: $id) { 
      id
      user {
        name
        username
      }
      date
      content
      image
      likes
      replies
    }
  }
`;
exports.CREATE_POST = (0, apollo_server_1.gql) `
  mutation createPost($content: String!, $image: String, $replyTo: String) {
    createPost(content: $content, image: $image, replyTo: $replyTo) {
      id
      date
      content
      image
      likes
      replyTo
      replies
      user {
        id
        name
        username
      }
    }
  }
`;
exports.ADD_LIKE = (0, apollo_server_1.gql) `
  mutation addLike($id: ID!) {
    addLike(id: $id) {
      post {
        id
        likes
      }
      user {
        id
        likes
      }
    }
  }
`;
exports.DELETE_LIKE = (0, apollo_server_1.gql) `
  mutation deleteLike($id: ID!) {
    deleteLike(id: $id) {
      post {
        id
        likes
      }
      user {
        id
        likes
      }
    }
  }
`;
