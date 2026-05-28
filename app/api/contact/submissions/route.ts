import { NextResponse } from "next/server";

export async function GET() {
  const backendUrl = process.env.NESTJS_API_URL;
  const secret = process.env.BFF_TO_BACKEND_SECRET;

  if (!backendUrl || !secret) {
    return NextResponse.json({ message: "Error de configuración" }, { status: 500 });
  }

  const res = await fetch(`${backendUrl}/api/contact/submissions`, {
    headers: { "x-bff-secret": secret },
    cache: "no-store",
  });

  if (!res.ok) {
    return NextResponse.json({ message: "Error al obtener submissions" }, { status: res.status });
  }

  const data = await res.json();
  return NextResponse.json(data);
}
