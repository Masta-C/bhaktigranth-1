export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  coverImage?: string;
  tags?: string[];
  category?: string;
  published: boolean;
  publishedAt: string;
  author: string;
};

export type UserProfile = {
  uid: string;
  email: string;
  role: 'admin' | 'editor' | 'reader';
};
