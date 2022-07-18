"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.s3Resolvers = exports.s3TypeDefs = void 0;
const apollo_server_1 = require("apollo-server");
const s3_signed_url_1 = require("./s3_signed_url");
exports.s3TypeDefs = (0, apollo_server_1.gql) `
  type Query {
     getPutUrl(fileName: String!): String
    getDeleteUrl(fileName: String!): String
   }
`;
exports.s3Resolvers = {
    Query: {
        getPutUrl: (_root, args, context) => __awaiter(void 0, void 0, void 0, function* () {
            if (!context.currentUser) {
                throw new apollo_server_1.AuthenticationError('Not authenticated');
            }
            return yield (0, s3_signed_url_1.getSignedPut)(args.fileName);
        }),
        getDeleteUrl: (_root, args, context) => __awaiter(void 0, void 0, void 0, function* () {
            if (!context.currentUser) {
                throw new apollo_server_1.AuthenticationError('Not authenticated');
            }
            return yield (0, s3_signed_url_1.getSignedDelete)(args.fileName);
        })
    }
};
