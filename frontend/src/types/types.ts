export type Tag = {
  id: number;
  name: string;
};

export type User = {
  id: number;
  username: string;
  createdAt: Date;
};

export type Status =
  | "TaskStatus.NATURA"
  | "TaskStatus.URBAN"
  | "TaskStatus.RURAL";

export type Task = {
  id: number;
  title: string;
  content: string;
  status: Status;
  createdAt: Date;
  tagName: string;
};

export type PostStatus =
  | "PostStatus.NATURA"
  | "PostStatus.URBAN"
  | "PostStatus.RURAL";

export type Comment = {
  id: number;
  content: string;
  createdAt: Date;
  userId: number;
  username: string;
};

export type Post = {
  id: number;
  title: string;
  content: string;
  status: PostStatus;
  image: string | null;
  latitude: number | null;
  longitude: number | null;
  tagName: string | null;
  createdAt: Date;
  updatedAt: Date;
  userId: number;
  username: string;
};

export type Category = {
  id: number;
  name: string;
  description: string | null;
  color: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Review = {
  id: number;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
  userId: number;
  username: string;
  postId: number;
};

export type ReviewsResponse = {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
};

export type Favorite = {
  id: number;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  post: Post;
};
