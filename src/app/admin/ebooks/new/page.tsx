"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";
import { createEbook } from "@/lib/firestore";

export default function NewEbookPage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("published");
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.type !== "application/pdf") return alert("Only PDF files are supported.");
    if (f.size > 50 * 1024 * 1024) return alert("File size must be under 50 MB.");
    setFile(f);
  };

  const handleSave = async () => {
    if (!title.trim()) return alert("Title is required.");
    if (!file) return alert("Please select a PDF file.");
    setSaving(true);

    try {
      // Upload PDF to Firebase Storage
      const storageRef = ref(storage, `ebooks/${Date.now()}_${file.name.replace(/\s+/g, "_")}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      const fileUrl = await new Promise<string>((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snap) => setUploadProgress(Math.round((snap.bytesTransferred / snap.totalBytes) * 100)),
          reject,
          async () => { resolve(await getDownloadURL(uploadTask.snapshot.ref)); }
        );
      });

      await createEbook({ title, description, category, coverImageUrl, fileUrl, status });
      router.push("/admin/ebooks");
    } catch (e) {
      console.error(e);
      alert("Failed to save. Please try again.");
    } finally {
      setSaving(false);
      setUploadProgress(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-3xl font-bold">Add Ebook</h1>
        <div className="flex gap-3">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as "draft" | "published")}
            className="border border-gray-200 text-sm px-3 py-2 focus:outline-none focus:border-black"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-black text-white text-sm font-medium px-6 py-2 hover:opacity-70 transition-opacity disabled:opacity-40"
          >
            {saving ? (uploadProgress !== null ? `Uploading ${uploadProgress}%…` : "Saving…") : "Save"}
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
            placeholder="Ebook title"
            className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-medium tracking-wide text-gray-600 uppercase mb-2">Category</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="e.g. Devotion, Sacred Texts"
            className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-medium tracking-wide text-gray-600 uppercase mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Short description shown on the ebooks listing"
            className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors resize-none"
          />
        </div>

        <div>
          <label className="block text-xs font-medium tracking-wide text-gray-600 uppercase mb-2">Cover Image URL</label>
          <input
            type="url"
            value={coverImageUrl}
            onChange={(e) => setCoverImageUrl(e.target.value)}
            placeholder="https://…"
            className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-medium tracking-wide text-gray-600 uppercase mb-2">PDF File</label>
          <input
            ref={fileRef}
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="w-full border border-dashed border-gray-300 px-4 py-6 text-sm text-gray-500 hover:border-black hover:text-black transition-colors text-center"
          >
            {file ? (
              <span className="text-black font-medium">{file.name} ({(file.size / 1024 / 1024).toFixed(1)} MB)</span>
            ) : (
              "Click to select a PDF (max 50 MB)"
            )}
          </button>
          {uploadProgress !== null && (
            <div className="mt-2 h-1 bg-gray-100">
              <div className="h-1 bg-black transition-all" style={{ width: `${uploadProgress}%` }} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
