"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getPostBySlug } from "@/lib/firestore";
import type { Post } from "@/types";

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPostBySlug(slug).then((p) => { setPost(p); setLoading(false); });
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-16 animate-pulse">
        <div className="h-4 bg-gray-100 w-24 mb-6" />
        <div className="h-10 bg-gray-100 w-3/4 mb-4" />
        <div className="h-4 bg-gray-100 w-40 mb-12" />
        <div className="aspect-video bg-gray-100 mb-12" />
        <div className="space-y-3">
          {[1,2,3,4,5].map(i => <div key={i} className="h-4 bg-gray-100 w-full" />)}
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-16 text-center">
        <p className="text-gray-400 mb-4">Post not found.</p>
        <Link href="/blogs" className="text-sm border-b border-black pb-0.5">← Back to Blog</Link>
      </div>
    );
  }

  return (
    <article className="max-w-2xl mx-auto px-6 py-16">
      {/* Back */}
      <Link href="/blogs" className="text-xs font-medium tracking-wide text-gray-400 hover:text-black transition-colors uppercase block mb-12">
        ← Blog
      </Link>

      {/* Header */}
      {post.category && (
        <p className="text-xs font-medium tracking-widest text-gray-400 uppercase mb-4">{post.category}</p>
      )}
      <h1 className="font-serif text-4xl font-bold leading-tight mb-6">{post.title}</h1>
      <p className="text-sm text-gray-400 mb-12">
        {post.publishedAt?.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
      </p>

      {/* Cover image */}
      {post.coverImageUrl && (
        <div className="aspect-video mb-12 overflow-hidden">
          <img src={post.coverImageUrl} alt={post.title} className="w-full h-full object-cover" />
        </div>
      )}

      {/* Body */}
      <div
        className="prose prose-lg max-w-none
          prose-headings:font-serif prose-headings:font-bold
          prose-a:border-b prose-a:border-black prose-a:no-underline
          prose-blockquote:border-l-2 prose-blockquote:border-black prose-blockquote:pl-4 prose-blockquote:italic
          prose-code:bg-gray-100 prose-code:px-1 prose-code:text-sm
          prose-img:w-full"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </article>
  );
}
