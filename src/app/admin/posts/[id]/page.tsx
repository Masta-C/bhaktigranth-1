"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import dynamic from "next/dynamic";
import { getPostById, updatePost } from "@/lib/firestore";
import FileImporter from "@/components/FileImporter";

const TipTapEditor = dynamic(() => import("@/components/TipTapEditor"), { ssr: false });

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function EditPostPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getPostById(id).then((post) => {
      if (!post) { router.replace("/admin/posts"); return; }
      setTitle(post.title);
      setSlug(post.slug);
      setExcerpt(post.excerpt);
      setCategory(post.category);
      setCoverImageUrl(post.coverImageUrl);
      setContent(post.content);
      setStatus(post.status);
      setLoading(false);
    });
  }, [id, router]);

  const handleSave = async () => {
    if (!title.trim()) return alert("Title is required.");
    setSaving(true);
    try {
      await updatePost(id, { title, slug, excerpt, category, coverImageUrl, content, status });
      router.push("/admin/posts");
    } catch (e) {
      console.error(e);
      alert("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-sm text-gray-400">Loading…</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-3xl font-bold">Edit Post</h1>
        <div className="flex gap-3">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as "draft" | "published")}
            className="border border-gray-200 text-sm px-3 py-2 focus:outline-none focus:border-black"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
          <button onClick={handleSave} disabled={saving} className="bg-black text-white text-sm font-medium px-6 py-2 hover:opacity-70 transition-opacity disabled:opacity-40">
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>

      <div className="space-y-5">
        <div>
          <label className="block text-xs font-medium tracking-wide text-gray-600 uppercase mb-2">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors font-serif text-lg"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium tracking-wide text-gray-600 uppercase mb-2">Slug</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(slugify(e.target.value))}
              className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-medium tracking-wide text-gray-600 uppercase mb-2">Category</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium tracking-wide text-gray-600 uppercase mb-2">Cover Image URL</label>
          <input
            type="url"
            value={coverImageUrl}
            onChange={(e) => setCoverImageUrl(e.target.value)}
            className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-medium tracking-wide text-gray-600 uppercase mb-2">Excerpt</label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={2}
            className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors resize-none"
          />
        </div>

        <FileImporter
          hasContent={content.length > 0}
          onExtracted={(html) => setContent(html)}
        />

        <div>
          <label className="block text-xs font-medium tracking-wide text-gray-600 uppercase mb-2">Content</label>
          <TipTapEditor content={content} onChange={setContent} />
        </div>
      </div>
    </div>
  );
}
