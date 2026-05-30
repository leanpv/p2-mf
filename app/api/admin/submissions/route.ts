import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { verifySession } from "@/lib/admin/session";

const querySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  status: z.enum(["pending", "contacted"]).optional(),
});

export async function GET(req: NextRequest) {
  const session = await verifySession();
  if (!session) return NextResponse.json({ message: "No autorizado" }, { status: 401 });

  const { searchParams } = req.nextUrl;
  const parsed = querySchema.safeParse({
    page: searchParams.get("page") ?? undefined,
    limit: searchParams.get("limit") ?? undefined,
    status: searchParams.get("status") ?? undefined,
  });

  if (!parsed.success) {
    return NextResponse.json({ message: "Parámetros inválidos" }, { status: 400 });
  }

  const { page, limit, status } = parsed.data;
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (status) params.set("status", status);

  const backendUrl = process.env.NESTJS_API_URL;
  const secret = process.env.BFF_TO_BACKEND_SECRET;

  let res: Response;
  try {
    res = await fetch(`${backendUrl}/api/contact/submissions?${params}`, {
      headers: { "x-bff-secret": secret! },
    });
  } catch {
    return NextResponse.json({ message: "Error conectando al backend" }, { status: 502 });
  }

  if (!res.ok) return NextResponse.json({ message: "Error del backend" }, { status: 502 });

  const data = await res.json();
  return NextResponse.json(data);
}
