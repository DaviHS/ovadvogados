import { createTRPCRouter, publicProcedure } from "@/server/api/trpc"
import { userCompanies, users, userRoles, roles, companies, permissions, rolePermissions } from "@/server/db/schema"
import { userSchema, userUpdateSchema } from "@/validators/user"
import { db } from "@/server/db"
import { hash } from "bcrypt-ts"
import { and, eq } from "drizzle-orm"
import { z } from "zod"

export const userRouter = createTRPCRouter({
  list: publicProcedure.query(async ({ ctx }) => {
    const allUsers = await ctx.db.select().from(users).orderBy(users.fullName)
    return allUsers
  }),

  listWithRoles: publicProcedure.query(async () => {
    const usersWithRoles = await db
      .select({
        user: users,
        role: {
          roleId: roles.roleId,
          name: roles.name,
        },
        company: {
          companyId: companies.companyId,
          companyName: companies.companyName,
        },
      })
      .from(users)
      .leftJoin(userRoles, eq(users.userId, userRoles.userId))
      .leftJoin(roles, eq(userRoles.roleId, roles.roleId))
      .leftJoin(companies, eq(userRoles.companyId, companies.companyId))
      .orderBy(users.fullName)

    const groupedUsers = usersWithRoles.reduce((acc, row) => {
      const existingUser = acc.find((u) => u.userId === row.user.userId)

      if (row.role?.roleId) {
        const roleEntry = {
          roleId: row.role.roleId,
          name: row.role.name,
          companyId: row.company?.companyId || null,
          companyName: row.company?.companyName || null,
        }

        if (existingUser) {
          existingUser.roles.push(roleEntry)
        } else {
          acc.push({
            ...row.user,
            roles: [roleEntry],
          })
        }
      } else if (!existingUser) {
        acc.push({
          ...row.user,
          roles: [],
        })
      }

      return acc
    }, [] as Array<typeof users.$inferSelect & { roles: Array<{ roleId: number, name: string, companyId: number | null, companyName: string | null }> }>)

    return groupedUsers
  }),

  getById: publicProcedure.input(z.object({ userId: z.number() })).query(async ({ input }) => {
    const user = await db.select().from(users).where(eq(users.userId, input.userId)).limit(1)
    const userData = user[0]

    if (!userData) {
      throw new Error("Usuário não encontrado")
    }

    const userRolesList = await db
      .select({
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

    return {
      ...userData,
      roles: userRolesList,
    }
  }),

  getUserPermissions: publicProcedure.input(z.object({ userId: z.number() })).query(async ({ input }) => {
    const userPermissions = await db
      .select({
        permission: permissions,
        role: {
          roleId: roles.roleId,
          name: roles.name,
        },
        company: {
          companyId: companies.companyId,
          companyName: companies.companyName,
        },
      })
      .from(userRoles)
      .innerJoin(roles, eq(userRoles.roleId, roles.roleId))
      .innerJoin(rolePermissions, eq(roles.roleId, rolePermissions.roleId))
      .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.permissionId))
      .leftJoin(companies, eq(userRoles.companyId, companies.companyId))
      .where(eq(userRoles.userId, input.userId))

    const uniquePermissions = userPermissions.filter(
      (permission, index, self) =>
        index === self.findIndex((p) => p.permission.permissionId === permission.permission.permissionId),
    )

    return {
      permissions: uniquePermissions.map((up) => up.permission),
      roles: userPermissions.map((up) => ({
        ...up.role,
        companyId: up.company?.companyId || null,
        companyName: up.company?.companyName || null,
      })),
      companies: userPermissions
        .filter((up) => up.company?.companyId)
        .map((up) => ({
          companyId: up.company!.companyId,
          companyName: up.company!.companyName,
        }))
        .filter((company, index, self) => index === self.findIndex((c) => c.companyId === company.companyId)),
    }
  }),

  create: publicProcedure.input(userSchema).mutation(async ({ input }) => {
    const { fullName, email, enrollmentNumber, password, status, globalRoles, companies } = input
    const passwordHash = await hash(password, 10)

    const [user] = await db
      .insert(users)
      .values({
        fullName,
        email,
        enrollmentNumber,
        passwordHash,
        status,
      })
      .returning()

    const userId = user!.userId

    // const userRoleInserts = [
    //   ...globalRoles.map((roleId) => ({
    //     userId,
    //     roleId,
    //     companyId: null,
    //   })),
    //   ...companies.flatMap((c) =>
    //     c.roles.map((roleId) => ({
    //       userId,
    //       roleId,
    //       companyId: c.companyId,
    //     })),
    //   ),
    // ]

    // if (userRoleInserts.length > 0) {
    //   await db.insert(userRoles).values(userRoleInserts)
    // }

    return { success: true, user }
  }),

  update: publicProcedure.input(userUpdateSchema).mutation(async ({ input }) => {
    const { userId, fullName, email, enrollmentNumber, status, globalRoles, companies } = input

    const [user] = await db
      .update(users)
      .set({
        fullName,
        email,
        enrollmentNumber,
        status,
        updatedAt: new Date(),
      })
      .where(eq(users.userId, userId))
      .returning()

    await db.delete(userRoles).where(eq(userRoles.userId, userId))

    const userRoleInserts = [
      ...globalRoles.map((roleId) => ({
        userId,
        roleId,
        companyId: null,
      })),
      ...companies.flatMap((c) =>
        c.roles.map((roleId) => ({
          userId,
          roleId,
          companyId: c.companyId,
        })),
      ),
    ]

    if (userRoleInserts.length > 0) {
      await db.insert(userRoles).values(userRoleInserts)
    }

    return { success: true, user }
  }),

  delete: publicProcedure.input(z.object({ userId: z.number() })).mutation(async ({ input }) => {
    await db.delete(userRoles).where(eq(userRoles.userId, input.userId))
    await db.delete(userCompanies).where(eq(userCompanies.userId, input.userId))
    await db.delete(users).where(eq(users.userId, input.userId))

    return { success: true }
  }),
})
