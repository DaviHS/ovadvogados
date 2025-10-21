import { z } from "zod"
import { isValid as isValidCNPJ } from "@fnando/cnpj"

export const companySchema = z.object({
  companyName: z.string().min(1, "Nome é obrigatório"),
  cnpj: z
    .string()
    .min(14, "CNPJ deve ter no mínimo 14 caracteres")
    .refine((val) => isValidCNPJ(val), { message: "CNPJ inválido" }),
  email: z.string().email("Email inválido").optional(),
  phone: z.string().regex(/^\d+$/, "Telefone deve conter apenas números").optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z
    .string()
    .length(2, "Estado inválido")
    .transform((val) => val.toUpperCase()),
  zipCode: z.string().regex(/^\d{5}-?\d{3}$/, "CEP inválido").optional(),
  companyType: z.string().optional(),
  status: z.number().optional().default(1),
})

export const companyUpdateSchema = companySchema.extend({
  companyId: z.number(),
})

export type CompanySchema = z.infer<typeof companySchema>

export type CompanyUpdateSchema = z.infer<typeof companyUpdateSchema>
