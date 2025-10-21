import { createTRPCRouter, publicProcedure } from "@/server/api/trpc"
import { permissionSchema, permissionUpdateSchema, permissionDeleteSchema } from "@/validators/permission"
import { db } from "@/server/db"
import { permissions, rolePermissions } from "@/server/db/schema"
import { eq } from "drizzle-orm"
import { z } from "zod"

export const permissionRouter = createTRPCRouter({
  list: publicProcedure.query(async () => {
    return await db.select().from(permissions).orderBy(permissions.resource, permissions.action)
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

    if (!permission) throw new Error("Permissão não encontrada para atualização")

    return permission
  }),

  delete: publicProcedure.input(permissionDeleteSchema).mutation(async ({ input }) => {
    await db.delete(rolePermissions).where(eq(rolePermissions.permissionId, input.permissionId))

    const deleted = await db.delete(permissions).where(eq(permissions.permissionId, input.permissionId)).returning()

    if (!deleted.length) throw new Error("Permissão não encontrada para exclusão")

    return { success: true }
  }),

  getByResource: publicProcedure.input(z.object({ resource: z.string() })).query(async ({ input }) => {
    return await db
      .select()
      .from(permissions)
      .where(eq(permissions.resource, input.resource))
      .orderBy(permissions.action)
  }),
})
