"use client";

import { useUIStore } from "@/lib/zustand/ui.store";
import { PROPERTIES } from "@/features/gallery/gallery.data";
import { cn } from "@/lib/utils";

export function SliderPlaceholder() {
  const { currentSlide, nextSlide, prevSlide, openGallery } = useUIStore();

  return (
    <section className="relative w-full h-screen bg-primary overflow-hidden" aria-label="Slider de propiedades">

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
          {/* Placeholder visual */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/40 to-primary/90" />
          <div className="absolute inset-0 flex items-center justify-center opacity-5">
            <span
              className="font-sans font-light text-secondary select-none"
              style={{ fontSize: "clamp(8rem, 25vw, 22rem)", lineHeight: 1, letterSpacing: "0.1em" }}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
          </div>

          {/* Contenido */}
          <div className="relative z-10 text-center px-6">
            <p
              className="font-sans font-medium text-accent uppercase mb-4"
              style={{ letterSpacing: "0.3em", fontSize: "0.65rem" }}
            >
              {prop.name} · {prop.location}
            </p>
            <h2
              className="font-sans font-light text-secondary"
              style={{ fontSize: "var(--text-display)", letterSpacing: "var(--tracking-display)", lineHeight: "var(--leading-display)" }}
            >
              {prop.sliderLabel}
            </h2>

            <button
              onClick={(e) => { e.stopPropagation(); openGallery(i); }}
              className="group relative mt-10 overflow-hidden border border-secondary/30 hover:border-secondary/60 px-8 py-3 cursor-pointer transition-colors duration-300"
            >
              <span className="absolute inset-0 bg-secondary/0 group-hover:bg-secondary/10 transition-colors duration-300" />
              <span
                className="relative font-sans font-light text-secondary/60 group-hover:text-secondary uppercase transition-colors duration-300"
                style={{ letterSpacing: "0.2em", fontSize: "0.65rem" }}
              >
                Galería
              </span>
            </button>
          </div>
        </div>
      ))}

      {/* Flechas — detienen propagación para no abrir galería */}
      <button
        onClick={(e) => { e.stopPropagation(); prevSlide(); }}
        className="group absolute left-6 md:left-12 top-1/2 -translate-y-1/2 z-20 text-secondary/40 hover:text-accent hover:-translate-x-2 transition-all duration-300 p-2 cursor-pointer"
        aria-label="Slide anterior"
      >
        <svg
          width="48" height="48" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="0.8"
          className="transition-all duration-300 group-hover:[stroke-width:1.2]"
        >
          <path d="M20 8L12 16L20 24" />
        </svg>
      </button>

      <button
        onClick={(e) => { e.stopPropagation(); nextSlide(); }}
        className="group absolute right-6 md:right-12 top-1/2 -translate-y-1/2 z-20 text-secondary/40 hover:text-accent hover:translate-x-2 transition-all duration-300 p-2 cursor-pointer"
        aria-label="Slide siguiente"
      >
        <svg
          width="48" height="48" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="0.8"
          className="transition-all duration-300 group-hover:[stroke-width:1.2]"
        >
          <path d="M12 8L20 16L12 24" />
        </svg>
      </button>

      {/* Indicadores mobile: nombre a la izquierda, FAB contacto a la derecha */}
      <div className="md:hidden absolute bottom-8 left-8 z-20 flex flex-col items-start gap-2">
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
      <div className="hidden md:flex absolute bottom-8 left-0 right-52 z-20 justify-center items-center gap-10">
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
