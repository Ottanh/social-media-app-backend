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
const model_1 = require("../Post/model");
const mongoose_1 = __importDefault(require("mongoose"));
const testQueries_1 = require("./testQueries");
const model_2 = __importDefault(require("../User/model"));
const test_servers_1 = require("../test-servers");
const userID2 = new mongoose_1.default.Types.ObjectId();
const initialUsers = [
    {
        _id: test_servers_1.loggedInUserID,
        name: 'testUser',
        username: 'testUserName',
        passwordHash: 'password'
    },
    {
        _id: userID2,
        name: 'testUser2',
        username: 'testUserName2',
        passwordHash: 'password2'
    }
];
beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
    yield model_1.Post.deleteMany({});
    yield model_2.default.deleteMany({});
    let userObject = new model_2.default(initialUsers[0]);
    yield userObject.save();
    userObject = new model_2.default(initialUsers[1]);
    yield userObject.save();
}));
describe('allUsers', () => {
    test('Returns all users', () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const result = yield test_servers_1.testServer.executeOperation({
            query: testQueries_1.GET_ALL_USERS,
        });
        expect(result.errors).toBeUndefined();
        expect((_a = result.data) === null || _a === void 0 ? void 0 : _a.allUsers).toHaveLength(2);
    }));
});
describe('findUser', () => {
    test('Returns correct user', () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const result = yield test_servers_1.testServer.executeOperation({
            query: testQueries_1.FIND_USER,
            variables: { username: 'testUserName' }
        });
        expect(result.errors).toBeUndefined();
        expect((_a = result.data) === null || _a === void 0 ? void 0 : _a.findUser.username).toBe('testUserName');
    }));
});
describe('me', () => {
    test('Returns logged in user', () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const result = yield test_servers_1.testServerLoggedIn.executeOperation({
            query: testQueries_1.ME,
        });
        expect(result.errors).toBeUndefined();
        expect((_a = result.data) === null || _a === void 0 ? void 0 : _a.me.username).toBe('testUserName');
    }));
    test('Returns null when not logged in', () => __awaiter(void 0, void 0, void 0, function* () {
        var _b;
        const result = yield test_servers_1.testServer.executeOperation({
            query: testQueries_1.ME,
        });
        expect(result.errors).toBeUndefined();
        expect((_b = result.data) === null || _b === void 0 ? void 0 : _b.me).toBe(null);
    }));
});
describe('searchUser', () => {
    test('Returns correct user', () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const result = yield test_servers_1.testServer.executeOperation({
            query: testQueries_1.SEARCH_USER,
            variables: { searchword: 'testUserName' }
        });
        expect(result.errors).toBeUndefined();
        expect((_a = result.data) === null || _a === void 0 ? void 0 : _a.searchUser[0].username).toBe('testUserName');
    }));
});
describe('createUser', () => {
    test('Creates a new user', () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const result = yield test_servers_1.testServerLoggedIn.executeOperation({
            query: testQueries_1.CREATE_USER,
            variables: { name: 'newUser', username: 'newUserName', password: 'salis' }
        });
        const newUser = yield test_servers_1.testServerLoggedIn.executeOperation({
            query: testQueries_1.SEARCH_USER,
            variables: { searchword: 'newUserName' }
        });
        expect(result.errors).toBeUndefined();
        expect(newUser.errors).toBeUndefined();
        expect((_a = newUser.data) === null || _a === void 0 ? void 0 : _a.searchUser[0].username).toBe('newUserName');
    }));
});
describe('login', () => {
    test('Returns token and user', () => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        yield test_servers_1.testServerLoggedIn.executeOperation({
            query: testQueries_1.CREATE_USER,
            variables: { name: 'newUser', username: 'newUserName', password: 'salis' }
        });
        const result = yield test_servers_1.testServerLoggedIn.executeOperation({
            query: testQueries_1.LOGIN,
            variables: { username: 'newUserName', password: 'salis' }
        });
        expect(result.errors).toBeUndefined();
        expect((_a = result.data) === null || _a === void 0 ? void 0 : _a.login.token).toBeDefined();
        expect((_b = result.data) === null || _b === void 0 ? void 0 : _b.login.user.username).toBe('newUserName');
    }));
});
describe('follow', () => {
    test('Adds user to followed', () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const result = yield test_servers_1.testServerLoggedIn.executeOperation({
            query: testQueries_1.FOLLOW,
            variables: { followId: userID2.toString() }
        });
        const user = yield test_servers_1.testServerLoggedIn.executeOperation({
            query: testQueries_1.FIND_USER,
            variables: { username: 'testUserName' }
        });
        expect(result.errors).toBeUndefined();
        expect(user.errors).toBeUndefined();
        expect((_a = user.data) === null || _a === void 0 ? void 0 : _a.findUser.followed).toStrictEqual([userID2.toString()]);
    }));
    test('Does nothing when user is already followed', () => __awaiter(void 0, void 0, void 0, function* () {
        var _b;
        yield test_servers_1.testServerLoggedIn.executeOperation({
            query: testQueries_1.FOLLOW,
            variables: { followId: userID2.toString() }
        });
        const result = yield test_servers_1.testServerLoggedIn.executeOperation({
            query: testQueries_1.FOLLOW,
            variables: { followId: userID2.toString() }
        });
        const user = yield test_servers_1.testServerLoggedIn.executeOperation({
            query: testQueries_1.FIND_USER,
            variables: { username: 'testUserName' }
        });
        expect(result.errors).toBeUndefined();
        expect(user.errors).toBeUndefined();
        expect((_b = user.data) === null || _b === void 0 ? void 0 : _b.findUser.followed).toStrictEqual([userID2.toString()]);
    }));
    test('Throws error when not logged in', () => __awaiter(void 0, void 0, void 0, function* () {
        var _c, _d;
        const result = yield test_servers_1.testServer.executeOperation({
            query: testQueries_1.FOLLOW,
            variables: { followId: userID2.toString() }
        });
        const user = yield test_servers_1.testServerLoggedIn.executeOperation({
            query: testQueries_1.FIND_USER,
            variables: { username: 'testUserName' }
        });
        expect((_c = result.errors) === null || _c === void 0 ? void 0 : _c[0].message).toBe('Not authenticated');
        expect(user.errors).toBeUndefined();
        expect((_d = user.data) === null || _d === void 0 ? void 0 : _d.findUser.followed).toHaveLength(0);
    }));
});
describe('unFollow', () => {
    test('Removes user from followed', () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        yield test_servers_1.testServerLoggedIn.executeOperation({
            query: testQueries_1.FOLLOW,
            variables: { followId: userID2.toString() }
        });
        const result = yield test_servers_1.testServerLoggedIn.executeOperation({
            query: testQueries_1.UNFOLLOW,
            variables: { unFollowId: userID2.toString() }
        });
        const user = yield test_servers_1.testServerLoggedIn.executeOperation({
            query: testQueries_1.FIND_USER,
            variables: { username: 'testUserName' }
        });
        expect(result.errors).toBeUndefined();
        expect(user.errors).toBeUndefined();
        expect((_a = user.data) === null || _a === void 0 ? void 0 : _a.findUser.followed).toHaveLength(0);
    }));
    test('Does nothing when user is not followed', () => __awaiter(void 0, void 0, void 0, function* () {
        var _b;
        const result = yield test_servers_1.testServerLoggedIn.executeOperation({
            query: testQueries_1.UNFOLLOW,
            variables: { unFollowId: userID2.toString() }
        });
        const user = yield test_servers_1.testServerLoggedIn.executeOperation({
            query: testQueries_1.FIND_USER,
            variables: { username: 'testUserName' }
        });
        expect(result.errors).toBeUndefined();
        expect(user.errors).toBeUndefined();
        expect((_b = user.data) === null || _b === void 0 ? void 0 : _b.findUser.followed).toHaveLength(0);
    }));
    test('Throws error when not logged in', () => __awaiter(void 0, void 0, void 0, function* () {
        var _c, _d;
        const result = yield test_servers_1.testServer.executeOperation({
            query: testQueries_1.UNFOLLOW,
            variables: { unFollowId: userID2.toString() }
        });
        const user = yield test_servers_1.testServerLoggedIn.executeOperation({
            query: testQueries_1.FIND_USER,
            variables: { username: 'testUserName' }
        });
        expect((_c = result.errors) === null || _c === void 0 ? void 0 : _c[0].message).toBe('Not authenticated');
        expect(user.errors).toBeUndefined();
        expect((_d = user.data) === null || _d === void 0 ? void 0 : _d.findUser.followed).toHaveLength(0);
    }));
});
describe('editUser', () => {
    test('Changes users image and description', () => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        const result = yield test_servers_1.testServerLoggedIn.executeOperation({
            query: testQueries_1.EDIT_USER,
            variables: { image: 'image.jpg', description: 'testing' }
        });
        const editedUser = yield test_servers_1.testServerLoggedIn.executeOperation({
            query: testQueries_1.SEARCH_USER,
            variables: { searchword: 'testUserName' }
        });
        expect(result.errors).toBeUndefined();
        expect(editedUser.errors).toBeUndefined();
        expect((_a = editedUser.data) === null || _a === void 0 ? void 0 : _a.searchUser[0].description).toBe('testing');
        expect((_b = editedUser.data) === null || _b === void 0 ? void 0 : _b.searchUser[0].image).toContain('image.jpg');
    }));
    test('Throws error when not logged in', () => __awaiter(void 0, void 0, void 0, function* () {
        var _c, _d, _e;
        const result = yield test_servers_1.testServer.executeOperation({
            query: testQueries_1.EDIT_USER,
            variables: { image: 'image', description: 'testing' }
        });
        const editedUser = yield test_servers_1.testServer.executeOperation({
            query: testQueries_1.SEARCH_USER,
            variables: { searchword: 'testUserName' }
        });
        expect((_c = result.errors) === null || _c === void 0 ? void 0 : _c[0].message).toBe('Not authenticated');
        expect(editedUser.errors).toBeUndefined();
        expect((_d = editedUser.data) === null || _d === void 0 ? void 0 : _d.searchUser[0].description).toBe(null);
        expect((_e = editedUser.data) === null || _e === void 0 ? void 0 : _e.searchUser[0].image).toContain('defaultUserPic.jpg');
    }));
});
