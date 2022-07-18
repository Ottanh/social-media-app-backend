"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = exports.typeDefs = void 0;
const apollo_server_1 = require("apollo-server");
const mongoose_1 = __importDefault(require("mongoose"));
const post_1 = require("./Post/post");
const user_1 = require("./User/user");
const lodash_1 = require("lodash");
const model_1 = __importDefault(require("./User/model"));
const jsonwebtoken_1 = __importStar(require("jsonwebtoken"));
const config_1 = __importDefault(require("./config"));
const resolvers_1 = require("./S3/resolvers");
exports.typeDefs = (0, apollo_server_1.gql) `
  type Query {
    _empty: String
  }
`;
exports.resolvers = {};
void (() => __awaiter(void 0, void 0, void 0, function* () {
    mongoose_1.default.connect((yield config_1.default).MONGODB_URI)
        .then(() => {
        console.log('connected to MongoDB');
    })
        .catch((error) => {
        console.log('error connection to MongoDB:', error.message);
    });
    const server = new apollo_server_1.ApolloServer({
        typeDefs: [post_1.userTypeDef, user_1.postTypeDef, resolvers_1.s3TypeDefs, exports.typeDefs],
        resolvers: (0, lodash_1.merge)(resolvers_1.s3Resolvers, user_1.userResolver, post_1.postResolver, exports.resolvers),
        context: ({ req }) => __awaiter(void 0, void 0, void 0, function* () {
            const auth = req ? req.headers.authorization : null;
            if (auth && auth.toLowerCase().startsWith('bearer ')) {
                try {
                    const decodedToken = jsonwebtoken_1.default.verify(auth.substring(7), (yield config_1.default).SECRET);
                    const currentUser = yield model_1.default.findById(decodedToken.id, { name: 1, username: 1 });
                    return { currentUser };
                }
                catch (error) {
                    if (error instanceof jsonwebtoken_1.JsonWebTokenError) {
                        throw new apollo_server_1.UserInputError('Invalid authorization header');
                    }
                    else {
                        console.log(error);
                    }
                }
            }
            return { currentUser: null };
        })
    });
    server.listen({ port: (yield config_1.default).PORT }).then(({ url }) => {
        console.log(`Server ready at ${url}`);
    }, (reject) => {
        console.log(reject);
    });
}))();
