import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Q&A | Bhakti Granth",
  description: "Ask questions and browse answers on devotion, practice, and the examined life.",
  openGraph: {
    title: "Q&A | Bhakti Granth",
    description: "Ask questions and browse answers on devotion, practice, and the examined life.",
    siteName: "Bhakti Granth",
  },
};

export default function QnALayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
