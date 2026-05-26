import { Header } from "@/components/ui/Header";
import { SliderPlaceholder } from "@/features/slider/SliderPlaceholder";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <SliderPlaceholder />

        {/* Sección galería / detalles — próximamente */}
        <section className="bg-muted-bg py-24 px-6 md:px-12 min-h-screen flex items-center justify-center">
          <p className="font-sans text-muted text-caption uppercase tracking-widest"
            style={{ letterSpacing: "0.2em" }}>
            Galería · En construcción
          </p>
        </section>
      </main>
    </>
  );
}
