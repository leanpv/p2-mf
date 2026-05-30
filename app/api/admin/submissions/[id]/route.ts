import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { verifySession } from "@/lib/admin/session";

const patchSchema = z.object({
  status: z.enum(["pending", "contacted"]),
});

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await verifySession();
  if (!session) return NextResponse.json({ message: "No autorizado" }, { status: 401 });

  const { id } = await params;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Request inválido" }, { status: 400 });
  }

  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Datos inválidos" }, { status: 422 });
  }

  const backendUrl = process.env.NESTJS_API_URL;
  const secret = process.env.BFF_TO_BACKEND_SECRET;

  let res: Response;
  try {
    res = await fetch(`${backendUrl}/api/contact/submissions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-bff-secret": secret! },
      body: JSON.stringify(parsed.data),
    });
  } catch {
    return NextResponse.json({ message: "Error conectando al backend" }, { status: 502 });
  }

  if (res.status === 404) return NextResponse.json({ message: "No encontrado" }, { status: 404 });
  if (!res.ok) return NextResponse.json({ message: "Error del backend" }, { status: 502 });

  return NextResponse.json(await res.json());
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await verifySession();
  if (!session) return NextResponse.json({ message: "No autorizado" }, { status: 401 });

  const { id } = await params;
  const backendUrl = process.env.NESTJS_API_URL;
  const secret = process.env.BFF_TO_BACKEND_SECRET;

  let res: Response;
  try {
    res = await fetch(`${backendUrl}/api/contact/submissions/${id}`, {
      method: "DELETE",
      headers: { "x-bff-secret": secret! },
    });
  } catch {
    return NextResponse.json({ message: "Error conectando al backend" }, { status: 502 });
  }

  if (res.status === 404) return NextResponse.json({ message: "No encontrado" }, { status: 404 });
  if (!res.ok) return NextResponse.json({ message: "Error del backend" }, { status: 502 });

  return new NextResponse(null, { status: 204 });
}
