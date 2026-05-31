import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";
import { registerSchema } from "@/features/auth/auth.schema";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const rl = rateLimit(`auth-register:${ip}`, 3, 60 * 60 * 1000); // 3 por hora
  if (!rl.allowed) {
    return NextResponse.json(
      { message: "Demasiados intentos. Intentá en una hora." },
      { status: 429, headers: { "Retry-After": String(Math.ceil((rl.resetAt - Date.now()) / 1000)) } }
    );
  }

  let body: unknown;
  try { body = await req.json(); } catch {
    return NextResponse.json({ message: "Request inválido" }, { status: 400 });
  }

  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Datos inválidos", errors: parsed.error.flatten().fieldErrors }, { status: 422 });
  }

  const backendUrl = process.env.NESTJS_API_URL;
  const secret = process.env.BFF_TO_BACKEND_SECRET;

  let res: Response;
  try {
    res = await fetch(`${backendUrl}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-bff-secret": secret!,
        "user-agent": req.headers.get("user-agent") ?? "",
      },
      body: JSON.stringify({ email: parsed.data.email, password: parsed.data.password }),
    });
  } catch {
    return NextResponse.json({ message: "Error de servidor" }, { status: 502 });
  }

  const data = await res.json();
  if (!res.ok) return NextResponse.json(data, { status: res.status });

  const response = NextResponse.json({ accessToken: data.accessToken }, { status: 201 });
  response.cookies.set("refresh_token", data.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7, // 7 días
    path: "/api/auth",
  });
  return response;
}
