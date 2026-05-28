"use client";

import { useRef, useEffect } from "react";
import { useUIStore } from "@/lib/zustand/ui.store";
import { PROPERTIES } from "@/features/gallery/gallery.data";
import { cn } from "@/lib/utils";

const SLIDE_VIDEOS: Record<number, string> = {
  0: "/video1.mp4",
  1: "/video2.mp4",
  2: "/video3.mp4",
  3: "/video4.mp4",
  4: "/video5.mp4",
};

export function SliderPlaceholder() {
  const { currentSlide, nextSlide, prevSlide, openGallery } = useUIStore();
  const touchStartX = useRef<number | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    videoRefs.current.forEach((video, i) => {
      if (!video) return;
      if (i === currentSlide) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, [currentSlide]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 50) {
      if (delta < 0) nextSlide();
      else prevSlide();
    }
    touchStartX.current = null;
  };

  return (
    <section
      className="relative w-full h-dvh bg-primary overflow-hidden"
      aria-label="Slider de propiedades"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >

      {/* Slides */}
      {PROPERTIES.map((prop, i) => (
        <div
          key={i}
          className={cn(
            "absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-700",
            i === currentSlide ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
          aria-hidden={i !== currentSlide}
        >
          {/* Fondo: video si existe, placeholder numérico si no */}
          {SLIDE_VIDEOS[i] ? (
            <video
              ref={(el) => { videoRefs.current[i] = el; }}
              src={SLIDE_VIDEOS[i]}
              muted
              loop
              playsInline
              preload="auto"
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center opacity-5">
              <span
                className="font-sans font-light text-secondary select-none"
                style={{ fontSize: "clamp(8rem, 25vw, 22rem)", lineHeight: 1, letterSpacing: "0.1em" }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/40 to-primary/90" />

          {/* Contenido */}
          <div className="relative z-10 text-center px-6 translate-y-2 md:translate-y-0">
            <p
              className="font-sans font-medium text-accent uppercase mb-[60px] md:mb-4 text-center"
              style={{ letterSpacing: "0.3em", fontSize: "0.95rem" }}
            >
              {prop.name}
            </p>
            <p
              className="font-sans font-light text-secondary text-center"
              style={{ fontSize: "clamp(1.3rem, 5.5vw, 2.1rem)", letterSpacing: "0.18em" }}
            >
              {[...prop.sliderLabel.split(" · ").slice(0, 2), prop.location].map((part, j, arr) => (
                <span key={j}>
                  <span className={cn("block md:inline", j < arr.length - 1 ? "mb-[30px] md:mb-0" : "")}>{part}</span>
                  {j < arr.length - 1 && <span className="hidden md:inline"> · </span>}
                </span>
              ))}
            </p>

            <button
              onClick={(e) => { e.stopPropagation(); openGallery(i); }}
              className="group relative mt-[60px] md:mt-10 overflow-hidden border border-secondary/95 hover:border-secondary px-8 py-3 cursor-pointer transition-colors duration-300"
            >
              <span className="absolute inset-0 bg-secondary/0 group-hover:bg-secondary/10 transition-colors duration-300" />
              <span
                className="relative font-sans font-light text-secondary/95 group-hover:text-secondary uppercase transition-colors duration-300"
                style={{ letterSpacing: "0.2em", fontSize: "0.65rem" }}
              >
                Ver más
              </span>
            </button>
          </div>
        </div>
      ))}

      {/* Flechas — detienen propagación para no abrir galería */}
      <button
        onClick={(e) => { e.stopPropagation(); prevSlide(); }}
        className="group absolute left-6 md:left-12 top-1/2 -translate-y-1/2 z-20 text-secondary hover:text-accent hover:-translate-x-2 transition-all duration-300 p-2 cursor-pointer"
        aria-label="Slide anterior"
      >
        <svg
          width="56" height="56" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5"
          className="transition-all duration-300 group-hover:[stroke-width:2]"
        >
          <path d="M20 8L12 16L20 24" />
        </svg>
      </button>

      <button
        onClick={(e) => { e.stopPropagation(); nextSlide(); }}
        className="group absolute right-6 md:right-12 top-1/2 -translate-y-1/2 z-20 text-secondary hover:text-accent hover:translate-x-2 transition-all duration-300 p-2 cursor-pointer"
        aria-label="Slide siguiente"
      >
        <svg
          width="56" height="56" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5"
          className="transition-all duration-300 group-hover:[stroke-width:2]"
        >
          <path d="M12 8L20 16L12 24" />
        </svg>
      </button>

      {/* Indicadores mobile: nombre a la izquierda, FAB contacto a la derecha */}
      <div className="md:hidden absolute bottom-[10px] left-6 z-20 flex flex-col justify-center items-start gap-2 h-[44px]">
        <span
          className="font-sans font-medium text-accent uppercase whitespace-nowrap"
          style={{ letterSpacing: "0.18em", fontSize: "0.8rem" }}
        >
          {PROPERTIES[currentSlide].name}
        </span>
        <span
          className="font-sans font-light text-secondary/30 tabular-nums"
          style={{ letterSpacing: "0.15em", fontSize: "0.6rem" }}
        >
          {String(currentSlide + 1).padStart(2, "0")} / {String(PROPERTIES.length).padStart(2, "0")}
        </span>
      </div>

      {/* Indicadores desktop: lista de nombres centrada, con margen derecho para el FAB */}
      <div className="hidden md:flex absolute bottom-8 left-1/2 -translate-x-1/2 z-20 items-center gap-10">
        {PROPERTIES.map((prop, i) => (
          <button
            key={i}
            onClick={(e) => { e.stopPropagation(); useUIStore.getState().setSlide(i); }}
            className={cn(
              "font-sans uppercase transition-all duration-300 cursor-pointer whitespace-nowrap",
              i === currentSlide
                ? "text-accent font-medium"
                : "text-secondary/30 font-light hover:text-secondary/60"
            )}
            style={{
              letterSpacing: "0.18em",
              fontSize: i === currentSlide ? "0.8rem" : "0.65rem",
            }}
            aria-label={`Ir a ${prop.name}`}
          >
            {prop.name}
          </button>
        ))}
      </div>
    </section>
  );
}
