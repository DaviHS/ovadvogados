import { z } from "zod"

export const companySchema = z.object({
  companyName: z.string().min(1, "Nome da empresa é obrigatório"),
  cnpj: z.string().min(14, "CNPJ deve ter 14 caracteres").max(18).optional(),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().min(2, "UF deve ter 2 caracteres").max(2).optional(),
  zipCode: z.string().optional(),
  companyType: z.string().optional(),
  status: z.number().int().min(0).max(1).default(1),
})

export const companyUpdateSchema = companySchema.extend({
  companyId: z.number(),
})

export type CompanyData = z.infer<typeof companySchema>
export type CompanyUpdateData = z.infer<typeof companyUpdateSchema>