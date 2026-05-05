import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ebooks | Bhakti Granth",
  description: "Free devotional ebooks and sacred texts. Download for free.",
};

export default function EbooksLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
