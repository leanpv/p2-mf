import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  phone: z.string().min(8, "El teléfono debe tener al menos 8 dígitos"),
  message: z.string().max(500, "El mensaje no puede superar 500 caracteres").optional(),
});

export type ContactFormData = z.infer<typeof contactSchema>;
