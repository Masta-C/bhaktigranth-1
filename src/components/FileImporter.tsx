"use client";

import { useRef, useState } from "react";

interface FileImporterProps {
  onExtracted: (html: string) => void;
  hasContent: boolean;
}

export default function FileImporter({ onExtracted, hasContent }: FileImporterProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = async (file: File) => {
    if (
      hasContent &&
      !confirm("This will replace your current editor content with the file content. Continue?")
    ) {
      return;
    }

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/extract", { method: "POST", body: formData });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
        return;
      }
      onExtracted(data.content);
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setLoading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="border border-dashed border-gray-200 rounded p-5 bg-gray-50">
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.doc,.docx"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />

      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-gray-700">Import from file</p>
          <p className="text-xs text-gray-400 mt-0.5">
            Upload a PDF or Word document — text is extracted and placed in the editor
          </p>
        </div>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={loading}
          className="shrink-0 border border-gray-300 text-sm font-medium px-4 py-2 hover:border-black hover:bg-white transition-colors disabled:opacity-40"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="w-3 h-3 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Extracting…
            </span>
          ) : (
            "Upload PDF / Word"
          )}
        </button>
      </div>

      {error && (
        <p className="text-xs text-red-500 mt-3 border-t border-red-100 pt-3">{error}</p>
      )}
    </div>
  );
}
