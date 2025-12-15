import { z } from "zod";

export const LoginInput = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const AdminUpsertInput = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export type LoginInputT = z.infer<typeof LoginInput>;
export type AdminUpsertInputT = z.infer<typeof AdminUpsertInput>;