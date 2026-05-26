"use client";

import { useUIStore } from "@/lib/zustand/ui.store";
import { cn } from "@/lib/utils";

const SLIDES = [
  { label: "Slide 01", subtitle: "Penthouse · Nueva Córdoba" },
  { label: "Slide 02", subtitle: "Casa · Cerro de las Rosas" },
  { label: "Slide 03", subtitle: "Departamento · Güemes" },
  { label: "Slide 04", subtitle: "Villa · Country Los Álamos" },
  { label: "Slide 05", subtitle: "Loft · Centro" },
];

export function SliderPlaceholder() {
  const { currentSlide, nextSlide, prevSlide } = useUIStore();

  return (
    <section className="relative w-full h-screen bg-primary overflow-hidden" aria-label="Slider de propiedades">

      {/* Slides */}
      {SLIDES.map((slide, i) => (
        <div
          key={i}
          className={cn(
            "absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-700",
            i === currentSlide ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
          aria-hidden={i !== currentSlide}
        >
          {/* Placeholder visual */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/40 to-primary/90" />
          <div className="absolute inset-0 flex items-center justify-center opacity-5">
            <span className="font-sans font-light text-secondary select-none"
              style={{ fontSize: "clamp(8rem, 25vw, 22rem)", lineHeight: 1, letterSpacing: "0.1em" }}>
              {String(i + 1).padStart(2, "0")}
            </span>
          </div>

          {/* Contenido */}
          <div className="relative z-10 text-center px-6">
            <p className="font-sans font-medium text-accent uppercase mb-4"
              style={{ letterSpacing: "0.3em", fontSize: "0.65rem" }}>
              {slide.subtitle}
            </p>
            <h2 className="font-sans font-light text-secondary"
              style={{ fontSize: "var(--text-display)", letterSpacing: "var(--tracking-display)", lineHeight: "var(--leading-display)" }}>
              {slide.label}
            </h2>
          </div>
        </div>
      ))}

      {/* Flechas */}
      <button
        onClick={prevSlide}
        className="absolute left-6 md:left-12 top-1/2 -translate-y-1/2 z-20 text-secondary/40 hover:text-accent hover:scale-110 transition-all duration-300 p-2 cursor-pointer"
        aria-label="Slide anterior"
      >
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1">
          <path d="M20 8L12 16L20 24" />
        </svg>
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-6 md:right-12 top-1/2 -translate-y-1/2 z-20 text-secondary/40 hover:text-accent hover:scale-110 transition-all duration-300 p-2 cursor-pointer"
        aria-label="Slide siguiente"
      >
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1">
          <path d="M12 8L20 16L12 24" />
        </svg>
      </button>

      {/* Indicadores */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => useUIStore.getState().setSlide(i)}
            className={cn(
              "h-px transition-all duration-500 cursor-pointer",
              i === currentSlide
                ? "w-10 bg-accent"
                : "w-4 bg-secondary/30 hover:bg-secondary/60"
            )}
            aria-label={`Ir al slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Número de slide */}
      <div className="absolute bottom-8 right-6 md:right-12 z-20 font-sans font-light text-secondary/30 tabular-nums"
        style={{ letterSpacing: "0.15em", fontSize: "0.7rem" }}>
        {String(currentSlide + 1).padStart(2, "0")} / {String(SLIDES.length).padStart(2, "0")}
      </div>
    </section>
  );
}
