import { z } from "zod"

export const userRoleSchema = z.object({
  userId: z.number(),
  roleId: z.number(),
  companyId: z.number(),
})

export const userRoleDeleteSchema = z.object({
  userId: z.number(),
  roleId: z.number(),
  companyId: z.number(),
})

export const userRolesBulkUpdateSchema = z.object({
  userId: z.number(),
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
