import { ApolloServer, gql } from 'apollo-server';
import 'dotenv/config';
import mongoose from 'mongoose';
import { userTypeDef } from './Post/post';
import { postTypeDef, userResolver } from './User/user';
import { merge } from 'lodash';
import User, { UserType } from './User/userSchema';
import jwt from 'jsonwebtoken';


const MONGODB_URI = process.env.MONGODB_URI;
if(!MONGODB_URI) {
  throw new TypeError('MONGODB_URI is undefined');
}

const SECRET = process.env.SECRET;
  if(!SECRET) {
    throw new TypeError('MONGODB_URI is undefined');
  }

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB');
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message);
  });


const typeDefs = gql`
  type Query {
    _empty: String
  }
`;

const resolvers = { };

const server = new ApolloServer({
  typeDefs: [userTypeDef, postTypeDef, typeDefs],
  resolvers: merge(resolvers, userResolver),
  context: async ({ req }): Promise<{ currentUser: UserType | null;}> => {    
    const auth = req ? req.headers.authorization : null;    
    if (auth && auth.toLowerCase().startsWith('bearer ')) {
      try {
        const decodedToken = jwt.verify(auth.substring(7), SECRET) as { id: string }; 
        const currentUser = await User        
          .findById(decodedToken.id);      
        return { currentUser };    
      } catch (error){
        console.log(error);
      }
    }  
    return { currentUser: null };
  }
});

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
}, (reject) => {
  console.log(reject);
});