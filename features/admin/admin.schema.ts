import { z } from "zod";

export const submissionSchema = z.object({
  _id: z.string(),
  name: z.string(),
  phone: z.string(),
  message: z.string().optional(),
  status: z.enum(["pending", "contacted"]).default("pending"),
  ip: z.string().optional(),
  createdAt: z.string(),
});

export type Submission = z.infer<typeof submissionSchema>;

export const submissionsResponseSchema = z.object({
  data: z.array(submissionSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
});

export type SubmissionsResponse = z.infer<typeof submissionsResponseSchema>;
