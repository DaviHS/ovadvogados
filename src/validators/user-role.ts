import { z } from "zod"

export const userRoleSchema = z.object({
  userId: z.number(),
  roleId: z.number(),
  companyId: z.number().optional(), // null para roles globais
})

export const userRoleDeleteSchema = z.object({
  userId: z.number(),
  roleId: z.number(),
  companyId: z.number().optional(),
})

export const userRolesBulkUpdateSchema = z.object({
  userId: z.number(),
  globalRoles: z.array(z.number()).default([]),
  companyRoles: z
    .array(
      z.object({
        companyId: z.number(),
        roles: z.array(z.number()),
      }),
    )
    .default([]),
})

export type UserRoleInput = z.infer<typeof userRoleSchema>
export type UserRoleDeleteInput = z.infer<typeof userRoleDeleteSchema>
export type UserRolesBulkUpdateInput = z.infer<typeof userRolesBulkUpdateSchema>
