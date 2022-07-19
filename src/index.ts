import { ApolloServer, gql, UserInputError } from 'apollo-server';
import mongoose from 'mongoose';
import { postResolver, userTypeDef } from './Post/post';
import { postTypeDef, userResolver } from './User/user';
import { merge } from 'lodash';
import User from './User/model';
import jwt, { JsonWebTokenError } from 'jsonwebtoken';
import { CurrentUser, UserToken } from './User/types';
import config from './config';
import { s3TypeDefs, s3Resolvers } from './S3/resolvers';

export const typeDefs = gql`
  type Query {
    _empty: String
  }
`;
export const resolvers = {};

void (async() => {
  mongoose.connect((await config).MONGODB_URI)
    .then(() => {
      console.log('connected to MongoDB');
    })
    .catch((error) => {
      console.log('error connection to MongoDB:', error.message);
    });

  const server = new ApolloServer({
    typeDefs: [userTypeDef, postTypeDef, s3TypeDefs, typeDefs],
    resolvers: merge(s3Resolvers, userResolver, postResolver, resolvers),
    context: async ({ req }): Promise<{currentUser: CurrentUser | null}> => {    
      const auth = req ? req.headers.authorization : null;    
      if (auth && auth.toLowerCase().startsWith('bearer ')) {
        try {
          const decodedToken = jwt.verify(auth.substring(7), (await config).JWT_SECRET) as UserToken; 
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

  server.listen({ port: (await config).PORT}).then(({ url }) => {
    console.log(`Server ready at ${url}`);
  }, (reject) => {
    console.log(reject);
  });

})();
