import { ApolloServer } from "apollo-server";
import { merge } from "lodash";
import mongoose from "mongoose";
import { resolvers, typeDefs } from ".";
import { userTypeDef, postResolver } from "./Post/post";
import { s3TypeDefs, s3Resolvers } from "./S3/resolvers";
import { postTypeDef, userResolver } from "./User/user";

export const loggedInUserID = new mongoose.Types.ObjectId();

export const testServer = new ApolloServer({
  typeDefs: [userTypeDef, postTypeDef, s3TypeDefs, typeDefs],
  resolvers: merge(s3Resolvers, userResolver, postResolver, resolvers),
  context: { currentUser: null }
});

export const testServerLoggedIn = new ApolloServer({
  typeDefs: [userTypeDef, postTypeDef, s3TypeDefs, typeDefs],
  resolvers: merge(s3Resolvers, userResolver, postResolver, resolvers),
  context: { currentUser: { _id: loggedInUserID, name: 'testUser', username: 'testUserName' } }
});
