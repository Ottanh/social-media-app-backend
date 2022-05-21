import { gql } from "apollo-server";


export const userTypeDef = gql`
  type User {
    id: ID!
    username: String!
    name: String!
    joined: String!
    description: String
    posts: [Post]!
  }
`;