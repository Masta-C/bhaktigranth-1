'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { fetchPublishedPosts } from '@/lib/posts';
import { BlogPost } from '@/lib/types';

export default function HomePage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const items = await fetchPublishedPosts();
        setPosts(items);
      } catch (err) {
        setError('Failed to load posts.');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return (
    <main className="mx-auto max-w-4xl py-10 px-4 sm:px-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold">BhaktiGranth Blog</h1>
        <p className="text-gray-600 mt-2">Learn, share, and grow through spiritual writing.</p>
      </header>

      {loading ? (
        <p>Loading posts...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : posts.length === 0 ? (
        <p>No posts published yet.</p>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {posts.map((post) => (
            <article key={post.id} className="rounded-xl border p-5 shadow-sm hover:shadow-md transition">
              {post.coverImage && <img src={post.coverImage} alt={post.title} className="w-full h-44 object-cover rounded-md mb-4" />}
              <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
              <p className="text-gray-700 mb-3">{post.excerpt}</p>
              <Link href={`/blog/${post.slug}`} className="text-blue-600 hover:text-blue-800 font-medium">
                Read more &rarr;
              </Link>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
