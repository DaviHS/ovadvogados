import { createTRPCRouter, publicProcedure } from "@/server/api/trpc"
import { users, userRoles, roles, companies } from "@/server/db/schema"
import { userSchema, userUpdateSchema } from "@/validators/user"
import { db } from "@/server/db"
import { hash } from "bcrypt-ts"
import { eq } from "drizzle-orm"
import { z } from "zod"

export const userRouter = createTRPCRouter({
  create: publicProcedure
    .input(userSchema)
    .mutation(async ({ input }) => {
      const passwordHash = await hash(input.password, 10)

      const inserted = await db
        .insert(users)
        .values({
          fullName: input.fullName,
          email: input.email,
          passwordHash,
          enrollmentNumber: input.enrollmentNumber,
          status: input.status ?? 1,
          passwordCreatedAt: new Date(),
          passwordUpdatedAt: new Date(),
        })
        .returning({ userId: users.userId })

      const newUser = inserted?.[0]
      if (!newUser) throw new Error("Falha ao inserir usuário")

      for (const company of input.companies) {
        for (const roleId of company.roles) {
          await db.insert(userRoles).values({
            userId: newUser.userId,
            companyId: company.companyId,
            roleId,
          })
        }
      }

      return { success: true, userId: newUser.userId }
    }),

  getAll: publicProcedure.query(async () => {
    const allUsers = await db.select().from(users)

    const usersWithDetails = await Promise.all(
      allUsers.map(async (user) => {
        const userRolesData = await db
          .select({
            companyId: userRoles.companyId,
            companyName: companies.companyName,
            roleId: userRoles.roleId,
            roleName: roles.name,
          })
          .from(userRoles)
          .leftJoin(companies, eq(userRoles.companyId, companies.companyId))
          .leftJoin(roles, eq(userRoles.roleId, roles.roleId))
          .where(eq(userRoles.userId, user.userId))

        const companiesMap = new Map<
          number,
          { companyName: string; roles: { roleId: number; roleName: string }[] }
        >()

        userRolesData.forEach((ur) => {
          const name = ur.companyName ?? ""
          if (!companiesMap.has(ur.companyId)) {
            companiesMap.set(ur.companyId, { companyName: name, roles: [] })
          }
          companiesMap.get(ur.companyId)?.roles.push({
            roleId: ur.roleId,
            roleName: ur.roleName ?? "",
          })
        })

        return {
          ...user,
          companies: Array.from(companiesMap.entries()).map(([companyId, { companyName, roles }]) => ({
            companyId,
            companyName,
            roles,
          })),
          roles: userRolesData.map((ur) => ({
            name: ur.roleName ?? "",
            companyName: ur.companyName ?? "",
          })),
        }
      })
    )

    return usersWithDetails
  }),

  getById: publicProcedure
    .input(z.object({ userId: z.number() }))
    .query(async ({ input }) => {
      const user = await db
        .select()
        .from(users)
        .where(eq(users.userId, input.userId))
        .limit(1)
        .then((res) => res[0])

      if (!user) return null

      const userRolesData = await db
        .select({
          companyId: userRoles.companyId,
          companyName: companies.companyName,
          roleId: userRoles.roleId,
          roleName: roles.name,
        })
        .from(userRoles)
        .leftJoin(companies, eq(userRoles.companyId, companies.companyId))
        .leftJoin(roles, eq(userRoles.roleId, roles.roleId))
        .where(eq(userRoles.userId, user.userId))

      const companiesMap = new Map<
        number,
        { companyName: string; roles: { roleId: number; roleName: string }[] }
      >()

      userRolesData.forEach((ur) => {
        const name = ur.companyName ?? ""
        if (!companiesMap.has(ur.companyId)) {
          companiesMap.set(ur.companyId, { companyName: name, roles: [] })
        }
        companiesMap.get(ur.companyId)?.roles.push({
          roleId: ur.roleId,
          roleName: ur.roleName ?? "",
        })
      })

      return {
        ...user,
        companies: Array.from(companiesMap.entries()).map(([companyId, { companyName, roles }]) => ({
          companyId,
          companyName,
          roles,
        })),
      }
    }),

  update: publicProcedure
    .input(userUpdateSchema)
    .mutation(async ({ input }) => {
      const updateData: Partial<{
        fullName: string
        email: string
        enrollmentNumber: string
        status: number
        passwordHash: string
        passwordUpdatedAt: Date
      }> = {}

      if (input.fullName) updateData.fullName = input.fullName
      if (input.email) updateData.email = input.email
      if (input.enrollmentNumber) updateData.enrollmentNumber = input.enrollmentNumber
      if (input.status !== undefined) updateData.status = input.status

      if (input.password) {
        updateData.passwordHash = await hash(input.password, 10)
        updateData.passwordUpdatedAt = new Date()
      }

      if (Object.keys(updateData).length > 0) {
        await db.update(users).set(updateData).where(eq(users.userId, input.userId))
      }

      if (input.companies) {
        await db.delete(userRoles).where(eq(userRoles.userId, input.userId))
        for (const company of input.companies) {
          for (const roleId of company.roles) {
            await db.insert(userRoles).values({
              userId: input.userId,
              companyId: company.companyId,
              roleId,
            })
          }
        }
      }

      return { success: true }
    }),

  delete: publicProcedure
    .input(z.object({ userId: z.number() }))
    .mutation(async ({ input }) => {
      await db.delete(userRoles).where(eq(userRoles.userId, input.userId))
      await db.delete(users).where(eq(users.userId, input.userId))

      return { success: true }
    }),
})
