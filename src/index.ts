import { ApolloServer, AuthenticationError, gql, UserInputError } from 'apollo-server';
import mongoose from 'mongoose';
import { postResolver, userTypeDef } from './Post/post';
import { postTypeDef, userResolver } from './User/user';
import { merge } from 'lodash';
import User from './User/model';
import jwt, { JsonWebTokenError } from 'jsonwebtoken';
import { CurrentUser, UserToken } from './User/types';
import config from './config';
import { Post } from './Post/model';
import { getSignedPut } from './S3/s3_signed_url';


mongoose.connect(config.MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB');
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message);
  });


const typeDefs = gql`
  type Query {
    _empty: String
    search(searchword: String): SearchResult
    getSignedPut(fileName: String!): String
  }
  type SearchResult {
    users: [User]
    posts: [Post]
  }
`;


const resolvers = {
  Query: {
    search: async (_root: undefined, args: { searchword: string; }) => {
      const posts = await Post.find({ content: { $regex: `.*${args.searchword}.*`, $options: 'i' } });
      const users = await User.find({ username: { $regex: `.*${args.searchword}.*`, $options: 'i' } });
      return { users, posts };
    },
    getSignedPut: async (_root: undefined, args: { fileName: string; }, context: { currentUser: CurrentUser }) => {
      if (!context.currentUser) {      
        throw new AuthenticationError('Not authenticated');
      }
      return await getSignedPut(args.fileName);
    }
  }
 };

const server = new ApolloServer({
  typeDefs: [userTypeDef, postTypeDef, typeDefs],
  resolvers: merge(resolvers, userResolver, postResolver),
  context: async ({ req }): Promise<{currentUser: CurrentUser | null}> => {    
    const auth = req ? req.headers.authorization : null;    
    if (auth && auth.toLowerCase().startsWith('bearer ')) {
      try {
        const decodedToken = jwt.verify(auth.substring(7), config.SECRET) as UserToken; 
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

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
}, (reject) => {
  console.log(reject);
});