import { createTRPCRouter, publicProcedure } from "@/server/api/trpc"
import { companySchema } from "@/validators/company"
import { db } from "@/server/db"
import { companies } from "@/server/db/schema"

export const companyRouter = createTRPCRouter({
  list: publicProcedure.query(async () => {
    const allCompanies = await db.select().from(companies).orderBy(companies.createdAt)
    return allCompanies
  }),
  create: publicProcedure
    .input(companySchema)
    .mutation(async ({ input }) => {
      const result = await db.insert(companies).values({
        companyName: input.companyName,
        cnpj: input.cnpj,
        email: input.email,
        phone: input.phone,
        address: input.address,
        city: input.city,
        state: input.state,
        zipCode: input.zipCode,
        status: input.status ?? 1,
        companyType: input.companyType,
      }).returning()

      return result[0]
    }),
})
