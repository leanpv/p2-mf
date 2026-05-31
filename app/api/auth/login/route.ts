import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";
import { loginSchema } from "@/features/auth/auth.schema";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const rl = rateLimit(`auth-login:${ip}`, 5, 15 * 60 * 1000); // 5 por 15 min
  if (!rl.allowed) {
    return NextResponse.json(
      { message: "Demasiados intentos. Esperá 15 minutos." },
      { status: 429, headers: { "Retry-After": String(Math.ceil((rl.resetAt - Date.now()) / 1000)) } }
    );
  }

  let body: unknown;
  try { body = await req.json(); } catch {
    return NextResponse.json({ message: "Request inválido" }, { status: 400 });
  }

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Datos inválidos", errors: parsed.error.flatten().fieldErrors }, { status: 422 });
  }

  const backendUrl = process.env.NESTJS_API_URL;
  const secret = process.env.BFF_TO_BACKEND_SECRET;

  let res: Response;
  try {
    res = await fetch(`${backendUrl}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-bff-secret": secret!,
        "user-agent": req.headers.get("user-agent") ?? "",
      },
      body: JSON.stringify(parsed.data),
    });
  } catch {
    return NextResponse.json({ message: "Error de servidor" }, { status: 502 });
  }

  const data = await res.json();
  if (!res.ok) return NextResponse.json(data, { status: res.status });

  const response = NextResponse.json({ accessToken: data.accessToken });
  response.cookies.set("refresh_token", data.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7,
    path: "/api/auth",
  });
  return response;
}
