import { ApolloServer, gql } from 'apollo-server';
//import { v1 as uuid } from 'uuid';
import userService from './services/userService';


const typeDefs = gql`
  type User {
    username: String!
    name: String!
    joined: String!
    description: String
    posts: [Post]!
  },
  type Post {
    id: ID!
    user: User!
    date: String!
    content: String!
    likes: Int!
  },
  type Query {
    allUsers: [User]!
  }
`;

const resolvers = {
  Query: {
    allUsers: () => {
      return userService.getUsers();
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
}, (reject) => {
  console.log(reject);
});