import { Post } from '../Post/model';
import mongoose from 'mongoose';
import { CREATE_USER, FIND_USER, GET_ALL_USERS, LOGIN, ME, SEARCH_USER } from './testQueries';
import User from '../User/model';
import { loggedInUserID, testServer, testServerLoggedIn } from '../test-servers';


const userID2 = new mongoose.Types.ObjectId();

const initialUsers = [
  {
    _id: loggedInUserID,
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
]


beforeEach(async () => {
  await Post.deleteMany({});  
  await User.deleteMany({});
  let userObject = new User(initialUsers[0]);
  await userObject.save();
  userObject = new User(initialUsers[1]);
  await userObject.save();
});



describe('allUsers', () => {
  test('Returns all users', async () => {
    const result = await testServer.executeOperation({
      query: GET_ALL_USERS,
    });

    expect(result.errors).toBeUndefined();
    expect(result.data?.allUsers).toHaveLength(2);
  });
});


describe('findUser', () => {
  test('Returns correct user', async () => {
    const result = await testServer.executeOperation({
      query: FIND_USER,
      variables: { username: 'testUserName' }
    });

    expect(result.errors).toBeUndefined();
    expect(result.data?.findUser.username).toBe('testUserName');
  });
});

describe('me', () => {
  test('Returns logged in user', async () => {
    const result = await testServerLoggedIn.executeOperation({
      query: ME,
    });

    expect(result.errors).toBeUndefined();
    expect(result.data?.me.username).toBe('testUserName');
  });

  test('Returns null when not logged in', async () => {
    const result = await testServer.executeOperation({
      query: ME,
    });

    expect(result.errors).toBeUndefined();
    expect(result.data?.me).toBe(null);
  });
});

describe('searchUser', () => {
  test('Returns correct user', async () => {
    const result = await testServer.executeOperation({
      query: SEARCH_USER,
      variables: { searchword: 'testUserName'}
    });

    expect(result.errors).toBeUndefined();
    expect(result.data?.searchUser[0].username).toBe('testUserName');
  })
})

describe('createUser', () => {
  test('Creates a new user', async () => {
    const result = await testServerLoggedIn.executeOperation({
      query: CREATE_USER,
      variables: { name: 'newUser', username: 'newUserName', password: 'salis' }
    });

    const newUser = await testServerLoggedIn.executeOperation({
      query: SEARCH_USER,
      variables: { searchword: 'newUserName'}
    });

    expect(result.errors).toBeUndefined();
    expect(newUser.errors).toBeUndefined();
    expect(newUser.data?.searchUser[0].username).toBe('newUserName');
  })
})

describe('login', () => {
  test('Returns token and user', async () => {
    await testServerLoggedIn.executeOperation({
      query: CREATE_USER,
      variables: { name: 'newUser', username: 'newUserName', password: 'salis' }
    });

    const result = await testServerLoggedIn.executeOperation({
      query: LOGIN,
      variables: { username: 'newUserName', password: 'salis' }
    });

    expect(result.errors).toBeUndefined();
    expect(result.data?.login.token).toBeDefined();
    expect(result.data?.login.user.username).toBe('newUserName');
  })
})
