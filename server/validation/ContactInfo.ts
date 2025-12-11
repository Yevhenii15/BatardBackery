import { z } from "zod";

export const ContactInfoInput = z.object({
  email: z.string().email(),
  phone: z.string().min(8),
  openingHours: z.string().optional().default(""),
  address: z.string().min(5),
  logoLight: z.string().optional().default(""),
  logoDark: z.string().optional().default(""),
  cvr: z.string().min(8),
});

export type ContactInfoInputT = z.infer<typeof ContactInfoInput>;
