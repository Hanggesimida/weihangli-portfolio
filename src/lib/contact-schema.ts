import { z } from "zod";

export const CONTACT_LIMITS = { name: 100, email: 254, message: 5000 } as const;

export const contactSchema = z.object({
  name: z.string().trim().min(1).max(CONTACT_LIMITS.name),
  email: z.string().trim().pipe(z.email().max(CONTACT_LIMITS.email)),
  message: z.string().trim().min(1).max(CONTACT_LIMITS.message),
  website: z.string().optional(),
});

export type ContactInput = z.input<typeof contactSchema>;
