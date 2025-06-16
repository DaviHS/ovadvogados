import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { users } from "@/db/schema";

export const userRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const allUsers = await ctx.db.select().from(users);
    return allUsers;
  }),
});
