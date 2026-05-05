"use client";

import { useEffect, useState } from "react";
import { getPublishedVlogs } from "@/lib/firestore";
import type { Vlog } from "@/types";

function getYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
  return match ? match[1] : null;
}

function VlogCard({ vlog }: { vlog: Vlog }) {
  const [playing, setPlaying] = useState(false);
  const videoId = getYouTubeId(vlog.youtubeUrl);

  return (
    <article className="group">
      <div className="aspect-video bg-gray-100 mb-5 overflow-hidden relative">
        {playing && videoId ? (
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        ) : (
          <button
            onClick={() => setPlaying(true)}
            className="w-full h-full relative flex items-center justify-center"
          >
            {videoId && (
              <img
                src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                alt={vlog.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            )}
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-lg">
                <svg className="w-5 h-5 text-black ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </button>
        )}
      </div>
      <h2 className="font-serif text-xl font-bold mb-2 group-hover:opacity-70 transition-opacity">
        {vlog.title}
      </h2>
      {vlog.description && (
        <p className="text-gray-500 text-sm leading-relaxed">{vlog.description}</p>
      )}
      {vlog.publishedAt && (
        <p className="text-xs text-gray-400 mt-2">
          {vlog.publishedAt.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
        </p>
      )}
    </article>
  );
}

export default function VlogsPage() {
  const [vlogs, setVlogs] = useState<Vlog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPublishedVlogs().then((v) => { setVlogs(v); setLoading(false); });
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <div className="mb-16">
        <p className="text-xs font-medium tracking-widest text-gray-400 uppercase mb-4">Video</p>
        <h1 className="font-serif text-4xl font-bold mb-4">Vlogs</h1>
        <p className="text-gray-500 max-w-lg leading-relaxed">
          Video reflections and conversations — watch, listen, and contemplate.
        </p>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 gap-x-12 gap-y-16">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-video bg-gray-100 mb-5" />
              <div className="h-6 bg-gray-100 w-3/4 mb-2" />
              <div className="h-4 bg-gray-100 w-full" />
            </div>
          ))}
        </div>
      ) : vlogs.length === 0 ? (
        <p className="text-gray-400 text-sm">No vlogs published yet. Check back soon.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-x-12 gap-y-16">
          {vlogs.map((vlog) => <VlogCard key={vlog.id} vlog={vlog} />)}
        </div>
      )}
    </div>
  );
}
