"use client";

import { usePathname } from "next/navigation";
import { ContactFab } from "./ContactFab";

export function ConditionalFab() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;
  return <ContactFab />;
}
