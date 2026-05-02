"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getPublishedPosts } from "@/lib/firestore";
import type { Post } from "@/types";

export default function BlogsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPublishedPosts().then((p) => { setPosts(p); setLoading(false); });
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <div className="mb-16">
        <p className="text-xs font-medium tracking-widest text-gray-400 uppercase mb-4">Writing</p>
        <h1 className="font-serif text-4xl font-bold mb-4">Blog</h1>
        <p className="text-gray-500 max-w-lg leading-relaxed">
          Essays and reflections on devotion, wisdom, and intentional living.
        </p>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 gap-x-12 gap-y-16">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-video bg-gray-100 mb-5" />
              <div className="h-3 bg-gray-100 w-20 mb-3" />
              <div className="h-6 bg-gray-100 w-3/4 mb-3" />
              <div className="h-4 bg-gray-100 w-full mb-2" />
              <div className="h-4 bg-gray-100 w-2/3" />
            </div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <p className="text-gray-400 text-sm">No posts published yet. Check back soon.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-x-12 gap-y-16">
          {posts.map((post) => (
            <article key={post.id} className="group">
              <Link href={`/blogs/${post.slug}`}>
                <div className="aspect-video bg-gray-100 mb-5 overflow-hidden">
                  {post.coverImageUrl && (
                    <img
                      src={post.coverImageUrl}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  )}
                </div>
              </Link>
              {post.category && (
                <p className="text-xs font-medium tracking-widest text-gray-400 uppercase mb-2">
                  {post.category}
                </p>
              )}
              <Link href={`/blogs/${post.slug}`}>
                <h2 className="font-serif text-2xl font-bold mb-3 group-hover:opacity-70 transition-opacity">
                  {post.title}
                </h2>
              </Link>
              {post.excerpt && (
                <p className="text-gray-500 text-sm leading-relaxed mb-4">{post.excerpt}</p>
              )}
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">
                  {post.publishedAt?.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                </span>
                <Link href={`/blogs/${post.slug}`} className="text-xs font-medium border-b border-black pb-0.5 hover:opacity-60 transition-opacity">
                  Read More +
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
