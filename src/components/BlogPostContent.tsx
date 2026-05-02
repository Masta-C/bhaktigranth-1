"use client";

import Link from "next/link";
import type { PostServerFull } from "@/lib/firestore-server";

export default function BlogPostContent({ post }: { post: PostServerFull }) {
  const publishedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
    : null;

  return (
    <article className="max-w-2xl mx-auto px-6 py-16">
      <Link href="/blogs" className="text-xs font-medium tracking-wide text-gray-400 hover:text-black transition-colors uppercase block mb-12">
        ← Blog
      </Link>

      {post.category && (
        <p className="text-xs font-medium tracking-widest text-gray-400 uppercase mb-4">{post.category}</p>
      )}
      <h1 className="font-serif text-3xl sm:text-4xl font-bold leading-tight mb-6">{post.title}</h1>
      {publishedDate && (
        <p className="text-sm text-gray-400 mb-12">{publishedDate}</p>
      )}

      {post.coverImageUrl && (
        <div className="aspect-video mb-12 overflow-hidden">
          <img src={post.coverImageUrl} alt={post.title} className="w-full h-full object-cover" />
        </div>
      )}

      <div
        className="prose prose-lg max-w-none
          prose-headings:font-serif prose-headings:font-bold
          prose-a:border-b prose-a:border-black prose-a:no-underline
          prose-blockquote:border-l-2 prose-blockquote:border-black prose-blockquote:pl-4 prose-blockquote:italic
          prose-code:bg-gray-100 prose-code:px-1 prose-code:text-sm
          prose-img:w-full overflow-x-hidden"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </article>
  );
}
