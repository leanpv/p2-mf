import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  // Rate limit global: 60 req/min en todas las rutas /api/*
  if (pathname.startsWith("/api/")) {
    const rl = rateLimit(`api:${ip}`, 60, 60 * 1000);
    if (!rl.allowed) {
      return NextResponse.json(
        { message: "Too many requests" },
        {
          status: 429,
          headers: { "Retry-After": String(Math.ceil((rl.resetAt - Date.now()) / 1000)) },
        }
      );
    }
  }

  // Rate limit estricto: 30 req/min en rutas /api/admin/*
  if (pathname.startsWith("/api/admin/")) {
    const rl = rateLimit(`admin:${ip}`, 30, 60 * 1000);
    if (!rl.allowed) {
      return NextResponse.json(
        { message: "Too many requests" },
        {
          status: 429,
          headers: { "Retry-After": String(Math.ceil((rl.resetAt - Date.now()) / 1000)) },
        }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
