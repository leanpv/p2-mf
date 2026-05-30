import { z } from "zod";

const serverEnvSchema = z.object({
  NESTJS_API_URL: z.string().url(),
  BFF_TO_BACKEND_SECRET: z.string().min(32),
  TELEGRAM_BOT_TOKEN: z.string().min(1),
  TELEGRAM_CHAT_ID: z.string().min(1),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  AUTH_GOOGLE_ID: z.string().min(1),
  AUTH_GOOGLE_SECRET: z.string().min(1),
  AUTH_JWT_SECRET: z.string().min(32),
  ADMIN_EMAILS: z.string().min(1),
  APP_URL: z.string().url(),
});

const parsed = serverEnvSchema.safeParse(process.env);

if (!parsed.success) {
  console.error(
    "Variables de entorno inválidas o faltantes:\n",
    parsed.error.flatten().fieldErrors
  );
  process.exit(1);
}

export const env = parsed.data;
