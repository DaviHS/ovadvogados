import { createTRPCRouter, publicProcedure } from "@/server/api/trpc"
import { roleSchema, roleUpdateSchema, roleDeleteSchema } from "@/validators/role"
import { db } from "@/server/db"
import { roles, rolePermissions, userRoles, permissions } from "@/server/db/schema"
import { eq, sql } from "drizzle-orm"
import { z } from "zod"

export const roleRouter = createTRPCRouter({
  list: publicProcedure.query(async () => {
    return await db.select().from(roles).orderBy(roles.name)
  }),

  listWithPermissions: publicProcedure.query(async () => {
    const rolesWithPermissions = await db
      .select({
        roleId: roles.roleId,
        name: roles.name,
        description: roles.description,
        createdAt: roles.createdAt,
        updatedAt: roles.updatedAt,
        permissionId: permissions.permissionId,
        permissionName: permissions.name,
        permissionDescription: permissions.description,
        // adicione outros campos de permission que precisar
      })
      .from(roles)
      .innerJoin(rolePermissions, eq(roles.roleId, rolePermissions.roleId))
      .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.permissionId))
      .orderBy(roles.name)

    const groupedRoles = rolesWithPermissions.reduce((acc, row) => {
      let existingRole = acc.find((r) => r.roleId === row.roleId)

      if (existingRole) {
        existingRole.permissions.push({
          permissionId: row.permissionId,
          name: row.permissionName,
          description: row.permissionDescription,
        })
      } else {
        acc.push({
          roleId: row.roleId,
          name: row.name,
          description: row.description,
          createdAt: row.createdAt,
          updatedAt: row.updatedAt,
          permissions: [
            {
              permissionId: row.permissionId,
              name: row.permissionName,
              description: row.permissionDescription,
            },
          ],
        })
      }

      return acc
    }, [] as any[])


    return groupedRoles
  }),

  getById: publicProcedure.input(z.object({ roleId: z.number().int().positive() })).query(async ({ input }) => {
    const role = await db.select().from(roles).where(eq(roles.roleId, input.roleId)).limit(1)

    if (!role[0]) throw new Error("Role não encontrada")

    const rolePermissionsList = await db
      .select({ permission: permissions })
      .from(rolePermissions)
      .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.permissionId))
      .where(eq(rolePermissions.roleId, input.roleId))

    return {
      ...role[0],
      permissions: rolePermissionsList.map((rp) => rp.permission),
    }
  }),

  create: publicProcedure.input(roleSchema).mutation(async ({ input }) => {
    const [role] = await db
      .insert(roles)
      .values({
        name: input.name,
        description: input.description,
      })
      .returning()

    if (!role) throw new Error("Erro ao criar role")

    const validPermissions = input.permissions.filter((id) => id != null)

    if (validPermissions.length > 0) {
      await db.insert(rolePermissions).values(
        validPermissions.map((permissionId) => ({
          roleId: role.roleId,
          permissionId,
        })),
      )
    }

    return role
  }),

  update: publicProcedure.input(roleUpdateSchema).mutation(async ({ input }) => {
    const [role] = await db
      .update(roles)
      .set({
        name: input.name,
        description: input.description,
        updatedAt: new Date(),
      })
      .where(eq(roles.roleId, input.roleId))
      .returning()

    if (!role) throw new Error("Role não encontrada ou erro na atualização")

    // Atualiza permissões somente se passado no input
    if (input.permissions) {
      await db.delete(rolePermissions).where(eq(rolePermissions.roleId, input.roleId))

      const validPermissions = input.permissions.filter((id) => id != null)

      if (validPermissions.length > 0) {
        await db.insert(rolePermissions).values(
          validPermissions.map((permissionId) => ({
            roleId: input.roleId,
            permissionId,
          })),
        )
      }
    }

    return role
  }),

  delete: publicProcedure.input(roleDeleteSchema).mutation(async ({ input }) => {
    const usersWithRole = await db.select().from(userRoles).where(eq(userRoles.roleId, input.roleId)).limit(1)

    if (usersWithRole.length > 0) {
      throw new Error("Não é possível excluir uma função que possui usuários associados")
    }

    await db.delete(rolePermissions).where(eq(rolePermissions.roleId, input.roleId))
    const deleted = await db.delete(roles).where(eq(roles.roleId, input.roleId)).returning()

    if (!deleted.length) throw new Error("Role não encontrada para exclusão")

    return { success: true }
  }),

  getUserCount: publicProcedure.input(z.object({ roleId: z.number().int().positive() })).query(async ({ input }) => {
    const count = await db
      .select({ count: sql<number>`count(*)` })
      .from(userRoles)
      .where(eq(userRoles.roleId, input.roleId))

    return count[0]?.count || 0
  }),
})
