"use client";

import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import gsap from "gsap";
import { useUIStore } from "@/lib/zustand/ui.store";
import { contactSchema, type ContactFormData } from "./contact.schema";
import { cn } from "@/lib/utils";

async function submitContact(data: ContactFormData) {
  const res = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message ?? "Error al enviar");
  }
  return res.json();
}

export function ContactModal() {
  const { isContactModalOpen, closeContactModal } = useUIStore();
  const panelRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const mutation = useMutation({
    mutationFn: submitContact,
    onSuccess: () => {
      reset();
    },
  });

  // Animación entrada/salida
  useEffect(() => {
    const panel = panelRef.current;
    const overlay = overlayRef.current;
    if (!panel || !overlay) return;

    if (isContactModalOpen) {
      gsap.set(panel, { x: "100%" });
      gsap.set(overlay, { autoAlpha: 0 });

      const tl = gsap.timeline();
      tl.to(overlay, {
        autoAlpha: 1,
        duration: 0.4,
        ease: "power2.out",
      }).to(panel, {
        x: "0%",
        duration: 0.9,
        ease: "power4.out",
      }, "-=0.25");
    } else {
      const tl = gsap.timeline({ onComplete: () => mutation.reset() });
      tl.to(panel, {
        x: "100%",
        duration: 0.55,
        ease: "power3.inOut",
      }).to(overlay, {
        autoAlpha: 0,
        duration: 0.35,
        ease: "power2.in",
      }, "-=0.2");
    }
  }, [isContactModalOpen]);

  // Cerrar con Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeContactModal();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeContactModal]);

  return (
    <>
      {/* Overlay */}
      <div
        ref={overlayRef}
        onClick={closeContactModal}
        className="fixed inset-0 z-[70] bg-primary/60 hover:bg-primary/70 backdrop-blur-sm invisible opacity-0 cursor-pointer transition-colors duration-300"
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Formulario de contacto"
        className="fixed top-0 right-0 bottom-0 z-[80] w-full md:w-[520px] bg-secondary flex flex-col translate-x-full overflow-hidden"
      >
        {/* Header del panel */}
        <div className="flex items-center justify-between px-6 md:px-8 py-5 md:py-7 border-b border-border">
          <p className="font-sans font-medium text-primary uppercase" style={{ fontSize: "var(--text-title)", letterSpacing: "0.12em" }}>
            Consultanos
          </p>
          <button
            onClick={closeContactModal}
            className="group relative flex items-center justify-center w-14 h-14 text-primary cursor-pointer"
            aria-label="Cerrar"
          >
            <span className="absolute inset-0 rounded-full border border-border scale-75 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300" />
            <svg
              width="28" height="28" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1"
              className="transition-all duration-300 group-hover:rotate-90 [stroke-width:1] group-hover:[stroke-width:1.6]"
            >
              <path d="M4 4L16 16M16 4L4 16" />
            </svg>
          </button>
        </div>

        {/* Cuerpo */}
        <div className="flex-1 overflow-hidden px-6 md:px-8 py-6 md:py-8">
          {mutation.isSuccess ? (
            <SuccessState onClose={closeContactModal} />
          ) : (
            <form
              onSubmit={handleSubmit((data) => mutation.mutate(data))}
              noValidate
              className="flex flex-col gap-4 md:gap-6"
            >
              <p className="font-sans font-light text-muted" style={{ fontSize: "var(--text-body)", lineHeight: "var(--leading-body)" }}>
                Dejanos tus datos y nos comunicamos a la brevedad.
              </p>

              <Field
                label="Nombre"
                error={errors.name?.message}
              >
                <input
                  {...register("name")}
                  type="text"
                  autoComplete="name"
                  placeholder="Tu nombre"
                  className={cn(fieldClass, errors.name && errorFieldClass)}
                />
              </Field>

              <Field
                label="Teléfono"
                error={errors.phone?.message}
              >
                <input
                  {...register("phone")}
                  type="tel"
                  autoComplete="tel"
                  placeholder="+54 9 351 000 0000"
                  className={cn(fieldClass, errors.phone && errorFieldClass)}
                />
              </Field>

              <Field
                label="Mensaje (opcional)"
                error={errors.message?.message}
              >
                <textarea
                  {...register("message")}
                  rows={4}
                  placeholder="¿Qué propiedad te interesa?"
                  className={cn(fieldClass, "resize-none", errors.message && errorFieldClass)}
                />
              </Field>

              {mutation.isError && (
                <p className="font-sans text-error text-caption" role="alert">
                  {mutation.error instanceof Error
                    ? mutation.error.message
                    : "Error al enviar. Intentá de nuevo."}
                </p>
              )}

              <button
                type="submit"
                disabled={mutation.isPending}
                className="mt-2 w-full bg-primary text-secondary font-sans font-semibold uppercase py-4 transition-opacity duration-200 hover:opacity-80 disabled:opacity-40 cursor-pointer"
                style={{ letterSpacing: "0.2em", fontSize: "0.7rem" }}
              >
                {mutation.isPending ? "Enviando…" : "Enviar consulta"}
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="font-sans font-medium text-primary uppercase"
        style={{ letterSpacing: "0.12em", fontSize: "0.65rem" }}>
        {label}
      </label>
      {children}
      {error && (
        <p className="font-sans text-error text-caption" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

function SuccessState({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex flex-col items-start gap-6 pt-4">
      <div className="w-10 h-px bg-accent" />
      <p className="font-sans font-medium text-primary uppercase" style={{ fontSize: "var(--text-title)", letterSpacing: "0.1em" }}>
        Mensaje recibido
      </p>
      <p className="font-sans font-light text-muted" style={{ fontSize: "var(--text-body)", lineHeight: "var(--leading-body)" }}>
        Gracias por tu consulta. Nos comunicamos a la brevedad.
      </p>
      <button
        onClick={onClose}
        className="font-sans font-medium text-primary uppercase underline underline-offset-4 hover:text-accent transition-colors duration-200"
        style={{ letterSpacing: "0.15em", fontSize: "0.7rem" }}
      >
        Cerrar
      </button>
    </div>
  );
}

const fieldClass = [
  "w-full bg-transparent border-b border-border",
  "font-sans font-light text-primary py-3 outline-none",
  "placeholder:text-muted/40 transition-colors duration-200",
  "focus:border-primary",
].join(" ");

const errorFieldClass = "border-error focus:border-error";
