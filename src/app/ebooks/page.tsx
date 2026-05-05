"use client";

import { useEffect, useState } from "react";
import { getPublishedEbooks } from "@/lib/firestore";
import type { Ebook } from "@/types";

function DownloadModal({
  ebook,
  onClose,
}: {
  ebook: Ebook;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/ebooks/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ebookId: ebook.id, name, email }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Something went wrong."); return; }
      window.open(data.url, "_blank");
      onClose();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4" onClick={onClose}>
      <div className="bg-white w-full max-w-md p-8" onClick={(e) => e.stopPropagation()}>
        <h2 className="font-serif text-2xl font-bold mb-1">{ebook.title}</h2>
        <p className="text-sm text-gray-500 mb-6">Enter your details to download this ebook for free.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium tracking-wide text-gray-600 uppercase mb-2">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Your name"
              className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-medium tracking-wide text-gray-600 uppercase mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
            />
          </div>

          {error && <p className="text-xs text-red-600">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-black text-white text-sm font-medium py-3 hover:opacity-70 transition-opacity disabled:opacity-40"
            >
              {loading ? "Preparing…" : "Download Free"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-5 border border-gray-200 text-sm text-gray-500 hover:border-black transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function EbooksPage() {
  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Ebook | null>(null);

  useEffect(() => {
    getPublishedEbooks()
      .then((e) => { setEbooks(e); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <div className="mb-16">
        <p className="text-xs font-medium tracking-widest text-gray-400 uppercase mb-4">Free Downloads</p>
        <h1 className="font-serif text-4xl font-bold mb-4">Ebooks</h1>
        <p className="text-gray-500 max-w-lg leading-relaxed">
          Sacred texts and devotional guides, free to download. Enter your name and email to receive your copy.
        </p>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[3/4] bg-gray-100 mb-4" />
              <div className="h-4 bg-gray-100 w-3/4 mb-2" />
              <div className="h-3 bg-gray-100 w-1/2" />
            </div>
          ))}
        </div>
      ) : ebooks.length === 0 ? (
        <p className="text-gray-400 text-sm">No ebooks published yet. Check back soon.</p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
          {ebooks.map((ebook) => (
            <div key={ebook.id} className="group">
              <div className="aspect-[3/4] bg-gray-100 mb-4 overflow-hidden">
                {ebook.coverImageUrl ? (
                  <img
                    src={ebook.coverImageUrl}
                    alt={ebook.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg className="w-12 h-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                )}
              </div>
              {ebook.category && (
                <p className="text-xs font-medium tracking-widest text-gray-400 uppercase mb-1">{ebook.category}</p>
              )}
              <h2 className="font-serif text-lg font-bold mb-2 leading-snug">{ebook.title}</h2>
              {ebook.description && (
                <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-2">{ebook.description}</p>
              )}
              <button
                onClick={() => setSelected(ebook)}
                className="text-xs font-medium border-b border-black pb-0.5 hover:opacity-60 transition-opacity"
              >
                Download Free →
              </button>
            </div>
          ))}
        </div>
      )}

      {selected && <DownloadModal ebook={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
