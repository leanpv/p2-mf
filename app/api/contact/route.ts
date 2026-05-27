import { NextRequest, NextResponse } from "next/server";
import { contactSchema } from "@/features/contact/contact.schema";
import { rateLimit } from "@/lib/rate-limit";

const TELEGRAM_API = "https://api.telegram.org";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const rl = rateLimit(`contact:${ip}`, 5, 10 * 60 * 1000);

  if (!rl.allowed) {
    return NextResponse.json(
      { message: "Demasiados intentos. Esperá unos minutos." },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil((rl.resetAt - Date.now()) / 1000)),
          "X-RateLimit-Limit": "5",
          "X-RateLimit-Remaining": "0",
        },
      }
    );
  }

  let body: unknown;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Request inválido" }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Datos inválidos", errors: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const { name, phone, message } = parsed.data;

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.error("Faltan variables de entorno de Telegram");
    return NextResponse.json({ message: "Error de configuración" }, { status: 500 });
  }

  const text = [
    `📬 *Nueva consulta — Propiedades CBA*`,
    ``,
    `👤 *Nombre:* ${name}`,
    `📞 *Teléfono:* ${phone}`,
    message ? `💬 *Mensaje:* ${message}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  const telegramRes = await fetch(
    `${TELEGRAM_API}/bot${token}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: "Markdown" }),
    }
  );

  if (!telegramRes.ok) {
    console.error("Error Telegram:", await telegramRes.text());
    return NextResponse.json({ message: "Error al enviar el mensaje" }, { status: 502 });
  }

  return NextResponse.json({ message: "Mensaje enviado" }, { status: 200 });
}
