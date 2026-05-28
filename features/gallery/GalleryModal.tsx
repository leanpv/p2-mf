"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useUIStore } from "@/lib/zustand/ui.store";
import { PROPERTIES, type Property } from "./gallery.data";
import { cn } from "@/lib/utils";

export function GalleryModal() {
  const { isGalleryOpen, closeGallery, galleryActiveTab, setGalleryTab, setLightbox: setLightboxStore } = useUIStore();
  const panelRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const [lightbox, setLightboxLocal] = useState<{ photoIdx: number } | null>(null);
  const touchStartX = useRef<number | null>(null);

  const setLightbox = (val: { photoIdx: number } | null) => {
    setLightboxLocal(val);
    setLightboxStore(val !== null);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || lightbox) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 50) {
      if (delta < 0) setGalleryTab((galleryActiveTab + 1) % PROPERTIES.length);
      else setGalleryTab((galleryActiveTab - 1 + PROPERTIES.length) % PROPERTIES.length);
    }
    touchStartX.current = null;
  };

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    if (isGalleryOpen) {
      gsap.set(panel, { y: "100%" });
      gsap.to(panel, { y: "0%", duration: 0.65, ease: "expo.out", onStart: () => { if (scrollRef.current) scrollRef.current.scrollTop = 0; } });
    } else {
      gsap.to(panel, { y: "100%", duration: 0.45, ease: "expo.in", onComplete: () => setLightbox(null) });
    }
  }, [isGalleryOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (lightbox) setLightbox(null);
        else closeGallery();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeGallery, lightbox]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
    tabsRef.current[galleryActiveTab]?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [galleryActiveTab, isGalleryOpen]);

  const activeProp = PROPERTIES[galleryActiveTab];

  return (
    <>
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Galería de propiedades"
        className="fixed inset-0 z-50 bg-secondary flex flex-col translate-y-full"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 md:px-12 py-6 border-b border-border shrink-0">
          <p
            className="font-sans font-medium text-primary uppercase"
            style={{ letterSpacing: "0.2em", fontSize: "0.7rem" }}
          >
            Galería
          </p>
          <button
            onClick={closeGallery}
            className="group relative flex items-center justify-center w-14 h-14 text-primary cursor-pointer"
            aria-label="Cerrar galería"
          >
            <span className="absolute inset-0 rounded-full border border-border scale-75 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300" />
            <svg
              width="28" height="28" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1"
              className="transition-all duration-300 group-hover:rotate-90 [stroke-width:1] group-hover:[stroke-width:1.6]"
            >
              <path d="M4 4L16 16M16 4L4 16" />
            </svg>
          </button>
        </div>

        {/* Tab bar */}
        <div className="flex overflow-x-auto border-b border-border px-6 md:px-12 gap-8 shrink-0 scrollbar-none">
          {PROPERTIES.map((prop, i) => (
            <button
              key={prop.id}
              ref={(el) => { tabsRef.current[i] = el; }}
              onClick={() => setGalleryTab(i)}
              className={cn(
                "font-sans font-medium uppercase py-4 whitespace-nowrap cursor-pointer transition-colors duration-200 border-b-2 -mb-px shrink-0",
                i === galleryActiveTab
                  ? "text-primary border-accent"
                  : "text-muted border-transparent hover:text-primary"
              )}
              style={{ letterSpacing: "0.15em", fontSize: "0.65rem" }}
            >
              {prop.name}
            </button>
          ))}
        </div>

        {/* Subtítulo de propiedad activa */}
        <div className="px-6 md:px-12 pt-8 pb-4 shrink-0">
          <p
            className="font-sans font-light text-muted"
            style={{ letterSpacing: "0.08em", fontSize: "0.75rem" }}
          >
            {activeProp.name} · {activeProp.location}
            <span className="ml-4 text-muted/40">{activeProp.photoCount} fotos</span>
          </p>
        </div>

        {/* Grid de fotos */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 md:px-12 pb-12 scrollbar-none">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {Array.from({ length: activeProp.photos ? activeProp.photos.length : activeProp.photoCount }).map((_, photoIdx) => (
              <button
                key={photoIdx}
                onClick={() => setLightbox({ photoIdx })}
                className="group relative aspect-[4/3] bg-muted-bg overflow-hidden cursor-pointer"
                aria-label={`Foto ${photoIdx + 1} de ${activeProp.name}`}
              >
                {activeProp.photos?.[photoIdx] ? (
                  <Image
                    src={activeProp.photos[photoIdx]}
                    alt={`${activeProp.name} ${photoIdx + 1}`}
                    fill
                    unoptimized
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                ) : !activeProp.photos ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-sans font-light text-muted/20 tabular-nums" style={{ fontSize: "2rem" }}>
                      {String(photoIdx + 1).padStart(2, "0")}
                    </span>
                  </div>
                ) : null}
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/8 transition-colors duration-300 flex items-center justify-center">
                  <svg
                    className="text-primary opacity-0 group-hover:opacity-60 transition-opacity duration-300"
                    width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1"
                  >
                    <path d="M1 1h6M1 1v6M17 1h-6M17 1v6M1 17h6M1 17v-6M17 17h-6M17 17v-6" />
                  </svg>
                </div>
              </button>
            ))}
          </div>
        </div>

      </div>

      {lightbox && (
        <Lightbox
          property={activeProp}
          photoIdx={lightbox.photoIdx}
          onClose={() => setLightbox(null)}
          onPrev={() => lightbox && setLightbox({ photoIdx: (lightbox.photoIdx - 1 + activeProp.photoCount) % activeProp.photoCount })}
          onNext={() => lightbox && setLightbox({ photoIdx: (lightbox.photoIdx + 1) % activeProp.photoCount })}
        />
      )}
    </>
  );
}

function Lightbox({
  property,
  photoIdx,
  onClose,
  onPrev,
  onNext,
}: {
  property: Property;
  photoIdx: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const touchStartX = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 50) {
      if (delta < 0) onNext();
      else onPrev();
    }
    touchStartX.current = null;
  };

  return (
    <div
      className="fixed inset-0 z-[60] bg-primary flex items-center justify-center"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Foto */}
      <div className="relative w-full max-w-7xl aspect-[16/9] mx-4 md:mx-10">
        {property.photos?.[photoIdx] ? (
          <Image
            src={property.photos[photoIdx]}
            alt={`${property.name} ${photoIdx + 1}`}
            fill
            unoptimized
            className="object-contain"
            sizes="100vw"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-white/5 flex items-center justify-center border border-secondary/10">
            <span className="font-sans font-light text-secondary/20 uppercase" style={{ letterSpacing: "0.25em", fontSize: "0.65rem" }}>
              {property.name} · {property.location} · {String(photoIdx + 1).padStart(2, "0")}
            </span>
          </div>
        )}
      </div>

      {/* Cerrar */}
      <button
        onClick={onClose}
        className="group absolute top-6 right-6 flex items-center justify-center w-14 h-14 text-secondary cursor-pointer"
        aria-label="Cerrar"
      >
        <span className="absolute inset-0 rounded-full border border-secondary/20 scale-75 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300" />
        <svg
          width="28" height="28" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1"
          className="transition-all duration-300 group-hover:rotate-90 [stroke-width:1] group-hover:[stroke-width:1.6]"
        >
          <path d="M4 4L16 16M16 4L4 16" />
        </svg>
      </button>

      {/* Anterior */}
      <button
        onClick={onPrev}
        className="group absolute left-6 md:left-12 top-1/2 -translate-y-1/2 text-secondary hover:text-accent hover:-translate-x-2 transition-all duration-300 p-2 cursor-pointer"
        aria-label="Foto anterior"
      >
        <svg width="56" height="56" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5"
          className="transition-all duration-300 group-hover:[stroke-width:2]">
          <path d="M20 8L12 16L20 24" />
        </svg>
      </button>

      {/* Siguiente */}
      <button
        onClick={onNext}
        className="group absolute right-6 md:right-12 top-1/2 -translate-y-1/2 text-secondary hover:text-accent hover:translate-x-2 transition-all duration-300 p-2 cursor-pointer"
        aria-label="Foto siguiente"
      >
        <svg width="56" height="56" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5"
          className="transition-all duration-300 group-hover:[stroke-width:2]">
          <path d="M12 8L20 16L12 24" />
        </svg>
      </button>

      {/* Contador */}
      <div
        className="absolute bottom-6 left-6 md:left-12 font-sans font-light text-secondary/30 tabular-nums"
        style={{ letterSpacing: "0.15em", fontSize: "0.7rem" }}
      >
        {String(photoIdx + 1).padStart(2, "0")} / {String(property.photoCount).padStart(2, "0")}
      </div>
    </div>
  );
}
