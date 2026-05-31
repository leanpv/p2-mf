import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createSession, setSessionCookie } from "@/lib/admin/session";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1).max(72),
});

export async function POST(req: NextRequest) {
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
    return NextResponse.json({ message: "Email no autorizado" }, { status: 401 });
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
    return NextResponse.json({ message: "Credenciales inválidas", backendStatus: res.status }, { status: 401 });
  }

  const token = await createSession(parsed.data.email);
  const cookie = setSessionCookie(token);
  const response = NextResponse.json({ ok: true });
  response.cookies.set(cookie);
  return response;
}
