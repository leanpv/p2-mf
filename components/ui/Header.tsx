"use client";


export function Header() {
    return (
        <header className="fixed top-0 left-0 right-0 z-[65] flex items-center justify-center px-6 py-5 md:px-12 md:py-6 pointer-events-none">
            <p
                className="font-sans font-light text-secondary uppercase select-none mix-blend-difference"
                style={{ letterSpacing: "0.22em", fontSize: "0.8rem" }}
            >
                Propiedades CBA
            </p>
        </header>
    );
}
