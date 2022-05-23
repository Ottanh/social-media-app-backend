export interface PostType {
  user: {
    id: string;
    name: string;
    username: string;
  };
  date: string;
  content?: string;
  likes: number;
}