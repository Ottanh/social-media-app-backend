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

const userID = new mongoose.Types.ObjectId();

const initialPosts = [  
  {    
    content: 'test1',
    image: 'defaultUserPic.png',
    replyTo: null,
    user: {
      _id: userID,
      name: 'testUser',
      username: 'testUSerName'
    }
  },  
  {    
    content: 'test2',
    image: null,
    replyTo: 'originalPost',
    user: {
      _id: userID,
      name: 'testUser',
      username: 'testUSerName'
    }
  },  
];


beforeEach(async () => {
  await Post.deleteMany({});  
  let postObject = new Post(initialPosts[0]); 
  await postObject.save(); 
  await new Promise(resolve => setTimeout(resolve, 1000));
  postObject = new Post(initialPosts[1]);  
  await postObject.save();
});



test('Returns all posts', async () => {
  const FIND_POSTS = gql`
    query findPosts($username: String) {
      findPosts (username: $username) { 
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

  const result = await testServer.executeOperation({
    query: FIND_POSTS,
  });


  expect(result.errors).toBeUndefined();
  expect(result.data?.findPosts).toHaveLength(2);
  expect(result.data?.findPosts[0].content).toBe('test2');
  expect(result.data?.findPosts[1].content).toBe('test1');
});