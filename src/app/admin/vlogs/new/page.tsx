"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createVlog } from "@/lib/firestore";

export default function NewVlogPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("published");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!title.trim()) return alert("Title is required.");
    if (!youtubeUrl.trim()) return alert("YouTube URL is required.");
    setSaving(true);
    try {
      await createVlog({ title, youtubeUrl, description, status });
      router.push("/admin/vlogs");
    } catch (e) {
      console.error(e);
      alert("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-3xl font-bold">Add Vlog</h1>
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

      <div className="space-y-5 max-w-xl">
        <div>
          <label className="block text-xs font-medium tracking-wide text-gray-600 uppercase mb-2">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Video title"
            className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-medium tracking-wide text-gray-600 uppercase mb-2">YouTube URL</label>
          <input
            type="url"
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=…"
            className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors font-mono"
          />
          <p className="text-xs text-gray-400 mt-1">Paste any YouTube watch URL or short link.</p>
        </div>

        <div>
          <label className="block text-xs font-medium tracking-wide text-gray-600 uppercase mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Short description shown under the video"
            className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors resize-none"
          />
        </div>
      </div>
    </div>
  );
}
