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

export interface Ebook {
  id: string;
  title: string;
  description: string;
  coverImageUrl: string;
  fileUrl: string;
  category: string;
  status: "draft" | "published";
  createdAt: Date;
  publishedAt: Date | null;
}

export interface EbookDownload {
  id: string;
  ebookId: string;
  ebookTitle: string;
  name: string;
  email: string;
  downloadedAt: Date;
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
