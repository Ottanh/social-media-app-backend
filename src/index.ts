import { ApolloServer, gql } from 'apollo-server';
//import { v1 as uuid } from 'uuid';
import 'dotenv/config';
import mongoose from 'mongoose';
import { userTypeDef } from './Post/post';
import { postTypeDef, userResolver } from './User/user';
import { merge } from 'lodash';


const MONGODB_URI = process.env.MONGODB_URI;
if(!MONGODB_URI) {
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
});

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
}, (reject) => {
  console.log(reject);
});