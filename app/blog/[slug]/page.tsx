'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { fetchPostBySlug } from '@/lib/posts';
import { BlogPost } from '@/lib/types';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function BlogDetailPage() {
  const params = useParams();
  const slug = params?.slug as string | undefined;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!slug) {
      setError('Invalid post link');
      setLoading(false);
      return;
    }

    async function load() {
      try {
        setLoading(true);
        const found = await fetchPostBySlug(slug as string);
        if (!found) {
          setError('Post not found.');
        } else {
          setPost(found);
        }
      } catch (err) {
        setError('Unable to fetch post');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [slug]);

  if (loading) return <p className="mx-auto max-w-4xl p-8">Loading...</p>;
  if (error) return <p className="mx-auto max-w-4xl p-8 text-red-500">{error}</p>;
  if (!post) return <p className="mx-auto max-w-4xl p-8">No post found.</p>;

  return (
    <main className="mx-auto max-w-4xl py-10 px-4 sm:px-8">
      <article>
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        <p className="text-gray-500 mb-6">{new Date(post.publishedAt).toLocaleDateString()}</p>
        {post.coverImage && <img src={post.coverImage} alt={post.title} className="w-full h-72 object-cover rounded-md mb-6" />}
        <div className="prose prose-lg">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.body}</ReactMarkdown>
        </div>
      </article>
    </main>
  );
}
