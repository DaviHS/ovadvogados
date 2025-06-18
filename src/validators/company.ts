import { z } from "zod"

export const companySchema = z.object({
  companyName: z.string().min(1, "Nome é obrigatório"),
  cnpj: z.string().min(14),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().length(2, "Estado inválido"),
  zipCode: z.string().optional(),
  companyType: z.string().optional(),
  status: z.number().optional().default(1),
})

export type CompanySchema = z.infer<typeof companySchema>
