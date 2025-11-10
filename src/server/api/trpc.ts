import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";
import { auth } from "@/server/auth";
import { db } from "../db";
import { userRoles } from "../db/schema";
import { eq } from "drizzle-orm";
import { permissionService } from "@/server/services/permission-service";
import { SYSTEM_PERMISSIONS, SYSTEM_ROLES } from "@/lib/permissions";

export const createTRPCContext = async (opts: { headers: Headers }) => {
  const session = await auth();
  return {
    session,
    db,
    ...opts,
  };
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createTRPCRouter = t.router;

const timingMiddleware = t.middleware(async ({ next, path }) => {
  const start = Date.now();
  if (t._config.isDev) {
    const waitMs = Math.floor(Math.random() * 400) + 100;
    await new Promise((resolve) => setTimeout(resolve, waitMs));
  }
  const result = await next();
  const end = Date.now();
  console.log(`[TRPC] ${path} took ${end - start}ms to execute`);
  return result;
});

export const publicProcedure = t.procedure.use(timingMiddleware);

export const protectedProcedure = t.procedure
  .use(timingMiddleware)
  .use(({ ctx, next }) => {
    if (!ctx.session || !ctx.session.user) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    return next({
      ctx: {
        session: { ...ctx.session, user: ctx.session.user },
      },
    });
  });

const middleware = t.middleware;

export const requirePermission = (permission: string) =>
  middleware(async ({ ctx, next }) => {
    if (!ctx.session?.user?.id || !ctx.session.user.companyId) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    const hasPermission = await permissionService.hasPermission(
      ctx.session.user.id,
      ctx.session.user.companyId,
      permission
    );

    if (!hasPermission) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Você não tem permissão para executar esta ação",
      });
    }

    return next({
      ctx: {
        ...ctx,
        session: ctx.session,
      },
    });
  });

export const requireRole = (roleNames: string[]) =>
  middleware(async ({ ctx, next }) => {
    if (!ctx.session?.user?.id || !ctx.session.user.companyId) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    const hasRole = await permissionService.hasRole(
      ctx.session.user.id,
      ctx.session.user.companyId,
      roleNames
    );

    if (!hasRole) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Acesso restrito",
      });
    }

    return next({
      ctx: {
        ...ctx,
        session: ctx.session,
      },
    });
  });

export const authorizedProcedure = protectedProcedure;
export const adminProcedure = authorizedProcedure.use(
  requireRole([SYSTEM_ROLES.SUPER_ADMIN, SYSTEM_ROLES.COMPANY_ADMIN])
);
export const companyAdminProcedure = authorizedProcedure.use(
  requireRole([SYSTEM_ROLES.COMPANY_ADMIN])
);
export const canManageUsersProcedure = authorizedProcedure.use(
  requirePermission(SYSTEM_PERMISSIONS.USER_MANAGE)
);
export const canManageCompaniesProcedure = authorizedProcedure.use(
  requirePermission(SYSTEM_PERMISSIONS.COMPANY_MANAGE)
);

export const createCallerFactory = t.createCallerFactory;
