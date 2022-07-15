import { Post } from '../Post/model';
import mongoose from 'mongoose';
import { GET_ALL_USERS } from './testQueries';
import User from '../User/model';
import { loggedInUserID, testServer } from '../test-servers';


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

