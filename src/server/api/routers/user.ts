import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { userCompanies, users } from "@/server/db/schema";
import { userSchema } from "@/validators/user";
import { db } from "@/server/db";
import { hash } from "bcrypt-ts";

export const userRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const allUsers = await ctx.db.select().from(users);
    return allUsers;
  }),
  create: publicProcedure
    .input(userSchema)
    .mutation(async ({ input }) => {
      const { fullName, email, enrollmentNumber, password, status, companies } = input;

      const passwordHash = await hash(password, 10);
      
      const [user] = await db
        .insert(users)
        .values({
          fullName,
          email,
          enrollmentNumber,
          passwordHash: passwordHash, 
          status,
        })
        .returning();

      // await db.insert(userCompanies).values(
      //   companies.map((company) => ({
      //     userId: user!.userId,
      //     companyId: company.companyId,
      //     role: company.role,
      //   }))
      // );

      return { success: true, user };
    }),
});
