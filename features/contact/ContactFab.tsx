"use client";

import { useUIStore } from "@/lib/zustand/ui.store";

export function ContactFab() {
  const { isContactModalOpen, openContactModal } = useUIStore();

  if (isContactModalOpen) return null;

  return (
    <button
      onClick={openContactModal}
      className="group fixed bottom-8 right-8 z-[65] bg-primary text-secondary flex items-center gap-3 px-6 py-4 cursor-pointer overflow-hidden"
    >
      <span className="absolute inset-0 bg-accent/0 group-hover:bg-accent/10 transition-colors duration-300" />
      <span
        className="relative font-sans font-medium uppercase"
        style={{ letterSpacing: "0.2em", fontSize: "0.65rem" }}
      >
        Contacto
      </span>
      <span className="relative w-px h-4 bg-secondary/20" />
      <svg
        className="relative text-secondary/50 group-hover:text-secondary group-hover:translate-x-0.5 transition-all duration-300"
        width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.2"
      >
        <path d="M4 10h12M12 5l5 5-5 5" />
      </svg>
    </button>
  );
}
