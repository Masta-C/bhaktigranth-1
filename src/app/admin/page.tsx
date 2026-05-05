"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAllPosts, getAllVlogs, getPendingQnA } from "@/lib/firestore";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ posts: 0, vlogs: 0, pending: 0 });

  useEffect(() => {
    Promise.all([getAllPosts(), getAllVlogs(), getPendingQnA()]).then(
      ([posts, vlogs, pending]) => setStats({ posts: posts.length, vlogs: vlogs.length, pending: pending.length })
    );
  }, []);

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold mb-10">Dashboard</h1>

      <div className="grid grid-cols-3 gap-6 mb-12">
        {[
          { label: "Blog Posts", value: stats.posts, href: "/admin/posts" },
          { label: "Vlogs", value: stats.vlogs, href: "/admin/vlogs" },
          { label: "Pending Q&A", value: stats.pending, href: "/admin/qna" },
        ].map(({ label, value, href }) => (
          <Link key={label} href={href} className="border border-gray-100 p-6 hover:border-black transition-colors">
            <p className="text-xs font-medium tracking-widest text-gray-400 uppercase mb-3">{label}</p>
            <p className="font-serif text-4xl font-bold">{value}</p>
          </Link>
        ))}
      </div>

      <div className="flex gap-4">
        <Link href="/admin/posts/new" className="bg-black text-sm font-medium px-6 py-3 hover:opacity-70 transition-opacity" style={{ color: "white" }}>
          + New Blog Post
        </Link>
        <Link href="/admin/vlogs/new" className="border border-black text-sm font-medium px-6 py-3 hover:opacity-70 transition-opacity" style={{ color: "black" }}>
          + Add Vlog
        </Link>
      </div>
    </div>
  );
}
