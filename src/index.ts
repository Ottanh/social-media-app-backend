import { ApolloServer, gql } from 'apollo-server';
//import { v1 as uuid } from 'uuid';
import postData from '../data/posts';
import userData from '../data/users';


const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    name: String!
    joined: String!
    description: String
    posts: [Post]!
  },
  type Post {
    id: ID!
    username: String!
    user: String!
    date: String!
    content: String!
    likes: Int!
  },
  type Query {
    allUsers: [User]!
    findUser(username: String!): User
  }
`;

const resolvers = {
  Query: {
    allUsers: () => {
      return userData;
    },
    findUser: (_root: undefined, args: { username: string; }) => {
      return userData.find(user => user.username === args.username);
    }
  },
  User: {
    posts: (user: { username: string }) => {
      return postData.filter(post => post.username === user.username);
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