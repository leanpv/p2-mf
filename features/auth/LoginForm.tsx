"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import { loginSchema, type LoginFormData } from "./auth.schema";

async function loginUser(data: LoginFormData): Promise<{ accessToken: string }> {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message ?? "Error al iniciar sesión");
  return json;
}

const fieldClass = [
  "w-full bg-transparent border-b border-border",
  "font-sans font-light text-primary py-3 outline-none",
  "placeholder:text-muted/40 transition-colors duration-200",
  "focus:border-primary",
].join(" ");

export function LoginForm({ onSuccess }: { onSuccess?: (token: string) => void }) {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => onSuccess?.(data.accessToken),
  });

  return (
    <form onSubmit={handleSubmit((d) => mutation.mutate(d))} noValidate className="flex flex-col gap-5">
      <Field label="Email" error={errors.email?.message}>
        <input {...register("email")} type="email" placeholder="tu@email.com" className={cn(fieldClass, errors.email && "border-red-500")} autoComplete="email" />
      </Field>

      <Field label="Contraseña" error={errors.password?.message}>
        <input {...register("password")} type="password" placeholder="Tu contraseña" className={cn(fieldClass, errors.password && "border-red-500")} autoComplete="current-password" />
      </Field>

      {mutation.isError && (
        <p className="font-sans text-sm text-red-600" role="alert">
          {mutation.error instanceof Error ? mutation.error.message : "Error al iniciar sesión"}
        </p>
      )}

      <button
        type="submit"
        disabled={mutation.isPending}
        className="mt-2 w-full bg-primary text-secondary font-sans font-semibold uppercase py-4 hover:opacity-80 transition-opacity duration-200 disabled:opacity-40 cursor-pointer"
        style={{ letterSpacing: "0.2em", fontSize: "0.7rem" }}
      >
        {mutation.isPending ? "Ingresando…" : "Iniciar sesión"}
      </button>
    </form>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="font-sans font-medium text-primary uppercase" style={{ letterSpacing: "0.12em", fontSize: "0.65rem" }}>
        {label}
      </label>
      {children}
      {error && <p className="font-sans text-red-600" style={{ fontSize: "0.75rem" }} role="alert">{error}</p>}
    </div>
  );
}
