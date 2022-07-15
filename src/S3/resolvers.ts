import { gql, AuthenticationError } from "apollo-server";
import { CurrentUser } from "../User/types";
import { getSignedPut, getSignedDelete } from "./s3_signed_url";

export const typeDefs = gql`
  type Query {
    _empty: String
     getPutUrl(fileName: String!): String
    getDeleteUrl(fileName: String!): String
   }
`;

export const s3Resolvers = {
  Query: {
    getPutUrl: async (_root: undefined, args: { fileName: string; }, context: { currentUser: CurrentUser }) => {
      if (!context.currentUser) {      
        throw new AuthenticationError('Not authenticated');
      }
      return await getSignedPut(args.fileName);
    },
    getDeleteUrl: async (_root: undefined, args: { fileName: string; }, context: { currentUser: CurrentUser }) => {
      if (!context.currentUser) {      
        throw new AuthenticationError('Not authenticated');
      }
      return await getSignedDelete(args.fileName);
    }
  }
};