"use client";

import { useMutation } from "@tanstack/react-query";

async function logout() {
  await fetch("/api/admin/auth/logout", { method: "POST" });
  window.location.href = "/admin/login";
}

export function AdminHeader({ email }: { email: string }) {
  const mutation = useMutation({ mutationFn: logout });

  return (
    <header className="bg-secondary border-b border-border px-4 md:px-8 py-4 flex items-center justify-between">
      <div className="flex flex-col gap-0.5">
        <p
          className="font-sans font-medium text-primary uppercase tracking-widest"
          style={{ fontSize: "0.6rem" }}
        >
          Amatista Propiedades
        </p>
        <p className="font-serif text-primary" style={{ fontSize: "1.1rem" }}>
          Panel de administración
        </p>
      </div>

      <div className="flex items-center gap-4">
        <span className="font-sans text-muted hidden md:block" style={{ fontSize: "0.75rem" }}>
          {email}
        </span>
        <button
          onClick={() => mutation.mutate()}
          disabled={mutation.isPending}
          className="font-sans font-medium text-primary uppercase border border-border px-4 py-2 bg-secondary hover:bg-border transition-colors duration-200 disabled:opacity-50 cursor-pointer"
          style={{ fontSize: "0.65rem", letterSpacing: "0.12em" }}
        >
          {mutation.isPending ? "Saliendo…" : "Cerrar sesión"}
        </button>
      </div>
    </header>
  );
}
