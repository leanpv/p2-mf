import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createSession, setSessionCookie } from "@/lib/admin/session";
import { rateLimit } from "@/lib/rate-limit";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1).max(72),
});

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const rl = rateLimit(`admin-login:${ip}`, 5, 15 * 60 * 1000);
  if (!rl.allowed) {
    return NextResponse.json({ message: "Demasiados intentos. Esperá 15 minutos." }, { status: 429 });
  }

  let body: unknown;
  try { body = await req.json(); } catch {
    return NextResponse.json({ message: "Request inválido" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Datos inválidos" }, { status: 422 });
  }

  const backendUrl = process.env.NESTJS_API_URL?.trim();
  const secret = process.env.BFF_TO_BACKEND_SECRET?.trim();
  const allowedEmails = process.env.ADMIN_EMAILS?.split(",").map((e) => e.trim()) ?? [];

  // Verificar allowlist antes de llamar al backend
  if (!allowedEmails.includes(parsed.data.email.toLowerCase())) {
    return NextResponse.json({ message: "Credenciales inválidas" }, { status: 401 });
  }

  let res: Response;
  try {
    res = await fetch(`${backendUrl}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-bff-secret": secret! },
      body: JSON.stringify(parsed.data),
    });
  } catch {
    return NextResponse.json({ message: "Error de servidor" }, { status: 502 });
  }

  if (!res.ok) {
    return NextResponse.json({ message: "Credenciales inválidas" }, { status: 401 });
  }

  const token = await createSession(parsed.data.email);
  const cookie = setSessionCookie(token);
  const response = NextResponse.json({ ok: true });
  response.cookies.set(cookie);
  return response;
}
