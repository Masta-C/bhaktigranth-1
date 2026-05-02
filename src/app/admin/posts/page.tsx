"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAllPosts, deletePost } from "@/lib/firestore";
import type { Post } from "@/types";

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => getAllPosts().then((p) => { setPosts(p); setLoading(false); });

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    await deletePost(id);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-3xl font-bold">Blog Posts</h1>
        <Link href="/admin/posts/new" className="bg-black text-white text-sm font-medium px-5 py-2.5 hover:opacity-70 transition-opacity">
          + New Post
        </Link>
      </div>

      {loading ? (
        <p className="text-sm text-gray-400">Loading…</p>
      ) : posts.length === 0 ? (
        <p className="text-sm text-gray-400">No posts yet. Create your first one.</p>
      ) : (
        <div className="divide-y divide-gray-100">
          {posts.map((post) => (
            <div key={post.id} className="py-4 flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{post.title || "Untitled"}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {post.category && <span className="mr-2">{post.category}</span>}
                  {post.createdAt.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </p>
              </div>
              <span className={`text-xs font-medium px-2 py-0.5 shrink-0 ${post.status === "published" ? "bg-black text-white" : "bg-gray-100 text-gray-600"}`}>
                {post.status}
              </span>
              <div className="flex gap-3 shrink-0">
                <Link href={`/admin/posts/${post.id}`} className="text-xs text-gray-500 hover:text-black transition-colors">
                  Edit
                </Link>
                <button onClick={() => handleDelete(post.id, post.title)} className="text-xs text-gray-400 hover:text-red-600 transition-colors">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
