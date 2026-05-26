"use client";

import { useUIStore } from "@/lib/zustand/ui.store";
import { cn } from "@/lib/utils";

export function ContactFab() {
  const { isContactModalOpen, isGalleryOpen, isLightboxOpen, openContactModal } = useUIStore();

  if (isContactModalOpen) return null;

  const onGallery = isGalleryOpen && !isLightboxOpen;

  return (
    <button
      onClick={openContactModal}
      className={cn(
        "group fixed bottom-8 right-8 z-[65] flex items-center gap-3 px-6 py-4 cursor-pointer overflow-hidden",
        onGallery ? "bg-primary text-secondary" : "bg-secondary text-primary"
      )}
    >
      <span className={cn(
        "absolute inset-0 transition-colors duration-300",
        onGallery ? "bg-secondary/0 group-hover:bg-secondary/10" : "bg-primary/0 group-hover:bg-primary/5"
      )} />
      <span
        className="relative font-sans font-medium uppercase"
        style={{ letterSpacing: "0.2em", fontSize: "0.65rem" }}
      >
        Contacto
      </span>
      <span className={cn("relative w-px h-4", onGallery ? "bg-secondary/20" : "bg-primary/20")} />
      <svg
        className={cn(
          "relative group-hover:translate-x-0.5 transition-all duration-300",
          onGallery ? "text-secondary/50 group-hover:text-secondary" : "text-primary/50 group-hover:text-primary"
        )}
        width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.2"
      >
        <path d="M4 10h12M12 5l5 5-5 5" />
      </svg>
    </button>
  );
}
