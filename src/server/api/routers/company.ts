import { createTRPCRouter, publicProcedure } from "@/server/api/trpc"
import { companySchema, companyUpdateSchema } from "@/validators/company"
import { db } from "@/server/db"
import { companies, roles, userRoles, users } from "@/server/db/schema"
import { eq, InferModel, sql } from "drizzle-orm"
import { z } from "zod"

type UserRoleWithRelations = InferModel<typeof userRoles> & {
  user: InferModel<typeof users>,
  role: InferModel<typeof roles>,
}

export const companyRouter = createTRPCRouter({
  create: publicProcedure
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

    if (!created) throw new Error("Erro ao criar a empresa")

    return created
  }),

  list: publicProcedure.query(async () => {
    const companiesWithUserCount = await db
      .select({
        companyId: companies.companyId,
        companyName: companies.companyName,
        cnpj: companies.cnpj,
        email: companies.email,
        city: companies.city,
        state: companies.state,
        phone: companies.phone,
        status: companies.status,
        createdAt: companies.createdAt,
        updatedAt: companies.updatedAt,
        userCount: sql<number>`(
          SELECT COUNT(*)
          FROM user_roles ur
          WHERE ur.company_id = companies.company_id
        )`,
      })
      .from(companies)
      .where(eq(companies.status, 1))
      .orderBy(companies.createdAt)

    return companiesWithUserCount
  }),


  getById: publicProcedure
  .input(z.object({ companyId: z.number() }))
  .query(async ({ input }) => {
    const company = await db.query.companies.findFirst({
      where: eq(companies.companyId, input.companyId),
    });

    if (!company) throw new Error("Empresa não encontrada");

    // Aliases for schemas
    const u = users;
    const r = roles;
    const ur = userRoles;

    const userRolesResult = await db
      .select({
        id: ur.id,
        userId: ur.userId,
        companyId: ur.companyId,
        roleId: ur.roleId,
        createdAt: ur.createdAt,
        user: {
          userId: u.userId,
          fullName: u.fullName,
          email: u.email,
          enrollmentNumber: u.enrollmentNumber,
          status: u.status,
        },
        role: {
          roleId: r.roleId,
          name: r.name,
        },
      })
      .from(ur)
      .innerJoin(u, eq(u.userId, ur.userId))
      .innerJoin(r, eq(r.roleId, ur.roleId))
      .where(eq(ur.companyId, input.companyId));

    // Map to group roles by user
    const usersMap = new Map<
      number,
      {
        userId: number;
        fullName: string;
        email: string;
        enrollmentNumber: string | null;
        status: number | null;
        roles: { roleId: number; name: string }[];
      }
    >();

    for (const ur of userRolesResult) {
      const userId = ur.user.userId;
      const existing = usersMap.get(userId);
      const role = { roleId: ur.role.roleId, name: ur.role.name };

      if (existing) {
        existing.roles.push(role);
      } else {
        usersMap.set(userId, {
          userId,
          fullName: ur.user.fullName,
          email: ur.user.email,
          enrollmentNumber: ur.user.enrollmentNumber,
          status: ur.user.status,
          roles: [role],
        });
      }
    }

    const userList = Array.from(usersMap.values());

    return {
      ...company,
      users: userList,
    };
  }),

  update: publicProcedure
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

      if (!updated) throw new Error("Empresa não encontrada ou erro na atualização")

      return updated
    }),

  softDelete: publicProcedure
    .input(z.object({ companyId: z.number() }))
    .mutation(async ({ input }) => {
      const [updated] = await db
        .update(companies)
        .set({
          status: 0,
          updatedAt: new Date(),
        })
        .where(eq(companies.companyId, input.companyId))
        .returning()

      if (!updated) throw new Error("Empresa não encontrada ou já desativada")

      return { success: true }
    }),

  delete: publicProcedure
    .input(z.object({ companyId: z.number() }))
    .mutation(async ({ input }) => {
      const [deleted] = await db
        .delete(companies)
        .where(eq(companies.companyId, input.companyId))
        .returning()

      if (!deleted) throw new Error("Empresa não encontrada")

      return { success: true }
    }),
})
