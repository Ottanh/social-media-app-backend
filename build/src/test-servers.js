"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testServerLoggedIn = exports.testServer = exports.loggedInUserID = void 0;
const apollo_server_1 = require("apollo-server");
const lodash_1 = require("lodash");
const mongoose_1 = __importDefault(require("mongoose"));
const _1 = require(".");
const post_1 = require("./Post/post");
const resolvers_1 = require("./S3/resolvers");
const user_1 = require("./User/user");
exports.loggedInUserID = new mongoose_1.default.Types.ObjectId();
exports.testServer = new apollo_server_1.ApolloServer({
    typeDefs: [post_1.userTypeDef, user_1.postTypeDef, resolvers_1.s3TypeDefs, _1.typeDefs],
    resolvers: (0, lodash_1.merge)(resolvers_1.s3Resolvers, user_1.userResolver, post_1.postResolver, _1.resolvers),
    context: { currentUser: null }
});
exports.testServerLoggedIn = new apollo_server_1.ApolloServer({
    typeDefs: [post_1.userTypeDef, user_1.postTypeDef, resolvers_1.s3TypeDefs, _1.typeDefs],
    resolvers: (0, lodash_1.merge)(resolvers_1.s3Resolvers, user_1.userResolver, post_1.postResolver, _1.resolvers),
    context: { currentUser: { _id: exports.loggedInUserID, name: 'testUser', username: 'testUserName' } }
});
