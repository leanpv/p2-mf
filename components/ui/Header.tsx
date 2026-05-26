"use client";

import Image from "next/image";
export function Header() {
    return (
        <header className="fixed top-0 left-0 right-0 z-[65] flex items-start justify-center px-6 pt-3 md:px-12 md:pt-4 pointer-events-none">
            <Image
                src="/logocba2.png"
                alt="Propiedades CBA"
                width={140}
                height={40}
                className="select-none brightness-0 invert mix-blend-difference"
                priority
            />
        </header>
    );
}
