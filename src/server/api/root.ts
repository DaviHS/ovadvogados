import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { userRouter } from './routers/user';
import { companyRouter } from "./routers/company";
import { authRouter } from "./routers/auth";
import { roleRouter } from "./routers/role";
import { permissionRouter } from "./routers/permission";
import { userRoleRouter } from "./routers/user-role";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  auth: authRouter,
  company: companyRouter,
  user: userRouter,
  role: roleRouter,
  permission: permissionRouter,
  userRole: userRoleRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
