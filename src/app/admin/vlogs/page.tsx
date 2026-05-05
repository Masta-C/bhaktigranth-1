"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAllVlogs, deleteVlog } from "@/lib/firestore";
import type { Vlog } from "@/types";

export default function AdminVlogsPage() {
  const [vlogs, setVlogs] = useState<Vlog[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => getAllVlogs().then((v) => { setVlogs(v); setLoading(false); });

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return;
    await deleteVlog(id);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-3xl font-bold">Vlogs</h1>
        <Link href="/admin/vlogs/new" className="bg-black text-sm font-medium px-5 py-2.5 hover:opacity-70 transition-opacity" style={{ color: "white" }}>
          + Add Vlog
        </Link>
      </div>

      {loading ? (
        <p className="text-sm text-gray-400">Loading…</p>
      ) : vlogs.length === 0 ? (
        <p className="text-sm text-gray-400">No vlogs yet. Add your first one.</p>
      ) : (
        <div className="divide-y divide-gray-100">
          {vlogs.map((vlog) => (
            <div key={vlog.id} className="py-4 flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{vlog.title || "Untitled"}</p>
                <p className="text-xs text-gray-400 mt-0.5 truncate">{vlog.youtubeUrl}</p>
              </div>
              <span className={`text-xs font-medium px-2 py-0.5 shrink-0 ${vlog.status === "published" ? "bg-black text-white" : "bg-gray-100 text-gray-600"}`}>
                {vlog.status}
              </span>
              <button onClick={() => handleDelete(vlog.id, vlog.title)} className="text-xs text-gray-400 hover:text-red-600 transition-colors shrink-0">
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
