export interface PostType {
  user: {
    id: string;
    name: string;
    username: string;
  };
  content: string;
  likes: number;
}


export interface NewPost {
  content: string;
  likes: number;
}