import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refresh_token")?.value;

  if (refreshToken) {
    const backendUrl = process.env.NESTJS_API_URL;
    const secret = process.env.BFF_TO_BACKEND_SECRET;
    try {
      await fetch(`${backendUrl}/api/auth/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-bff-secret": secret! },
        body: JSON.stringify({ refreshToken }),
      });
    } catch { /* silencioso — igual borramos la cookie */ }
  }

  const response = NextResponse.json({ message: "Sesión cerrada" });
  response.cookies.set("refresh_token", "", { maxAge: 0, path: "/api/auth" });
  return response;
}
