"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { cn } from "@/lib/utils";

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "Ingresá tu contraseña"),
});
type LoginData = z.infer<typeof loginSchema>;

async function loginWithPassword(data: LoginData) {
  const res = await fetch("/api/admin/auth/login-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message ?? "Credenciales inválidas");
  }
  window.location.href = "/admin";
}

const fieldClass = [
  "w-full bg-transparent border-b border-border",
  "font-sans font-light text-primary py-3 outline-none",
  "placeholder:text-muted/40 transition-colors duration-200",
  "focus:border-primary",
].join(" ");

export default function LoginPage() {
  const [method, setMethod] = useState<"select" | "password">("select");

  const { register, handleSubmit, formState: { errors } } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

  const mutation = useMutation({ mutationFn: loginWithPassword });

  if (method === "password") {
    return (
      <div className="min-h-dvh bg-muted-bg flex items-center justify-center px-4">
        <div className="w-full max-w-sm bg-secondary border border-border p-8 flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <p className="font-sans font-medium text-primary uppercase tracking-widest" style={{ fontSize: "0.65rem" }}>
              Amatista Propiedades
            </p>
            <h1 className="font-serif text-primary" style={{ fontSize: "clamp(1.5rem, 4vw, 2rem)" }}>
              Panel de administración
            </h1>
          </div>

          <form onSubmit={handleSubmit((d) => mutation.mutate(d))} noValidate className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="font-sans font-medium text-primary uppercase" style={{ letterSpacing: "0.12em", fontSize: "0.65rem" }}>
                Email
              </label>
              <input {...register("email")} type="email" placeholder="tu@email.com" autoComplete="email"
                className={cn(fieldClass, errors.email && "border-red-500")} />
              {errors.email && <p className="font-sans text-red-600 text-xs">{errors.email.message}</p>}
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-sans font-medium text-primary uppercase" style={{ letterSpacing: "0.12em", fontSize: "0.65rem" }}>
                Contraseña
              </label>
              <input {...register("password")} type="password" placeholder="Tu contraseña" autoComplete="current-password"
                className={cn(fieldClass, errors.password && "border-red-500")} />
              {errors.password && <p className="font-sans text-red-600 text-xs">{errors.password.message}</p>}
            </div>

            {mutation.isError && (
              <p className="font-sans text-sm text-red-600" role="alert">
                {mutation.error instanceof Error ? mutation.error.message : "Credenciales inválidas"}
              </p>
            )}

            <button type="submit" disabled={mutation.isPending}
              className="w-full bg-primary text-secondary font-sans font-medium uppercase py-4 hover:opacity-80 transition-opacity duration-200 disabled:opacity-40 cursor-pointer"
              style={{ letterSpacing: "0.15em", fontSize: "0.7rem" }}>
              {mutation.isPending ? "Ingresando…" : "Iniciar sesión"}
            </button>
          </form>

          <button onClick={() => setMethod("select")}
            className="font-sans text-muted hover:text-primary transition-colors duration-200 cursor-pointer text-center"
            style={{ fontSize: "0.7rem" }}>
            ← Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-muted-bg flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-secondary border border-border p-8 flex flex-col gap-8">
        <div className="flex flex-col gap-1">
          <p className="font-sans font-medium text-primary uppercase tracking-widest" style={{ fontSize: "0.65rem" }}>
            Amatista Propiedades
          </p>
          <h1 className="font-serif text-primary" style={{ fontSize: "clamp(1.5rem, 4vw, 2rem)" }}>
            Panel de administración
          </h1>
        </div>

        <div className="flex flex-col gap-3">
          <a href="/api/admin/auth/login"
            className="flex items-center justify-center gap-3 w-full bg-primary text-secondary font-sans font-medium uppercase py-4 hover:opacity-80 transition-opacity duration-200"
            style={{ letterSpacing: "0.15em", fontSize: "0.7rem" }}>
            <GoogleIcon />
            Entrar con Google
          </a>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-border" />
            <span className="font-sans text-muted" style={{ fontSize: "0.65rem" }}>o</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <button onClick={() => setMethod("password")}
            className="w-full border border-border text-primary font-sans font-medium uppercase py-4 hover:bg-border transition-colors duration-200 cursor-pointer"
            style={{ letterSpacing: "0.15em", fontSize: "0.7rem" }}>
            Entrar con email y contraseña
          </button>
        </div>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}
