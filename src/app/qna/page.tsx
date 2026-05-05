"use client";

import { useEffect, useState } from "react";
import { getPublishedQnA, submitQuestion } from "@/lib/firestore";
import type { QnAItem } from "@/types";

export default function QnAPage() {
  const [items, setItems] = useState<QnAItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [question, setQuestion] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    getPublishedQnA().then((q) => { setItems(q); setLoading(false); });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    setSubmitting(true);
    try {
      await submitQuestion(question.trim(), name.trim());
      setSubmitted(true);
      setName("");
      setQuestion("");
    } catch (e) {
      console.error(e);
      alert("Failed to submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <div className="mb-16">
        <p className="text-xs font-medium tracking-widest text-gray-400 uppercase mb-4">Community</p>
        <h1 className="font-serif text-4xl font-bold mb-4">Questions &amp; Answers</h1>
        <p className="text-gray-500 max-w-lg leading-relaxed">
          Ask a question or browse answers to questions others have asked.
        </p>
      </div>

      {/* Submit form */}
      <div className="border border-gray-100 p-8 mb-16 bg-gray-50">
        <h2 className="font-serif text-xl font-bold mb-2">Ask a Question</h2>
        <p className="text-sm text-gray-500 mb-6">
          Submit your question and it may be answered and published here.
        </p>

        {submitted ? (
          <div className="py-4">
            <p className="text-sm font-medium">Question submitted. Thank you!</p>
            <button onClick={() => setSubmitted(false)} className="text-sm text-gray-400 hover:text-black transition-colors mt-2">
              Ask another question
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium tracking-wide text-gray-600 uppercase mb-2">
                Your Name <span className="text-gray-400">(optional)</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Anonymous"
                className="w-full border border-gray-200 px-4 py-3 text-sm bg-white focus:outline-none focus:border-black transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium tracking-wide text-gray-600 uppercase mb-2">
                Your Question
              </label>
              <textarea
                rows={4}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                required
                placeholder="What would you like to ask?"
                className="w-full border border-gray-200 px-4 py-3 text-sm bg-white focus:outline-none focus:border-black transition-colors resize-none"
              />
            </div>
            <button
              type="submit"
              disabled={submitting || !question.trim()}
              className="bg-black text-white text-sm font-medium px-8 py-3 hover:opacity-70 transition-opacity disabled:opacity-40"
            >
              {submitting ? "Submitting…" : "Submit Question"}
            </button>
          </form>
        )}
      </div>

      {/* Published Q&A */}
      <div className="space-y-12">
        <p className="text-xs font-medium tracking-widest text-gray-400 uppercase">Published Answers</p>
        {loading ? (
          <div className="space-y-8">
            {[1,2,3].map(i => (
              <div key={i} className="animate-pulse border-b border-gray-100 pb-8">
                <div className="h-6 bg-gray-100 w-2/3 mb-4" />
                <div className="h-4 bg-gray-100 w-full mb-2" />
                <div className="h-4 bg-gray-100 w-3/4" />
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <p className="text-sm text-gray-400">No answers published yet. Be the first to ask!</p>
        ) : (
          items.map((item) => (
            <div key={item.id} className="border-b border-gray-100 pb-12">
              <h3 className="font-serif text-xl font-bold mb-4">{item.question}</h3>
              <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">{item.answer}</p>
              {item.answeredAt && (
                <p className="text-xs text-gray-400 mt-4">
                  {item.answeredAt.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
