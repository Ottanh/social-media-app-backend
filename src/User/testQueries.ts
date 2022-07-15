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