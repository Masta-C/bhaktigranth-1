"use client";

import { useEffect, useState } from "react";
import { getPendingQnA, getPublishedQnA, answerAndPublishQnA, deleteQnA } from "@/lib/firestore";
import type { QnAItem } from "@/types";

export default function AdminQnAPage() {
  const [pending, setPending] = useState<QnAItem[]>([]);
  const [published, setPublished] = useState<QnAItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [publishing, setPublishing] = useState<string | null>(null);

  const load = () =>
    Promise.all([getPendingQnA(), getPublishedQnA()]).then(([p, pub]) => {
      setPending(p);
      setPublished(pub);
      setLoading(false);
    });

  useEffect(() => { load(); }, []);

  const handlePublish = async (id: string) => {
    const answer = answers[id]?.trim();
    if (!answer) return alert("Write an answer before publishing.");
    setPublishing(id);
    await answerAndPublishQnA(id, answer);
    await load();
    setPublishing(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this question?")) return;
    await deleteQnA(id);
    load();
  };

  if (loading) return <p className="text-sm text-gray-400">Loading…</p>;

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold mb-10">Q&amp;A</h1>

      {/* Pending */}
      <section className="mb-12">
        <h2 className="text-xs font-medium tracking-widest text-gray-400 uppercase mb-6">
          Pending ({pending.length})
        </h2>
        {pending.length === 0 ? (
          <p className="text-sm text-gray-400">No pending questions.</p>
        ) : (
          <div className="space-y-6">
            {pending.map((item) => (
              <div key={item.id} className="border border-gray-100 p-6">
                <p className="font-serif text-lg font-bold mb-1">{item.question}</p>
                {item.submittedBy && (
                  <p className="text-xs text-gray-400 mb-4">— {item.submittedBy}</p>
                )}
                <textarea
                  rows={3}
                  placeholder="Write your answer…"
                  value={answers[item.id] ?? ""}
                  onChange={(e) => setAnswers((prev) => ({ ...prev, [item.id]: e.target.value }))}
                  className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors resize-none mb-3"
                />
                <div className="flex gap-3">
                  <button
                    onClick={() => handlePublish(item.id)}
                    disabled={publishing === item.id}
                    className="bg-black text-white text-xs font-medium px-5 py-2 hover:opacity-70 transition-opacity disabled:opacity-40"
                  >
                    {publishing === item.id ? "Publishing…" : "Answer & Publish"}
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="text-xs text-gray-400 hover:text-red-600 transition-colors">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Published */}
      <section>
        <h2 className="text-xs font-medium tracking-widest text-gray-400 uppercase mb-6">
          Published ({published.length})
        </h2>
        {published.length === 0 ? (
          <p className="text-sm text-gray-400">No published answers yet.</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {published.map((item) => (
              <div key={item.id} className="py-4 flex justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.question}</p>
                  <p className="text-xs text-gray-400 truncate mt-0.5">{item.answer}</p>
                </div>
                <button onClick={() => handleDelete(item.id)} className="text-xs text-gray-400 hover:text-red-600 transition-colors shrink-0">
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
