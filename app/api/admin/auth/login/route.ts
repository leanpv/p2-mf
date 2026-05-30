import { NextResponse } from "next/server";

export function GET() {
  const clientId = process.env.AUTH_GOOGLE_ID;
  const appUrl = process.env.APP_URL;

  if (!clientId || !appUrl) {
    return NextResponse.json({ message: "Error de configuración" }, { status: 500 });
  }

  const redirectUri = `${appUrl}/api/admin/auth/callback`;
  const scope = "openid email";

  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", scope);
  url.searchParams.set("access_type", "online");

  return NextResponse.redirect(url.toString());
}
