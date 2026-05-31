import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email("Email inválido").max(255),
  password: z
    .string()
    .min(8, "Mínimo 8 caracteres")
    .max(72)
    .regex(/[A-Z]/, "Debe tener al menos una mayúscula")
    .regex(/[0-9]/, "Debe tener al menos un número")
    .regex(/[^A-Za-z0-9]/, "Debe tener al menos un carácter especial"),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

export const loginSchema = z.object({
  email: z.string().email("Email inválido").max(255),
  password: z.string().min(1, "Ingresá tu contraseña").max(72),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
