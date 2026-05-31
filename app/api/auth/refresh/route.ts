import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refresh_token")?.value;
  if (!refreshToken) {
    return NextResponse.json({ message: "No hay sesión activa" }, { status: 401 });
  }

  const backendUrl = process.env.NESTJS_API_URL;
  const secret = process.env.BFF_TO_BACKEND_SECRET;

  let res: Response;
  try {
    res = await fetch(`${backendUrl}/api/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-bff-secret": secret!,
        "user-agent": req.headers.get("user-agent") ?? "",
      },
      body: JSON.stringify({ refreshToken }),
    });
  } catch {
    return NextResponse.json({ message: "Error de servidor" }, { status: 502 });
  }

  const data = await res.json();
  if (!res.ok) {
    const response = NextResponse.json(data, { status: res.status });
    response.cookies.set("refresh_token", "", { maxAge: 0, path: "/api/auth" });
    return response;
  }

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
