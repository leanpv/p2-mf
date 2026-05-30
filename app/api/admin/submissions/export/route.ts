import { NextResponse } from "next/server";
import { verifySession } from "@/lib/admin/session";

export async function GET() {
  const session = await verifySession();
  if (!session) return NextResponse.json({ message: "No autorizado" }, { status: 401 });

  const backendUrl = process.env.NESTJS_API_URL;
  const secret = process.env.BFF_TO_BACKEND_SECRET;

  // Paginar para traer todos los submissions respetando el @Max(100) del backend
  const allData: {
    name: string;
    phone: string;
    message?: string;
    status: string;
    ip?: string;
    createdAt: string;
  }[] = [];

  let page = 1;
  const limit = 100;

  while (true) {
    let res: Response;
    try {
      res = await fetch(`${backendUrl}/api/contact/submissions?page=${page}&limit=${limit}`, {
        headers: { "x-bff-secret": secret! },
      });
    } catch {
      return NextResponse.json({ message: "Error conectando al backend" }, { status: 502 });
    }

    if (!res.ok) return NextResponse.json({ message: "Error del backend" }, { status: 502 });

    const { data, total } = await res.json();
    allData.push(...data);

    if (allData.length >= total) break;
    page++;
  }

  const header = ["Nombre", "Teléfono", "Mensaje", "Estado", "IP", "Fecha"].join(",");
  const rows = allData.map((s) =>
    [
      `"${s.name.replace(/"/g, '""')}"`,
      `"${s.phone}"`,
      `"${(s.message ?? "").replace(/"/g, '""')}"`,
      s.status,
      s.ip ?? "",
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
