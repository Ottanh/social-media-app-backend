import { Post } from './model';
import mongoose from 'mongoose';
import { FIND_POSTS, FIND_POST, SEARCH_POST, CREATE_POST, ADD_LIKE, DELETE_LIKE } from './testQueries';
import User from '../User/model';
import { loggedInUserID, testServer, testServerLoggedIn } from '../test-servers';


const postID1 = new mongoose.Types.ObjectId();
const postID2 = new mongoose.Types.ObjectId();
const userID2 = new mongoose.Types.ObjectId();

const initialPosts = [  
  {    
    _id: postID1,
    content: 'test1',
    image: 'defaultUserPic.png',
    replyTo: null,
    user: {
      _id: loggedInUserID,
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
  _id: loggedInUserID,
  name: 'testUser',
  username: 'testUserName',
  passwordHash: 'password'
}

beforeEach(async () => {
  await Post.deleteMany({});  
  await User.deleteMany({});
  let postObject = new Post(initialPosts[0]); 
  await postObject.save(); 
  postObject = new Post(initialPosts[1]);  
  await postObject.save();
  postObject = new Post(initialPosts[2]);  
  await postObject.save();
  const userObject = new User(user);
  await userObject.save();
});


describe('findPosts', () => {
  test('Returns all posts', async () => {
    const result = await testServer.executeOperation({
      query: FIND_POSTS,
    });

    expect(result.errors).toBeUndefined();
    expect(result.data?.findPosts).toHaveLength(3);
    expect(result.data?.findPosts[0].content).toBe('test3');
    expect(result.data?.findPosts[1].content).toBe('test2');
    expect(result.data?.findPosts[2].content).toBe('test1');
  });

  test('Returns posts from single user', async () => {
    const result = await testServer.executeOperation({
      query: FIND_POSTS,
      variables: { username: 'testUserName'}
    });

    expect(result.errors).toBeUndefined();
    expect(result.data?.findPosts).toHaveLength(1);
    expect(result.data?.findPosts[0].content).toBe('test1');
  });

  test('Returns reply', async () => {
    const result = await testServer.executeOperation({
      query: FIND_POSTS,
      variables: { replyTo: postID1.toString()}
    });

    expect(result.errors).toBeUndefined();
    expect(result.data?.findPosts).toHaveLength(1);
    expect(result.data?.findPosts[0].content).toBe('test2');
  });

  test('Returns posts from multiple users', async () => {
    const result = await testServer.executeOperation({
      query: FIND_POSTS,
      variables: { userIds: [loggedInUserID.toString(), userID2.toString()]}
    });

    expect(result.errors).toBeUndefined();
    expect(result.data?.findPosts).toHaveLength(2);
    expect(result.data?.findPosts[0].content).toBe('test3');
    expect(result.data?.findPosts[1].content).toBe('test1');
  });

});

describe('findPost', () => {
  test('Returns correct post', async () => {
    const result = await testServer.executeOperation({
      query: FIND_POST,
      variables: { id: postID1.toString()}
    });

    expect(result.errors).toBeUndefined();
    expect(result.data?.findPost.content).toBe('test1');
  })

})

describe('searchPost', () => {
  test('Returns correct post', async () => {
    const result = await testServer.executeOperation({
      query: SEARCH_POST,
      variables: { searchword: 'test1'}
    });

    expect(result.errors).toBeUndefined();
    expect(result.data?.searchPost[0].content).toBe('test1');
  })
})


describe('createPost', () => {
  test('Creates new post when logged in', async () => {
    const result = await testServerLoggedIn.executeOperation({
      query: CREATE_POST,
      variables: { content: 'newPost' }
    });

    const newPost = await testServerLoggedIn.executeOperation({
      query: SEARCH_POST,
      variables: { searchword: 'newPost'}
    });

    expect(result.errors).toBeUndefined();
    expect(newPost.errors).toBeUndefined();
    expect(newPost.data?.searchPost[0].content).toBe('newPost');
  })

  test('Throws error when not logged in', async () => {
    const result = await testServer.executeOperation({
      query: CREATE_POST,
      variables: { content: 'newPost' }
    });

    const newPost = await testServer.executeOperation({
      query: SEARCH_POST,
      variables: { searchword: 'newPost'}
    });

    expect(result.errors?.[0].message).toBe('Not authenticated');
    expect(newPost.errors).toBeUndefined();
    expect(newPost.data?.searchPost).toHaveLength(0);
  })

})


describe('addLike', () => {
  test('Adds like to post when logged in', async () => {
    const result = await testServerLoggedIn.executeOperation({
      query: ADD_LIKE,
      variables: { id: postID1.toString() }
    });

    const likedPost = await testServerLoggedIn.executeOperation({
      query: FIND_POST,
      variables: { id: postID1.toString() }
    });

    expect(result.errors).toBeUndefined();
    expect(likedPost.errors).toBeUndefined();
    expect(likedPost.data?.findPost.likes).toBe(1);
  })

  test('Throws error when user has already liked post', async () => {
    await testServerLoggedIn.executeOperation({
      query: ADD_LIKE,
      variables: { id: postID1.toString() }
    });

    const result = await testServerLoggedIn.executeOperation({
      query: ADD_LIKE,
      variables: { id: postID1.toString() }
    });

    const likedPost = await testServerLoggedIn.executeOperation({
      query: FIND_POST,
      variables: { id: postID1.toString() }
    });

    expect(result.errors?.[0].message).toBe('User has already liked the post');
    expect(likedPost.errors).toBeUndefined();
    expect(likedPost.data?.findPost.likes).toBe(1);
  })

  test('Throws error when not logged in', async () => {
    const result = await testServer.executeOperation({
      query: ADD_LIKE,
      variables: { id: postID1.toString() }
    });

    const likedPost = await testServer.executeOperation({
      query: FIND_POST,
      variables: { id: postID1.toString() }
    });

    expect(result.errors?.[0].message).toBe('Not authenticated');
    expect(likedPost.errors).toBeUndefined();
    expect(likedPost.data?.findPost.likes).toBe(0);
  })
})

describe('deleteLike', () => {
  beforeEach(async () => {
    await testServerLoggedIn.executeOperation({
      query: ADD_LIKE,
      variables: { id: postID1.toString() }
    });
  })

  test('Deletes like from post when logged in', async () => {
    const result = await testServerLoggedIn.executeOperation({
      query: DELETE_LIKE,
      variables: { id: postID1.toString() }
    });

    const likedPost = await testServerLoggedIn.executeOperation({
      query: FIND_POST,
      variables: { id: postID1.toString() }
    });

    expect(result.errors).toBeUndefined();
    expect(likedPost.errors).toBeUndefined();
    expect(likedPost.data?.findPost.likes).toBe(0);
  })

  test('Throws error when user has not liked the post', async () => {
    const result = await testServerLoggedIn.executeOperation({
      query: DELETE_LIKE,
      variables: { id: postID2.toString() }
    });

    const likedPost = await testServerLoggedIn.executeOperation({
      query: FIND_POST,
      variables: { id: postID2.toString() }
    });

    expect(result.errors?.[0].message).toBe('User has not liked the post');
    expect(likedPost.errors).toBeUndefined();
    expect(likedPost.data?.findPost.likes).toBe(0);
  })

  test('Throws error when not logged in', async () => {
    const result = await testServer.executeOperation({
      query: DELETE_LIKE,
      variables: { id: postID1.toString() }
    });

    const likedPost = await testServer.executeOperation({
      query: FIND_POST,
      variables: { id: postID1.toString() }
    });

    expect(result.errors?.[0].message).toBe('Not authenticated');
    expect(likedPost.errors).toBeUndefined();
    expect(likedPost.data?.findPost.likes).toBe(1);
  })
})