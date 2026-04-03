export interface User {
  _id: string;
  name: string;
  email: string;
  profilePic?: string | null;
  bio?: string;
  location?: string;
  title?: string;
  socials?: string;
  website?: string;
  skills: string[];
  lastLogin?: string;
  isVerified?: boolean;
}

export interface Author {
  _id?: string;
  name: string;
  profilePic?: string | null;
}

export interface TipTapMark {
  type: string;
  attrs?: Record<string, unknown>;
}

export interface TipTapNode {
  type: string;
  attrs?: Record<string, unknown>;
  content?: TipTapNode[];
  marks?: TipTapMark[];
  text?: string;
}

export interface PostContent {
  json: {
    type: string;
    content?: TipTapNode[];
  } | null;
  html: string;
}

export interface Post {
  _id: string;
  title: string;
  slug: string;
  content: PostContent;
  coverImageUrl?: string | null;
  tags: string[];
  author: Author;
  isDraft: boolean;
  views: number;
  likes: number;
  generatedByAi: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CommentPost {
  _id?: string;
  title: string;
  slug?: string;
  coverImageUrl?: string | null;
}

export interface CommentNode {
  _id: string;
  content: string;
  post: CommentPost;
  author: Author;
  parentComment: string | null;
  ancestors: string[];
  isDeleted: boolean;
  createdAt: string;
  updatedAt?: string;
  replies?: CommentNode[];
}

export interface InboxComment {
  _id: string;
  post: {
    _id: string;
    title: string;
    slug: string;
  };
  author: Author;
  content: string;
  parentComment: string | null;
  hasReplied: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardTopPost {
  _id: string;
  title: string;
  slug: string;
  coverImageUrl: string;
  views: number;
}

export interface DashboardData {
  stats: {
    totalPosts: number;
    drafts: number;
    published: number;
    totalViews: number;
    totalVisitors: number;
    avgReadTime: number;
  };
  topPosts: DashboardTopPost[];
}
