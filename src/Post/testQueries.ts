import { gql } from "apollo-server";


export const FIND_POSTS = gql`
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

export const SEARCH_POST = gql`
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

export const FIND_POST = gql`
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

export const CREATE_POST = gql`
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
