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
const model_1 = require("./model");
const mongoose_1 = __importDefault(require("mongoose"));
const testQueries_1 = require("./testQueries");
const model_2 = __importDefault(require("../User/model"));
const test_servers_1 = require("../test-servers");
const postID1 = new mongoose_1.default.Types.ObjectId();
const postID2 = new mongoose_1.default.Types.ObjectId();
const userID2 = new mongoose_1.default.Types.ObjectId();
const initialPosts = [
    {
        _id: postID1,
        content: 'test1',
        image: 'defaultUserPic.png',
        replyTo: null,
        user: {
            _id: test_servers_1.loggedInUserID,
            name: 'testUser',
            username: 'testUserName'
        }
    },
    {
        _id: postID2,
        content: 'test2',
        image: null,
        replyTo: postID1,
        user: {
            _id: userID2,
            name: 'testUser2',
            username: 'testUserName2'
        }
    },
    {
        content: 'test3',
        image: null,
        replyTo: null,
        user: {
            _id: userID2,
            name: 'testUser2',
            username: 'testUserName2'
        }
    },
];
const user = {
    _id: test_servers_1.loggedInUserID,
    name: 'testUser',
    username: 'testUserName',
    passwordHash: 'password'
};
beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
    jest.setTimeout(20000);
    yield model_1.Post.deleteMany({});
    yield model_2.default.deleteMany({});
    let postObject = new model_1.Post(initialPosts[0]);
    yield postObject.save();
    postObject = new model_1.Post(initialPosts[1]);
    yield postObject.save();
    postObject = new model_1.Post(initialPosts[2]);
    yield postObject.save();
    const userObject = new model_2.default(user);
    yield userObject.save();
}));
describe('findPosts', () => {
    test('Returns all posts', () => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d;
        const result = yield test_servers_1.testServer.executeOperation({
            query: testQueries_1.FIND_POSTS,
        });
        expect(result.errors).toBeUndefined();
        expect((_a = result.data) === null || _a === void 0 ? void 0 : _a.findPosts).toHaveLength(3);
        expect((_b = result.data) === null || _b === void 0 ? void 0 : _b.findPosts[0].content).toBe('test3');
        expect((_c = result.data) === null || _c === void 0 ? void 0 : _c.findPosts[1].content).toBe('test2');
        expect((_d = result.data) === null || _d === void 0 ? void 0 : _d.findPosts[2].content).toBe('test1');
    }));
    test('Returns posts from single user', () => __awaiter(void 0, void 0, void 0, function* () {
        var _e, _f;
        const result = yield test_servers_1.testServer.executeOperation({
            query: testQueries_1.FIND_POSTS,
            variables: { username: 'testUserName' }
        });
        expect(result.errors).toBeUndefined();
        expect((_e = result.data) === null || _e === void 0 ? void 0 : _e.findPosts).toHaveLength(1);
        expect((_f = result.data) === null || _f === void 0 ? void 0 : _f.findPosts[0].content).toBe('test1');
    }));
    test('Returns reply', () => __awaiter(void 0, void 0, void 0, function* () {
        var _g, _h;
        const result = yield test_servers_1.testServer.executeOperation({
            query: testQueries_1.FIND_POSTS,
            variables: { replyTo: postID1.toString() }
        });
        expect(result.errors).toBeUndefined();
        expect((_g = result.data) === null || _g === void 0 ? void 0 : _g.findPosts).toHaveLength(1);
        expect((_h = result.data) === null || _h === void 0 ? void 0 : _h.findPosts[0].content).toBe('test2');
    }));
    test('Returns posts from multiple users', () => __awaiter(void 0, void 0, void 0, function* () {
        var _j, _k, _l;
        const result = yield test_servers_1.testServer.executeOperation({
            query: testQueries_1.FIND_POSTS,
            variables: { userIds: [test_servers_1.loggedInUserID.toString(), userID2.toString()] }
        });
        expect(result.errors).toBeUndefined();
        expect((_j = result.data) === null || _j === void 0 ? void 0 : _j.findPosts).toHaveLength(2);
        expect((_k = result.data) === null || _k === void 0 ? void 0 : _k.findPosts[0].content).toBe('test3');
        expect((_l = result.data) === null || _l === void 0 ? void 0 : _l.findPosts[1].content).toBe('test1');
    }));
});
describe('findPost', () => {
    test('Returns correct post', () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const result = yield test_servers_1.testServer.executeOperation({
            query: testQueries_1.FIND_POST,
            variables: { id: postID1.toString() }
        });
        expect(result.errors).toBeUndefined();
        expect((_a = result.data) === null || _a === void 0 ? void 0 : _a.findPost.content).toBe('test1');
    }));
});
describe('searchPost', () => {
    test('Returns correct post', () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const result = yield test_servers_1.testServer.executeOperation({
            query: testQueries_1.SEARCH_POST,
            variables: { searchword: 'test1' }
        });
        expect(result.errors).toBeUndefined();
        expect((_a = result.data) === null || _a === void 0 ? void 0 : _a.searchPost[0].content).toBe('test1');
    }));
});
describe('createPost', () => {
    test('Creates new post when logged in', () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const result = yield test_servers_1.testServerLoggedIn.executeOperation({
            query: testQueries_1.CREATE_POST,
            variables: { content: 'newPost' }
        });
        const newPost = yield test_servers_1.testServerLoggedIn.executeOperation({
            query: testQueries_1.SEARCH_POST,
            variables: { searchword: 'newPost' }
        });
        expect(result.errors).toBeUndefined();
        expect(newPost.errors).toBeUndefined();
        expect((_a = newPost.data) === null || _a === void 0 ? void 0 : _a.searchPost[0].content).toBe('newPost');
    }));
    test('Throws error when not logged in', () => __awaiter(void 0, void 0, void 0, function* () {
        var _b, _c;
        const result = yield test_servers_1.testServer.executeOperation({
            query: testQueries_1.CREATE_POST,
            variables: { content: 'newPost' }
        });
        const newPost = yield test_servers_1.testServer.executeOperation({
            query: testQueries_1.SEARCH_POST,
            variables: { searchword: 'newPost' }
        });
        expect((_b = result.errors) === null || _b === void 0 ? void 0 : _b[0].message).toBe('Not authenticated');
        expect(newPost.errors).toBeUndefined();
        expect((_c = newPost.data) === null || _c === void 0 ? void 0 : _c.searchPost).toHaveLength(0);
    }));
});
describe('addLike', () => {
    test('Adds like to post when logged in', () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const result = yield test_servers_1.testServerLoggedIn.executeOperation({
            query: testQueries_1.ADD_LIKE,
            variables: { id: postID1.toString() }
        });
        const likedPost = yield test_servers_1.testServerLoggedIn.executeOperation({
            query: testQueries_1.FIND_POST,
            variables: { id: postID1.toString() }
        });
        expect(result.errors).toBeUndefined();
        expect(likedPost.errors).toBeUndefined();
        expect((_a = likedPost.data) === null || _a === void 0 ? void 0 : _a.findPost.likes).toBe(1);
    }));
    test('Throws error when user has already liked post', () => __awaiter(void 0, void 0, void 0, function* () {
        var _b, _c;
        yield test_servers_1.testServerLoggedIn.executeOperation({
            query: testQueries_1.ADD_LIKE,
            variables: { id: postID1.toString() }
        });
        const result = yield test_servers_1.testServerLoggedIn.executeOperation({
            query: testQueries_1.ADD_LIKE,
            variables: { id: postID1.toString() }
        });
        const likedPost = yield test_servers_1.testServerLoggedIn.executeOperation({
            query: testQueries_1.FIND_POST,
            variables: { id: postID1.toString() }
        });
        expect((_b = result.errors) === null || _b === void 0 ? void 0 : _b[0].message).toBe('User has already liked the post');
        expect(likedPost.errors).toBeUndefined();
        expect((_c = likedPost.data) === null || _c === void 0 ? void 0 : _c.findPost.likes).toBe(1);
    }));
    test('Throws error when not logged in', () => __awaiter(void 0, void 0, void 0, function* () {
        var _d, _e;
        const result = yield test_servers_1.testServer.executeOperation({
            query: testQueries_1.ADD_LIKE,
            variables: { id: postID1.toString() }
        });
        const likedPost = yield test_servers_1.testServer.executeOperation({
            query: testQueries_1.FIND_POST,
            variables: { id: postID1.toString() }
        });
        expect((_d = result.errors) === null || _d === void 0 ? void 0 : _d[0].message).toBe('Not authenticated');
        expect(likedPost.errors).toBeUndefined();
        expect((_e = likedPost.data) === null || _e === void 0 ? void 0 : _e.findPost.likes).toBe(0);
    }));
});
describe('deleteLike', () => {
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield test_servers_1.testServerLoggedIn.executeOperation({
            query: testQueries_1.ADD_LIKE,
            variables: { id: postID1.toString() }
        });
    }));
    test('Deletes like from post when logged in', () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const result = yield test_servers_1.testServerLoggedIn.executeOperation({
            query: testQueries_1.DELETE_LIKE,
            variables: { id: postID1.toString() }
        });
        const likedPost = yield test_servers_1.testServerLoggedIn.executeOperation({
            query: testQueries_1.FIND_POST,
            variables: { id: postID1.toString() }
        });
        expect(result.errors).toBeUndefined();
        expect(likedPost.errors).toBeUndefined();
        expect((_a = likedPost.data) === null || _a === void 0 ? void 0 : _a.findPost.likes).toBe(0);
    }));
    test('Throws error when user has not liked the post', () => __awaiter(void 0, void 0, void 0, function* () {
        var _b, _c;
        const result = yield test_servers_1.testServerLoggedIn.executeOperation({
            query: testQueries_1.DELETE_LIKE,
            variables: { id: postID2.toString() }
        });
        const likedPost = yield test_servers_1.testServerLoggedIn.executeOperation({
            query: testQueries_1.FIND_POST,
            variables: { id: postID2.toString() }
        });
        expect((_b = result.errors) === null || _b === void 0 ? void 0 : _b[0].message).toBe('User has not liked the post');
        expect(likedPost.errors).toBeUndefined();
        expect((_c = likedPost.data) === null || _c === void 0 ? void 0 : _c.findPost.likes).toBe(0);
    }));
    test('Throws error when not logged in', () => __awaiter(void 0, void 0, void 0, function* () {
        var _d, _e;
        const result = yield test_servers_1.testServer.executeOperation({
            query: testQueries_1.DELETE_LIKE,
            variables: { id: postID1.toString() }
        });
        const likedPost = yield test_servers_1.testServer.executeOperation({
            query: testQueries_1.FIND_POST,
            variables: { id: postID1.toString() }
        });
        expect((_d = result.errors) === null || _d === void 0 ? void 0 : _d[0].message).toBe('Not authenticated');
        expect(likedPost.errors).toBeUndefined();
        expect((_e = likedPost.data) === null || _e === void 0 ? void 0 : _e.findPost.likes).toBe(1);
    }));
});
