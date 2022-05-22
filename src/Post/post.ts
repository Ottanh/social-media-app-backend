import { gql } from "apollo-server";


export const userTypeDef = gql`
  type Post {
    id: ID!
    userId: ID!
    date: String!
    content: String!
    likes: Int!
  }
`;