import { z } from "zod"

export const roleSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(100, "Nome muito longo"),
  description: z.string().optional(),
  permissions: z
    .array(z.number().int().positive("ID de permissão inválido"))
    .min(1, "Selecione pelo menos uma permissão"),
})

export const roleUpdateSchema = z.object({
  roleId: z.number().int().positive(),
  name: z.string().min(1, "Nome é obrigatório").max(100, "Nome muito longo"),
  description: z.string().optional(),
  permissions: z
    .array(z.number().int().positive("ID de permissão inválido"))
    .optional()
    .default([]), // No update, permissões podem ser removidas
})

export const roleDeleteSchema = z.object({
  roleId: z.number().int().positive(),
})

export type RoleInput = z.infer<typeof roleSchema>
export type RoleUpdateInput = z.infer<typeof roleUpdateSchema>
export type RoleDeleteInput = z.infer<typeof roleDeleteSchema>
