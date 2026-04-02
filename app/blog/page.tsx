'use client';

import Link from 'next/link';
import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { fetchPostBySlug } from '@/lib/posts';
import { BlogPost } from '@/lib/types';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

function BlogDetailContent() {
  const searchParams = useSearchParams();
  const slug = searchParams.get('slug');

  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!slug) {
      setError('No post specified');
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
        console.error(err);
        setError('Unable to fetch post');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [slug]);

  if (loading) {
    return (
      <main className="mx-auto max-w-4xl py-10 px-4 sm:px-8">
        <p className="text-gray-600">Loading post...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-4xl py-10 px-4 sm:px-8">
        <p className="text-red-500 font-semibold">{error}</p>
        <Link href="/blog" className="text-blue-600 hover:text-blue-800 mt-4 inline-block">
          Back to posts &larr;
        </Link>
      </main>
    );
  }

  if (!post) {
    return (
      <main className="mx-auto max-w-4xl py-10 px-4 sm:px-8">
        <p className="text-gray-600">No post found.</p>
        <Link href="/blog" className="text-blue-600 hover:text-blue-800 mt-4 inline-block">
          Back to posts &larr;
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl py-10 px-4 sm:px-8">
      <Link href="/blog" className="text-blue-600 hover:text-blue-800 text-sm mb-6 inline-block">
        &larr; Back to all posts
      </Link>

      <article className="mt-6">
        <h1 className="text-4xl font-bold mb-2">{post.title}</h1>
        <div className="text-gray-500 text-sm mb-4">
          <p>By {post.author}</p>
          <p>{new Date(post.publishedAt).toLocaleDateString()}</p>
        </div>

        {post.coverImage && (
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-96 object-cover rounded-lg mb-6"
          />
        )}

        <div className="prose prose-lg max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.body}</ReactMarkdown>
        </div>

        {post.tags && post.tags.length > 0 && (
          <div className="mt-8 pt-6 border-t">
            <div className="flex gap-2 flex-wrap">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-gray-200 text-gray-800 text-sm rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </article>
    </main>
  );
}

export default function BlogDetailPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-4xl py-10 px-4 sm:px-8">
          <p className="text-gray-600">Loading...</p>
        </main>
      }
    >
      <BlogDetailContent />
    </Suspense>
  );
}
