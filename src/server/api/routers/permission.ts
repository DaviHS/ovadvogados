import { createTRPCRouter, publicProcedure } from "@/server/api/trpc"
import { permissionSchema, permissionUpdateSchema, permissionDeleteSchema } from "@/validators/permission"
import { db } from "@/server/db"
import { permissions, rolePermissions } from "@/server/db/schema"
import { eq } from "drizzle-orm"
import { z } from "zod"

export const permissionRouter = createTRPCRouter({
  list: publicProcedure.query(async () => {
    const allPermissions = await db.select().from(permissions).orderBy(permissions.resource, permissions.action)
    return allPermissions
  }),

  create: publicProcedure.input(permissionSchema).mutation(async ({ input }) => {
    const [permission] = await db
      .insert(permissions)
      .values({
        name: input.name,
        description: input.description,
        resource: input.resource,
        action: input.action,
      })
      .returning()

    return permission
  }),

  update: publicProcedure.input(permissionUpdateSchema).mutation(async ({ input }) => {
    const [permission] = await db
      .update(permissions)
      .set({
        name: input.name,
        description: input.description,
        resource: input.resource,
        action: input.action,
        updatedAt: new Date(),
      })
      .where(eq(permissions.permissionId, input.permissionId))
      .returning()

    return permission
  }),

  delete: publicProcedure.input(permissionDeleteSchema).mutation(async ({ input }) => {
    // Primeiro, remove todas as associações com roles
    await db.delete(rolePermissions).where(eq(rolePermissions.permissionId, input.permissionId))

    // Depois remove a permissão
    await db.delete(permissions).where(eq(permissions.permissionId, input.permissionId))

    return { success: true }
  }),

  getByResource: publicProcedure.input(z.object({ resource: z.string() })).query(async ({ input }) => {
    const resourcePermissions = await db
      .select()
      .from(permissions)
      .where(eq(permissions.resource, input.resource))
      .orderBy(permissions.action)

    return resourcePermissions
  }),
})
