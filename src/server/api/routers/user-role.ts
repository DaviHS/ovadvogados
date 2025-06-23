import { createTRPCRouter, publicProcedure } from "@/server/api/trpc"
import { userRoleSchema, userRoleDeleteSchema, userRolesBulkUpdateSchema } from "@/validators/user-role"
import { db } from "@/server/db"
import { userRoles, users, roles, companies } from "@/server/db/schema"
import { eq, and, isNull } from "drizzle-orm"
import { z } from "zod"

export const userRoleRouter = createTRPCRouter({
  getUserRoles: publicProcedure.input(z.object({ userId: z.number() })).query(async ({ input }) => {
    const userRolesList = await db
      .select({
        id: userRoles.id,
        roleId: userRoles.roleId,
        companyId: userRoles.companyId,
        role: {
          roleId: roles.roleId,
          name: roles.name,
          description: roles.description,
        },
        company: {
          companyId: companies.companyId,
          companyName: companies.companyName,
        },
      })
      .from(userRoles)
      .innerJoin(roles, eq(userRoles.roleId, roles.roleId))
      .leftJoin(companies, eq(userRoles.companyId, companies.companyId))
      .where(eq(userRoles.userId, input.userId))

    return userRolesList
  }),

  assign: publicProcedure.input(userRoleSchema).mutation(async ({ input }) => {
    const companyCondition = input.companyId != null
      ? eq(userRoles.companyId, input.companyId)
      : isNull(userRoles.companyId)

    const existing = await db
      .select()
      .from(userRoles)
      .where(
        and(
          eq(userRoles.userId, input.userId),
          eq(userRoles.roleId, input.roleId),
          companyCondition,
        ),
      )
      .limit(1)

    if (existing.length > 0) {
      throw new Error("Usuário já possui esta função")
    }

    const [userRole] = await db
      .insert(userRoles)
      .values({
        userId: input.userId,
        roleId: input.roleId,
        companyId: input.companyId ?? null,
      })
      .returning()

    return userRole
  }),

  remove: publicProcedure.input(userRoleDeleteSchema).mutation(async ({ input }) => {
    const companyCondition = input.companyId != null
      ? eq(userRoles.companyId, input.companyId)
      : isNull(userRoles.companyId)

    await db
      .delete(userRoles)
      .where(
        and(
          eq(userRoles.userId, input.userId),
          eq(userRoles.roleId, input.roleId),
          companyCondition,
        ),
      )

    return { success: true }
  }),

  bulkUpdate: publicProcedure.input(userRolesBulkUpdateSchema).mutation(async ({ input }) => {
    await db.delete(userRoles).where(eq(userRoles.userId, input.userId))

    const rolesToInsert = []

    for (const roleId of input.globalRoles) {
      rolesToInsert.push({
        userId: input.userId,
        roleId,
        companyId: null,
      })
    }

    for (const companyRole of input.companyRoles) {
      for (const roleId of companyRole.roles) {
        rolesToInsert.push({
          userId: input.userId,
          roleId,
          companyId: companyRole.companyId,
        })
      }
    }

    if (rolesToInsert.length > 0) {
      await db.insert(userRoles).values(rolesToInsert)
    }

    return { success: true }
  }),

  getUsersByRole: publicProcedure.input(z.object({ roleId: z.number() })).query(async ({ input }) => {
    const usersWithRole = await db
      .select({
        user: {
          userId: users.userId,
          fullName: users.fullName,
          email: users.email,
          status: users.status,
        },
        company: {
          companyId: companies.companyId,
          companyName: companies.companyName,
        },
      })
      .from(userRoles)
      .innerJoin(users, eq(userRoles.userId, users.userId))
      .leftJoin(companies, eq(userRoles.companyId, companies.companyId))
      .where(eq(userRoles.roleId, input.roleId))

    return usersWithRole
  }),
})
