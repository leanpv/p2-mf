import type { Metadata } from "next";
import { Exo_2, DM_Sans } from "next/font/google";
import { ReactQueryProvider } from "@/lib/react-query";
import { ContactModal } from "@/features/contact/ContactModal";
import { ContactFab } from "@/features/contact/ContactFab";
import { GalleryModal } from "@/features/gallery/GalleryModal";
import "./globals.css";

const exo2 = Exo_2({
  variable: "--font-exo2",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Propiedades Premium",
  description: "Propiedades inmobiliarias de lujo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${exo2.variable} ${dmSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ReactQueryProvider>
          {children}
          <ContactModal />
          <GalleryModal />
          <ContactFab />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
