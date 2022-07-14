import { ApolloServer } from 'apollo-server';
import { merge } from 'lodash';
import { typeDefs, resolvers } from '..';
import { postTypeDef, userResolver } from '../User/user';
import { Post } from './model';
import { userTypeDef, postResolver } from './post';
import mongoose from 'mongoose';
import { FIND_POSTS, FIND_POST, SEARCH_POST, CREATE_POST } from './testQueries';

const postID1 = new mongoose.Types.ObjectId();
const userID = new mongoose.Types.ObjectId();
const userID2 = new mongoose.Types.ObjectId();

const testServer = new ApolloServer({
  typeDefs: [userTypeDef, postTypeDef, typeDefs],
  resolvers: merge(resolvers, userResolver, postResolver),
  context: { currentUser: null }
});

export const testServerLoggedIn = new ApolloServer({
  typeDefs: [userTypeDef, postTypeDef, typeDefs],
  resolvers: merge(resolvers, userResolver, postResolver),
  context: { currentUser: { _id: userID, name: 'testUser', username: 'testUserName' } }
});

const initialPosts = [  
  {    
    _id: postID1,
    content: 'test1',
    image: 'defaultUserPic.png',
    replyTo: null,
    user: {
      _id: userID,
      name: 'testUser',
      username: 'testUserName'
    }
  },  
  {    
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


beforeEach(async () => {
  await Post.deleteMany({});  
  let postObject = new Post(initialPosts[0]); 
  await postObject.save(); 
  postObject = new Post(initialPosts[1]);  
  await postObject.save();
  postObject = new Post(initialPosts[2]);  
  await postObject.save();
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
      variables: { userIds: [userID.toString(), userID2.toString()]}
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