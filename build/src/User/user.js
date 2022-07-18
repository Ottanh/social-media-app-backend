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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userResolver = exports.postTypeDef = void 0;
const apollo_server_1 = require("apollo-server");
const model_1 = __importDefault(require("./model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
const s3_signed_url_1 = require("../S3/s3_signed_url");
exports.postTypeDef = (0, apollo_server_1.gql) `
  type User {
    id: ID!
    username: String!
    name: String!
    date: String!
    description: String
    image: String!
    likes: [ID]!
    followed: [ID]!
  }
  type Token {
    value: String!
  }
  type TokenAndUser {
    token: String!
    user: User!
  }
  extend type Query {
    allUsers: [User]!
    findUser(username: String!): User
    findUsers(userIds: [String]!): [User]
    me: User
    searchUser(searchword: String!): [User]
  }
  type Mutation {
    createUser(
      username: String!
      password: String!
      name: String!
    ): TokenAndUser
    login(
      username: String!
      password: String!
    ): TokenAndUser
    follow(id: ID!): User!
    unFollow(id: ID!): User!
    editUser(description: String image: String): User!
  }
`;
exports.userResolver = {
    User: {
        date: (root) => {
            return root._id.getTimestamp();
        },
        image: (root) => __awaiter(void 0, void 0, void 0, function* () {
            if (!root.image) {
                return null;
            }
            return yield (0, s3_signed_url_1.getSignedGet)(root.image);
        }),
    },
    Query: {
        allUsers: () => __awaiter(void 0, void 0, void 0, function* () {
            return yield model_1.default.find({});
        }),
        findUser: (_root, args) => __awaiter(void 0, void 0, void 0, function* () {
            return yield model_1.default.findOne({ username: args.username });
        }),
        findUsers: (_root, args) => __awaiter(void 0, void 0, void 0, function* () {
            return yield model_1.default.find({ _id: { $in: args.userIds } });
        }),
        me: (_root, _args, context) => __awaiter(void 0, void 0, void 0, function* () {
            if (!context.currentUser) {
                return null;
            }
            return yield model_1.default.findById(context.currentUser._id);
        }),
        searchUser: (_root, args) => __awaiter(void 0, void 0, void 0, function* () {
            if (args.searchword.length < 3) {
                return [];
            }
            return yield model_1.default.find({ username: { $regex: `.*${args.searchword}.*`, $options: 'i' } });
        })
    },
    Mutation: {
        createUser: (_root, args) => __awaiter(void 0, void 0, void 0, function* () {
            const saltRounds = 13;
            const passwordHash = yield bcrypt_1.default.hash(args.password, saltRounds);
            const user = new model_1.default(Object.assign(Object.assign({}, args), { passwordHash }));
            const userForToken = {
                username: user.username,
                id: user._id,
            };
            const savedUser = yield user.save()
                .catch((error) => {
                if (error instanceof Error) {
                    throw new apollo_server_1.UserInputError(error.message, {
                        invalidArgs: args,
                    });
                }
            });
            return { token: jsonwebtoken_1.default.sign(userForToken, (yield config_1.default).SECRET), user: savedUser };
        }),
        login: (_root, args) => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield model_1.default.findOne({ username: args.username });
            const passwordCorrect = user === null
                ? false
                : yield bcrypt_1.default.compare(args.password, user.passwordHash);
            if (!(user && passwordCorrect)) {
                throw new apollo_server_1.UserInputError("Wrong credentials");
            }
            const userForToken = {
                username: user.username,
                id: user._id,
            };
            return { token: jsonwebtoken_1.default.sign(userForToken, (yield config_1.default).SECRET), user };
        }),
        follow: (_root, args, context) => __awaiter(void 0, void 0, void 0, function* () {
            const currentUser = context.currentUser;
            if (!currentUser) {
                throw new apollo_server_1.AuthenticationError('Not authenticated');
            }
            return yield model_1.default.findByIdAndUpdate(currentUser._id, { $addToSet: { followed: args.id } }, { new: true });
        }),
        unFollow: (_root, args, context) => __awaiter(void 0, void 0, void 0, function* () {
            const currentUser = context.currentUser;
            if (!currentUser) {
                throw new apollo_server_1.AuthenticationError('Not authenticated');
            }
            return yield model_1.default.findByIdAndUpdate(currentUser._id, { $pull: { followed: args.id } }, { new: true });
        }),
        editUser: (_root, args, context) => __awaiter(void 0, void 0, void 0, function* () {
            const currentUser = context.currentUser;
            if (!currentUser) {
                throw new apollo_server_1.AuthenticationError('Not authenticated');
            }
            return yield model_1.default.findByIdAndUpdate(currentUser._id, { description: args.description, image: args.image }, { new: true });
        })
    }
};
