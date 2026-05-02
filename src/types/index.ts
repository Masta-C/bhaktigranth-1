export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string; // TipTap HTML
  coverImageUrl: string;
  category: string;
  status: "draft" | "published";
  createdAt: Date;
  publishedAt: Date | null;
}

export interface Vlog {
  id: string;
  title: string;
  youtubeUrl: string;
  description: string;
  status: "draft" | "published";
  createdAt: Date;
  publishedAt: Date | null;
}

export interface QnAItem {
  id: string;
  question: string;
  submittedBy: string;
  answer: string | null;
  status: "pending" | "published";
  createdAt: Date;
  answeredAt: Date | null;
}
