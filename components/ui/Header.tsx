"use client";

import { useUIStore } from "@/lib/zustand/ui.store";

export function Header() {
    const openContactModal = useUIStore((s) => s.openContactModal);

    return (
        <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-5 md:px-12 md:py-6">
            {/* Logo */}
            <p
                className="font-sans font-light text-secondary uppercase select-none"
                style={{ letterSpacing: "0.22em", fontSize: "0.8rem" }}
            >
                Propiedades CBA W
            </p>

            {/* CTA */}
            <button
                onClick={openContactModal}
                className="group relative text-secondary uppercase overflow-hidden cursor-pointer font-sans font-medium"
                style={{ letterSpacing: "0.18em", fontSize: "0.7rem" }}
                aria-label="Abrir formulario de contacto"
            >
                <span className="relative z-10 transition-colors duration-300 group-hover:text-accent">
                    Consultar
                </span>
                <span
                    className="absolute bottom-0 left-0 h-px w-full bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
                    aria-hidden="true"
                />
            </button>
        </header>
    );
}
