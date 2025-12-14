export interface User {
  id: string;
  username: string;
  email: string;
  fullName?: string;
  bio?: string;
  profilePicture?: string;
  followersCount?: number;
  followingCount?: number;
  isFollowing?: boolean;
  isOwnProfile?: boolean;
}

export interface Post {
  _id: string;
  userId: User;
  imageUrl: string;
  caption?: string;
  createdAt: string;
  updatedAt: string;
  likesCount?: number;
  isLiked?: boolean;
  comments?: Comment[];
}

export interface Comment {
  _id: string;
  userId: User;
  postId: string;
  text: string;
  createdAt: string;
  updatedAt: string;
}


