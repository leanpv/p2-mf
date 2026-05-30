import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/admin/session";

export function POST() {
  const appUrl = process.env.APP_URL ?? "";
  const response = NextResponse.redirect(`${appUrl}/admin/login`);
  response.cookies.set(clearSessionCookie());
  return response;
}
