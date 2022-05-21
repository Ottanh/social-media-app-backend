import { ApolloServer, gql } from 'apollo-server';
//import { v1 as uuid } from 'uuid';
import 'dotenv/config';
import mongoose, { model, Schema } from 'mongoose';


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

interface UserType {
  username: string;
  name: string;
  joined: string;
  description: string;
  posts: PostType[]
}

interface PostType {
  userId: string;
  date: string;
  content: string;
  likes: number;
}


const userSchema = new Schema<UserType>({
  username: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  joined: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  posts: [{
    type: Schema.Types.ObjectId,
    required: false
  }],
});

const postSchema = new Schema<PostType>({
  userId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  likes: {
    type: Number,
    required: true
  }
});

const User = model<UserType>('User', userSchema);
const Post = model<PostType>('Post', postSchema);


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
    userId: ID!
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
    allUsers: async () => {
      return await User.find<UserType>({});
    },
    findUser: async (_root: undefined, args: { username: string; }) => {
      return await User.findOne<UserType>({username: args.username});
    }
  },
  User: {
    posts: async (user: { posts: string[] }) => {
      return await Post.find({_id: {$in: user.posts}});
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