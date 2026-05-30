import { NextResponse } from "next/server";
import { randomBytes } from "crypto";

export function GET() {
  const clientId = process.env.AUTH_GOOGLE_ID;
  const appUrl = process.env.APP_URL;

  if (!clientId || !appUrl) {
    return NextResponse.json({ message: "Error de configuración" }, { status: 500 });
  }

  const state = randomBytes(16).toString("hex");
  const redirectUri = `${appUrl}/api/admin/auth/callback`;

  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "openid email");
  url.searchParams.set("access_type", "online");
  url.searchParams.set("state", state);

  const response = NextResponse.redirect(url.toString());
  response.cookies.set("oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 10,
    path: "/",
  });

  return response;
}
