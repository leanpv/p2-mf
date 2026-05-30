import { NextRequest, NextResponse } from "next/server";
import { createSession, setSessionCookie } from "@/lib/admin/session";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const stateParam = req.nextUrl.searchParams.get("state");
  const appUrl = process.env.APP_URL;
  const clientId = process.env.AUTH_GOOGLE_ID;
  const clientSecret = process.env.AUTH_GOOGLE_SECRET;
  const allowedEmails = process.env.ADMIN_EMAILS?.split(",").map((e) => e.trim()) ?? [];

  if (!code || !appUrl || !clientId || !clientSecret) {
    return NextResponse.redirect(`${appUrl}/admin/login?error=config`);
  }

  // Verificar state (CSRF)
  const cookieStore = await cookies();
  const savedState = cookieStore.get("oauth_state")?.value;
  const verifier = cookieStore.get("oauth_verifier")?.value;

  if (!stateParam || !savedState || stateParam !== savedState || !verifier) {
    return NextResponse.redirect(`${appUrl}/admin/login?error=state`);
  }

  // Intercambiar code por token (con PKCE verifier)
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: `${appUrl}/api/admin/auth/callback`,
      grant_type: "authorization_code",
      code_verifier: verifier,
    }),
  });

  if (!tokenRes.ok) {
    return NextResponse.redirect(`${appUrl}/admin/login?error=token`);
  }

  const { access_token } = await tokenRes.json();

  // Obtener email del usuario
  const userRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: { Authorization: `Bearer ${access_token}` },
  });

  if (!userRes.ok) {
    return NextResponse.redirect(`${appUrl}/admin/login?error=userinfo`);
  }

  const { email } = await userRes.json();

  // Verificar allowlist
  if (!email || !allowedEmails.includes(email)) {
    return NextResponse.redirect(`${appUrl}/admin/login?error=unauthorized`);
  }

  const token = await createSession(email);
  const cookie = setSessionCookie(token);

  const response = NextResponse.redirect(`${appUrl}/admin`);
  response.cookies.set(cookie);
  response.cookies.set("oauth_state", "", { maxAge: 0, path: "/" });
  response.cookies.set("oauth_verifier", "", { maxAge: 0, path: "/" });
  return response;
}
