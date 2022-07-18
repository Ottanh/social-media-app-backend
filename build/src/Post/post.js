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
exports.postResolver = exports.userTypeDef = void 0;
const apollo_server_1 = require("apollo-server");
const model_1 = require("./model");
const mongoose_1 = __importDefault(require("mongoose"));
const model_2 = __importDefault(require("../User/model"));
const util_1 = require("../util");
const s3_signed_url_1 = require("../S3/s3_signed_url");
exports.userTypeDef = (0, apollo_server_1.gql) `
  type PostUser {
    id: ID!
    name: String!
    username: String!
  }
  type Post {
    id: ID!
    user: PostUser!
    date: String!
    content: String!
    image: String
    likes: Int!
    replyTo: ID
    replies: [ID]!
  }
  type LikeResponse {
    post: Post
    user: User
  }
  extend type Query {
    findPosts(username: String, replyTo: String, userIds: [String]): [Post]!
    findPost(id: String!): Post
    searchPost(searchword: String!): [Post]!
  }
  type Mutation {
    createPost(
      content: String!
      image: String
      replyTo: String
    ): Post
    addLike(id: ID!): LikeResponse
    deleteLike(id: ID!): LikeResponse
  }
`;
exports.postResolver = {
    Post: {
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
    PostUser: {
        id: (root) => {
            return root._id;
        },
    },
    Query: {
        findPosts: (_root, args) => __awaiter(void 0, void 0, void 0, function* () {
            if (args.username) {
                return yield model_1.Post.find({ 'user.username': args.username, replyTo: null }).sort({ _id: -1 });
            }
            if (args.userIds) {
                return yield model_1.Post.find({ "user._id": { $in: args.userIds }, replyTo: null }).sort({ _id: -1 });
            }
            if (args.replyTo) {
                return yield model_1.Post.find({ replyTo: args.replyTo }).sort({ _id: -1 });
            }
            return yield model_1.Post.find({}).sort({ _id: -1 });
        }),
        findPost: (_root, args) => __awaiter(void 0, void 0, void 0, function* () {
            return yield model_1.Post.findById(args.id);
        }),
        searchPost: (_root, args) => __awaiter(void 0, void 0, void 0, function* () {
            if (args.searchword.length < 3) {
                return [];
            }
            return yield model_1.Post.find({ content: { $regex: `.*${args.searchword}.*`, $options: 'i' } });
        })
    },
    Mutation: {
        createPost: (_root, args, context) => __awaiter(void 0, void 0, void 0, function* () {
            const currentUser = context.currentUser;
            if (!currentUser) {
                throw new apollo_server_1.AuthenticationError("Not authenticated");
            }
            if (args.replyTo && !(yield model_1.Post.exists({ _id: args.replyTo }))) {
                throw new apollo_server_1.UserInputError('Could not find original post', {
                    invalidArgs: args.replyTo
                });
            }
            const newPost = new model_1.Post(Object.assign(Object.assign({}, args), { user: Object.assign({}, currentUser) }));
            try {
                return yield newPost.save();
            }
            catch (error) {
                if (error instanceof apollo_server_1.UserInputError) {
                    throw new apollo_server_1.UserInputError(error.message, {
                        invalidArgs: args
                    });
                }
                else if (error instanceof Error) {
                    throw new Error(error.message);
                }
                else {
                    console.log(error);
                    return null;
                }
            }
        }),
        addLike: (_root, args, context) => __awaiter(void 0, void 0, void 0, function* () {
            const currentUser = context.currentUser;
            if (!currentUser) {
                throw new apollo_server_1.AuthenticationError('Not authenticated');
            }
            const user = yield model_2.default.findById(currentUser._id);
            if (!user) {
                throw new TypeError('User not found');
            }
            if (user.likes.includes(new mongoose_1.default.Types.ObjectId(args.id))) {
                throw new apollo_server_1.UserInputError('User has already liked the post');
            }
            else {
                user.likes = user.likes.concat(new mongoose_1.default.Types.ObjectId(args.id));
                const savedUser = yield user.save();
                const post = yield model_1.Post.findByIdAndUpdate(args.id, { $inc: { likes: 1 } }, { new: true });
                if (!post) {
                    throw new TypeError('Post not found');
                }
                return { post, user: savedUser };
            }
        }),
        deleteLike: (_root, args, context) => __awaiter(void 0, void 0, void 0, function* () {
            const currentUser = context.currentUser;
            if (!currentUser) {
                throw new apollo_server_1.AuthenticationError('Not authenticated');
            }
            const user = yield model_2.default.findById(currentUser._id);
            if (!user) {
                throw new TypeError('User not found');
            }
            if (!user.likes.includes(new mongoose_1.default.Types.ObjectId(args.id))) {
                throw new apollo_server_1.UserInputError('User has not liked the post');
            }
            else {
                user.likes = (0, util_1.arrayRemove)(new mongoose_1.default.Types.ObjectId(args.id), user.likes);
                const savedUser = yield user.save();
                const post = yield model_1.Post.findByIdAndUpdate(args.id, { $inc: { likes: -1 } }, { new: true });
                if (!post) {
                    throw new TypeError('Post not found');
                }
                return { post, user: savedUser };
            }
        })
    }
};
