"use client";

export function ExportButton() {
  function handleExport() {
    window.location.href = "/api/admin/submissions/export";
  }

  return (
    <button
      onClick={handleExport}
      className="font-sans font-medium text-primary uppercase border border-border px-4 py-2 bg-secondary hover:bg-border transition-colors duration-200 flex items-center gap-2 cursor-pointer"
      style={{ fontSize: "0.65rem", letterSpacing: "0.12em" }}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
      Exportar CSV
    </button>
  );
}
