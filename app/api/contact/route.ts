import { NextRequest, NextResponse } from "next/server";
import { contactSchema } from "@/features/contact/contact.schema";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const rl = rateLimit(`contact:${ip}`, 5, 10 * 60 * 1000);

  if (!rl.allowed) {
    return NextResponse.json(
      { message: "Demasiados intentos. Esperá unos minutos." },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil((rl.resetAt - Date.now()) / 1000)),
          "X-RateLimit-Limit": "5",
          "X-RateLimit-Remaining": "0",
        },
      }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Request inválido" }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Datos inválidos", errors: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const backendUrl = process.env.NESTJS_API_URL;
  const secret = process.env.BFF_TO_BACKEND_SECRET;

  if (!backendUrl || !secret) {
    console.error("Faltan variables de entorno del backend");
    return NextResponse.json({ message: "Error de configuración" }, { status: 500 });
  }

  const backendRes = await fetch(`${backendUrl}/api/contact`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-bff-secret": secret,
      "x-forwarded-for": ip,
    },
    body: JSON.stringify(parsed.data),
  });

  if (!backendRes.ok) {
    console.error("Error backend contact:", await backendRes.text());
    return NextResponse.json({ message: "Error al enviar el mensaje" }, { status: 502 });
  }

  return NextResponse.json({ message: "Mensaje enviado" }, { status: 200 });
}
