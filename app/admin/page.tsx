'use client';

import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { createPost, fetchPublishedPosts, deletePost, updatePost } from '@/lib/posts';
import { BlogPost } from '@/lib/types';

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [newPost, setNewPost] = useState<Omit<BlogPost, 'id'>>({
    title: '',
    slug: '',
    excerpt: '',
    body: '',
    published: false,
    publishedAt: new Date().toISOString(),
    author: '',
  });

  useEffect(() => {
    if (!auth) {
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      setUser(authUser);
    });
    return () => unsubscribe();
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!auth) {
      alert('Firebase auth is not initialized');
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      console.error(err);
      alert('Login failed');
    }
  }

  async function handleLogout() {
    if (!auth) {
      return;
    }
    await signOut(auth);
  }

  async function refreshPosts() {
    const items = await fetchPublishedPosts();
    setPosts(items);
  }

  useEffect(() => {
    if (user) {
      refreshPosts();
    }
  }, [user]);

  async function handlePostCreate(e: React.FormEvent) {
    e.preventDefault();
    try {
      await createPost(newPost);
      await refreshPosts();
      alert('Post created');
    } catch (err) {
      console.error(err);
      alert('Unable to create post');
    }
  }

  if (!user) {
    return (
      <main className="mx-auto max-w-3xl py-10 px-4">
        <h1 className="text-3xl font-bold mb-4">Admin Login</h1>
        <form onSubmit={handleLogin} className="space-y-3">
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border px-3 py-2 rounded" />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border px-3 py-2 rounded" />
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Login</button>
        </form>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl py-10 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button onClick={handleLogout} className="px-3 py-2 bg-gray-200 rounded">
          Logout
        </button>
      </div>

      <section className="mb-10">
        <h2 className="text-2xl mb-3">Create New Post</h2>
        <form onSubmit={handlePostCreate} className="space-y-3">
          <input type="text" placeholder="Title" value={newPost.title} onChange={(e) => setNewPost({ ...newPost, title: e.target.value })} className="w-full border px-3 py-2 rounded" required />
          <input type="text" placeholder="Slug" value={newPost.slug} onChange={(e) => setNewPost({ ...newPost, slug: e.target.value })} className="w-full border px-3 py-2 rounded" required />
          <textarea placeholder="Excerpt" value={newPost.excerpt} onChange={(e) => setNewPost({ ...newPost, excerpt: e.target.value })} className="w-full border px-3 py-2 rounded" rows={2} required />
          <textarea placeholder="Body (markdown)" value={newPost.body} onChange={(e) => setNewPost({ ...newPost, body: e.target.value })} className="w-full border px-3 py-2 rounded" rows={6} required />
          <input type="text" placeholder="Author" value={newPost.author} onChange={(e) => setNewPost({ ...newPost, author: e.target.value })} className="w-full border px-3 py-2 rounded" required />
          <div className="flex gap-3 items-center">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={newPost.published} onChange={(e) => setNewPost({ ...newPost, published: e.target.checked })} />
              Published
            </label>
            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">
              Create Post
            </button>
          </div>
        </form>
      </section>

      <section>
        <h2 className="text-2xl mb-3">Published Posts</h2>
        <div className="space-y-3">
          {posts.map((post) => (
            <article key={post.id} className="border rounded p-3 flex justify-between items-center">
              <div>
                <p className="font-semibold">{post.title}</p>
                <p className="text-sm text-gray-600">{post.slug}</p>
              </div>
              <button onClick={async () => { await deletePost(post.id); await refreshPosts(); }} className="px-2 py-1 bg-red-500 text-white rounded">
                Delete
              </button>
            </article>
          ))}
          {posts.length === 0 && <p>No published posts yet.</p>}
        </div>
      </section>
    </main>
  );
}
