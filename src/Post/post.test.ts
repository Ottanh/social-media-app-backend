import { ApolloServer, gql, UserInputError } from 'apollo-server';
import { merge } from 'lodash';
import { typeDefs, resolvers } from '..';
import User from '../User/model';
import { CurrentUser, UserToken } from '../User/types';
import { postTypeDef, userResolver } from '../User/user';
import { Post } from './model';
import { userTypeDef, postResolver } from './post';
import jwt, { JsonWebTokenError } from 'jsonwebtoken';
import config from '../config';
import mongoose from 'mongoose';


const testServer = new ApolloServer({
  typeDefs: [userTypeDef, postTypeDef, typeDefs],
  resolvers: merge(resolvers, userResolver, postResolver),
  context: async ({ req }): Promise<{currentUser: CurrentUser | null}> => {    
    const auth = req ? req.headers.authorization : null;    
    if (auth && auth.toLowerCase().startsWith('bearer ')) {
      try {
        const decodedToken = jwt.verify(auth.substring(7), (await config).SECRET) as UserToken; 
        const currentUser = await User.findById(decodedToken.id, { name: 1, username: 1});   
        return { currentUser };
      } catch (error){
        if(error instanceof JsonWebTokenError){
          throw new UserInputError('Invalid authorization header');
        } else {
          console.log(error);
        }
      }
    }  
    return { currentUser: null};
  }
});

const postID1 = new mongoose.Types.ObjectId();
const userID = new mongoose.Types.ObjectId();
const userID2 = new mongoose.Types.ObjectId();

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


describe('FindPosts', () => {
  beforeEach(async () => {
    await Post.deleteMany({});  
    let postObject = new Post(initialPosts[0]); 
    await postObject.save(); 
    postObject = new Post(initialPosts[1]);  
    await postObject.save();
    postObject = new Post(initialPosts[2]);  
    await postObject.save();
  });


  const FIND_POSTS = gql`
    query findPosts($username: String, $replyTo: String, $userIds: [String]) {
       findPosts (username: $username, replyTo: $replyTo, userIds: $userIds) { 
         id
         user {
           id
           name
           username
         }
        date
        content
        image
        likes
         replyTo
         replies
      }
    }
  `;

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