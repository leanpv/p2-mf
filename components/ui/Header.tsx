"use client";

export function Header() {
    return (
        <header className="fixed top-0 left-0 right-0 z-[65] flex items-start justify-center px-6 pt-3 md:px-12 md:pt-4 pointer-events-none">
            <span
                className="select-none font-serif mix-blend-difference text-secondary"
                style={{ fontSize: "clamp(1.1rem, 3vw, 1.5rem)", letterSpacing: "0.25em" }}
            >
                AMATISTA
            </span>
        </header>
    );
}
