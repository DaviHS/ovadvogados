import { z } from "zod"

export const userSchema = z.object({
  fullName: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Email inválido"),
  enrollmentNumber: z.string().min(1, "Matrícula é obrigatória"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  status: z.number().default(1),
  companies: z
    .array(
      z.object({
        companyId: z.number(),
        roles: z.array(z.number()),
      }),
    )
    .default([]),
})

export const userUpdateSchema = z.object({
  userId: z.number(),
  fullName: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Email inválido"),
  enrollmentNumber: z.string().min(1, "Matrícula é obrigatória"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  status: z.number().default(1),
  companies: z
    .array(
      z.object({
        companyId: z.number(),
        roles: z.array(z.number()),
      }),
    )
    .default([]),
})

export type UserInput = z.infer<typeof userSchema>
export type UserUpdateInput = z.infer<typeof userUpdateSchema>
