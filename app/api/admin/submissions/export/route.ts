import { NextResponse } from "next/server";
import { verifySession } from "@/lib/admin/session";

export async function GET() {
  const session = await verifySession();
  if (!session) return NextResponse.json({ message: "No autorizado" }, { status: 401 });

  const backendUrl = process.env.NESTJS_API_URL;
  const secret = process.env.BFF_TO_BACKEND_SECRET;

  // Traer todos los submissions (sin paginación, para el export)
  let res: Response;
  try {
    res = await fetch(`${backendUrl}/api/contact/submissions?limit=10000`, {
      headers: { "x-bff-secret": secret! },
    });
  } catch {
    return NextResponse.json({ message: "Error conectando al backend" }, { status: 502 });
  }

  if (!res.ok) return NextResponse.json({ message: "Error del backend" }, { status: 502 });

  const { data } = await res.json();

  const header = ["Nombre", "Teléfono", "Mensaje", "Estado", "IP", "Fecha"].join(",");
  const rows = data.map((s: {
    name: string;
    phone: string;
    message?: string;
    status: string;
    ip: string;
    createdAt: string;
  }) =>
    [
      `"${s.name.replace(/"/g, '""')}"`,
      `"${s.phone}"`,
      `"${(s.message ?? "").replace(/"/g, '""')}"`,
      s.status,
      s.ip,
      new Date(s.createdAt).toLocaleString("es-AR"),
    ].join(",")
  );

  const csv = [header, ...rows].join("\n");
  const filename = `submissions-${new Date().toISOString().split("T")[0]}.csv`;

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
