import type { Metadata } from "next";
import { getPostMetaBySlug } from "@/lib/firestore-server";
import BlogPostContent from "@/components/BlogPostContent";

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostMetaBySlug(slug);

  if (!post) {
    return { title: "Post Not Found | Bhakti Granth" };
  }

  return {
    title: `${post.title} | Bhakti Granth`,
    description: post.excerpt || "Read this post on Bhakti Granth.",
    openGraph: {
      title: post.title,
      description: post.excerpt || undefined,
      images: post.coverImageUrl ? [{ url: post.coverImageUrl }] : [],
      type: "article",
      siteName: "Bhakti Granth",
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt || undefined,
      images: post.coverImageUrl ? [post.coverImageUrl] : [],
    },
  };
}

export default async function BlogPostPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  return <BlogPostContent slug={slug} />;
}
