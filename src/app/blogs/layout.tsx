import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | Bhakti Granth",
  description: "Essays and reflections on devotion, wisdom, and intentional living.",
  openGraph: {
    title: "Blog | Bhakti Granth",
    description: "Essays and reflections on devotion, wisdom, and intentional living.",
    siteName: "Bhakti Granth",
  },
};

export default function BlogsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
