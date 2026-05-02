import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vlogs | Bhakti Granth",
  description: "Video reflections and conversations on devotion, wisdom, and intentional living.",
  openGraph: {
    title: "Vlogs | Bhakti Granth",
    description: "Video reflections and conversations on devotion, wisdom, and intentional living.",
    siteName: "Bhakti Granth",
  },
};

export default function VlogsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
