import { ApolloServer } from "apollo-server";
import { merge } from "lodash";
import mongoose from "mongoose";
import { typeDefs, resolvers } from ".";
import { userTypeDef, postResolver } from "./Post/post";
import { postTypeDef, userResolver } from "./User/user";

export const loggedInUserID = new mongoose.Types.ObjectId();

export const testServer = new ApolloServer({
  typeDefs: [userTypeDef, postTypeDef, typeDefs],
  resolvers: merge(resolvers, userResolver, postResolver),
  context: { currentUser: null }
});

export const testServerLoggedIn = new ApolloServer({
  typeDefs: [userTypeDef, postTypeDef, typeDefs],
  resolvers: merge(resolvers, userResolver, postResolver),
  context: { currentUser: { _id: loggedInUserID, name: 'testUser', username: 'testUserName' } }
});
