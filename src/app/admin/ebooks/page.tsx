"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAllEbooks, deleteEbook, updateEbook } from "@/lib/firestore";
import type { Ebook } from "@/types";

export default function AdminEbooksPage() {
  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => getAllEbooks().then((e) => { setEbooks(e); setLoading(false); });

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    await deleteEbook(id);
    load();
  };

  const handleToggleStatus = async (ebook: Ebook) => {
    const next = ebook.status === "published" ? "draft" : "published";
    await updateEbook(ebook.id, { status: next });
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-3xl font-bold">Ebooks</h1>
        <div className="flex gap-3">
          <Link
            href="/admin/ebooks/downloads"
            className="border border-gray-200 text-sm font-medium px-5 py-2.5 hover:border-black transition-colors text-gray-600 hover:text-black"
          >
            Downloads Log
          </Link>
          <Link
            href="/admin/ebooks/new"
            className="bg-black text-white text-sm font-medium px-5 py-2.5 hover:opacity-70 transition-opacity"
          >
            + Add Ebook
          </Link>
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-gray-400">Loading…</p>
      ) : ebooks.length === 0 ? (
        <p className="text-sm text-gray-400">No ebooks yet. Add your first one.</p>
      ) : (
        <div className="divide-y divide-gray-100">
          {ebooks.map((ebook) => (
            <div key={ebook.id} className="py-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                {ebook.coverImageUrl ? (
                  <img src={ebook.coverImageUrl} alt={ebook.title} className="w-10 h-14 object-cover shrink-0 bg-gray-100" />
                ) : (
                  <div className="w-10 h-14 bg-gray-100 shrink-0" />
                )}
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{ebook.title || "Untitled"}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {ebook.category && <span className="mr-2">{ebook.category}</span>}
                    {ebook.createdAt.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleToggleStatus(ebook)}
                className={`text-xs font-medium px-2 py-0.5 shrink-0 transition-opacity hover:opacity-70 ${
                  ebook.status === "published" ? "bg-black text-white" : "bg-gray-100 text-gray-600"
                }`}
              >
                {ebook.status}
              </button>
              <button
                onClick={() => handleDelete(ebook.id, ebook.title)}
                className="text-xs text-gray-400 hover:text-red-600 transition-colors shrink-0"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
