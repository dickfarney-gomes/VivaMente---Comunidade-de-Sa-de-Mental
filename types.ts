
export enum Condition {
  DEPRESSION = 'Depressão',
  ANXIETY = 'Ansiedade',
  ADHD = 'TDAH',
  ASD = 'TEA',
  OTHER = 'Outro'
}

export interface User {
  id: string;
  name: string;
  email: string;
  bio: string;
  conditions: Condition[];
  avatar: string;
  joinedCommunities: string[]; // Track which groups the user is a member of
}

export interface Community {
  id: string;
  name: string;
  description: string;
  condition: Condition;
  creatorId: string;
  membersCount: number;
  tags: string[];
}

export interface Comment {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: string;
  likes: number;
  likedBy?: string[]; // IDs of users who liked this comment
  replies?: Comment[];
}

export interface Post {
  id: string;
  communityId: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: string;
  likes: number;
  likedBy?: string[]; // IDs of users who liked this post
  comments: Comment[];
}
