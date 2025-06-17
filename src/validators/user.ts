import { z } from "zod";

export const userSchema = z.object({
  fullName: z.string().min(1),
  email: z.string().email(),
  enrollmentNumber: z.string().min(1),
  password: z.string().min(6),
  status: z.number(),
  companies: z.array(
    z.object({
      companyId: z.number(),
      role: z.string(),
    })
  )
});

export type SignInSchema = z.infer<typeof userSchema>;
