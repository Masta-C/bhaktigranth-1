"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAllDownloads } from "@/lib/firestore";
import type { EbookDownload } from "@/types";

export default function AdminDownloadsPage() {
  const [downloads, setDownloads] = useState<EbookDownload[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    getAllDownloads()
      .then((d) => { setDownloads(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = filter
    ? downloads.filter(
        (d) =>
          d.name.toLowerCase().includes(filter.toLowerCase()) ||
          d.email.toLowerCase().includes(filter.toLowerCase()) ||
          d.ebookTitle.toLowerCase().includes(filter.toLowerCase())
      )
    : downloads;

  const handleExportCsv = () => {
    const rows = [
      ["Name", "Email", "Ebook", "Downloaded At"],
      ...filtered.map((d) => [
        d.name,
        d.email,
        d.ebookTitle,
        d.downloadedAt.toLocaleString("en-IN"),
      ]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ebook-downloads.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/admin/ebooks" className="text-sm text-gray-400 hover:text-black transition-colors">← Ebooks</Link>
          <h1 className="font-serif text-3xl font-bold">Downloads Log</h1>
        </div>
        <button
          onClick={handleExportCsv}
          disabled={filtered.length === 0}
          className="border border-gray-200 text-sm font-medium px-5 py-2.5 hover:border-black transition-colors text-gray-600 hover:text-black disabled:opacity-40"
        >
          Export CSV
        </button>
      </div>

      <div className="mb-6">
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Search by name, email, or book title…"
          className="w-full max-w-sm border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:border-black transition-colors"
        />
      </div>

      {loading ? (
        <p className="text-sm text-gray-400">Loading…</p>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-gray-400">{filter ? "No results found." : "No downloads yet."}</p>
      ) : (
        <>
          <p className="text-xs text-gray-400 mb-4">{filtered.length} record{filtered.length !== 1 ? "s" : ""}</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left text-xs font-medium tracking-wide text-gray-400 uppercase pb-3 pr-6">Name</th>
                  <th className="text-left text-xs font-medium tracking-wide text-gray-400 uppercase pb-3 pr-6">Email</th>
                  <th className="text-left text-xs font-medium tracking-wide text-gray-400 uppercase pb-3 pr-6">Ebook</th>
                  <th className="text-left text-xs font-medium tracking-wide text-gray-400 uppercase pb-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((d) => (
                  <tr key={d.id}>
                    <td className="py-3 pr-6 font-medium">{d.name}</td>
                    <td className="py-3 pr-6 text-gray-500">{d.email}</td>
                    <td className="py-3 pr-6 text-gray-600 max-w-xs truncate">{d.ebookTitle}</td>
                    <td className="py-3 text-gray-400 text-xs whitespace-nowrap">
                      {d.downloadedAt.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      {" "}
                      {d.downloadedAt.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
