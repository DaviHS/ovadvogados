import { createTRPCRouter, protectedProcedure, adminProcedure } from "@/server/api/trpc"
import { companySchema, companyUpdateSchema } from "@/validators/company"
import { db } from "@/server/db"
import { companies, roles, userRoles, users } from "@/server/db/schema"
import { eq, sql, and, desc } from "drizzle-orm"
import { z } from "zod"

export const companyRouter = createTRPCRouter({
  list: protectedProcedure
    .input(z.object({
      page: z.number().default(1),
      limit: z.number().default(10),
      search: z.string().optional(),
    }))
    .query(async ({ input }) => {
      const { page, limit, search } = input
      const offset = (page - 1) * limit

      let whereConditions = []
      
      if (search) {
        whereConditions.push(
          sql`(${companies.companyName} ilike ${`%${search}%`} OR 
               ${companies.cnpj} ilike ${`%${search}%`} OR 
               ${companies.email} ilike ${`%${search}%`})`
        )
      }

      const whereClause = whereConditions.length > 0 
        ? and(...whereConditions)
        : undefined

      const companiesList = await db
        .select({
          companyId: companies.companyId,
          companyName: companies.companyName,
          cnpj: companies.cnpj,
          email: companies.email,
          phone: companies.phone,
          city: companies.city,
          state: companies.state,
          status: companies.status,
          companyType: companies.companyType,
          createdAt: companies.createdAt,
          updatedAt: companies.updatedAt,
          userCount: sql<number>`(
            SELECT COUNT(*) 
            FROM ${userRoles} 
            WHERE ${userRoles.companyId} = ${companies.companyId}
          )`,
        })
        .from(companies)
        .where(whereClause)
        .orderBy(desc(companies.createdAt))
        .limit(limit)
        .offset(offset)

      const countResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(companies)
        .where(whereClause)

      const total = Number(countResult[0]?.count) || 0

      return {
        items: companiesList,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      }
    }),

  getById: adminProcedure
    .input(z.object({ companyId: z.number() }))
    .query(async ({ input }) => {
      const company = await db.query.companies.findFirst({
        where: eq(companies.companyId, input.companyId),
      })

      if (!company) {
        throw new Error("Empresa não encontrada")
      }

      // Buscar usuários vinculados
      const companyUsers = await db
        .select({
          user: {
            userId: users.userId,
            fullName: users.fullName,
            email: users.email,
            status: users.status,
          },
          role: {
            roleId: roles.roleId,
            name: roles.name,
          },
        })
        .from(userRoles)
        .innerJoin(users, eq(users.userId, userRoles.userId))
        .innerJoin(roles, eq(roles.roleId, userRoles.roleId))
        .where(eq(userRoles.companyId, input.companyId))

      return {
        ...company,
        users: companyUsers,
      }
    }),

  create: adminProcedure
    .input(companySchema)
    .mutation(async ({ input }) => {
      const now = new Date()

      const [created] = await db
        .insert(companies)
        .values({
          ...input,
          status: input.status ?? 1,
          createdAt: now,
          updatedAt: now,
        })
        .returning()

      if (!created) {
        throw new Error("Erro ao criar a empresa")
      }

      return created
    }),

  update: adminProcedure
    .input(companyUpdateSchema)
    .mutation(async ({ input }) => {
      const { companyId, ...data } = input

      const [updated] = await db
        .update(companies)
        .set({
          ...data,
          updatedAt: new Date(),
        })
        .where(eq(companies.companyId, companyId))
        .returning()

      if (!updated) {
        throw new Error("Empresa não encontrada ou erro na atualização")
      }

      return updated
    }),

  toggleStatus: adminProcedure
    .input(z.object({ 
      companyId: z.number(),
      status: z.number().min(0).max(1)
    }))
    .mutation(async ({ input }) => {
      const [updated] = await db
        .update(companies)
        .set({
          status: input.status,
          updatedAt: new Date(),
        })
        .where(eq(companies.companyId, input.companyId))
        .returning()

      if (!updated) {
        throw new Error("Empresa não encontrada")
      }

      return updated
    }),
})