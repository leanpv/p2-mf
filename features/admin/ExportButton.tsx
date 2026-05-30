"use client";

import { useState } from "react";

export function ExportButton() {
  const [loading, setLoading] = useState(false);

  async function handleExport() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/submissions/export");
      if (!res.ok) return;
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `submissions-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative group">
      <button
        onClick={handleExport}
        disabled={loading}
        className="font-sans font-medium text-primary uppercase border border-border px-4 py-2 bg-secondary hover:bg-border transition-colors duration-200 flex items-center gap-2 cursor-pointer disabled:opacity-50"
        style={{ fontSize: "0.65rem", letterSpacing: "0.12em" }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        {loading ? "Exportando…" : "Exportar CSV"}
      </button>
      <div className="absolute bottom-full right-0 mb-2 w-56 bg-primary text-secondary px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10"
        style={{ fontSize: "0.7rem", lineHeight: "1.4" }}
      >
        Descarga todas las consultas en formato CSV. Podés abrirlo con Excel o Google Sheets para hacer seguimiento de leads.
        <span className="absolute top-full right-4 border-4 border-transparent border-t-primary" />
      </div>
    </div>
  );
}
