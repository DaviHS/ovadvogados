import { db } from "@/server/db"
import { userRoles, rolePermissions, userSpecialPermissions, permissions, roles } from "@/server/db/schema"
import { and, eq, inArray, or, sql } from "drizzle-orm"
import { SYSTEM_PERMISSIONS, SYSTEM_ROLES } from "@/lib/permission"

export class PermissionService {
  // Verificar se usuário tem permissão específica
  async hasPermission(userId: number, companyId: number, permission: string): Promise<boolean> {
    // 1. Buscar permissões especiais do usuário (override)
    const specialPermission = await db
      .select()
      .from(userSpecialPermissions)
      .where(
        and(
          eq(userSpecialPermissions.userId, userId),
          eq(userSpecialPermissions.companyId, companyId),
          eq(userSpecialPermissions.permissionId, 
            db.select({ id: permissions.permissionId })
             .from(permissions)
             .where(eq(permissions.name, permission))
          )
        )
      )
      .then(result => result[0])

    if (specialPermission) {
      return specialPermission.granted
    }

    // 2. Buscar permissões através das roles
    const userPermission = await db
      .select({
        granted: rolePermissions.granted,
      })
      .from(userRoles)
      .innerJoin(rolePermissions, eq(rolePermissions.roleId, userRoles.roleId))
      .innerJoin(permissions, eq(permissions.permissionId, rolePermissions.permissionId))
      .where(
        and(
          eq(userRoles.userId, userId),
          eq(userRoles.companyId, companyId),
          eq(userRoles.isActive, true),
          eq(permissions.name, permission),
          or(
            eq(userRoles.expiresAt, null),
            sql`${userRoles.expiresAt} > NOW()`
          )
        )
      )
      .then(result => result[0])

    return userPermission?.granted ?? false
  }

  // Buscar todas as permissões do usuário
  async getUserPermissions(userId: number, companyId: number): Promise<string[]> {
    const permissionsList = await db
      .select({
        name: permissions.name,
        granted: rolePermissions.granted,
      })
      .from(userRoles)
      .innerJoin(rolePermissions, eq(rolePermissions.roleId, userRoles.roleId))
      .innerJoin(permissions, eq(permissions.permissionId, rolePermissions.permissionId))
      .where(
        and(
          eq(userRoles.userId, userId),
          eq(userRoles.companyId, companyId),
          eq(userRoles.isActive, true),
          or(
            eq(userRoles.expiresAt, null),
            sql`${userRoles.expiresAt} > NOW()`
          )
        )
      )

    // Adicionar permissões especiais
    const specialPermissions = await db
      .select({
        name: permissions.name,
        granted: userSpecialPermissions.granted,
      })
      .from(userSpecialPermissions)
      .innerJoin(permissions, eq(permissions.permissionId, userSpecialPermissions.permissionId))
      .where(
        and(
          eq(userSpecialPermissions.userId, userId),
          eq(userSpecialPermissions.companyId, companyId)
        )
      )

    // Combinar e filtrar apenas permissões concedidas
    const allPermissions = [...permissionsList, ...specialPermissions]
    return allPermissions
      .filter(p => p.granted)
      .map(p => p.name)
  }

  // Verificar se usuário tem uma das roles
  async hasRole(userId: number, companyId: number, roleNames: string[]): Promise<boolean> {
    const userRole = await db
      .select()
      .from(userRoles)
      .innerJoin(roles, eq(roles.roleId, userRoles.roleId))
      .where(
        and(
          eq(userRoles.userId, userId),
          eq(userRoles.companyId, companyId),
          eq(userRoles.isActive, true),
          inArray(roles.name, roleNames),
          or(
            eq(userRoles.expiresAt, null),
            sql`${userRoles.expiresAt} > NOW()`
          )
        )
      )
      .then(result => result[0])

    return !!userRole
  }

  // Atribuir role a usuário
  async assignRole(userId: number, companyId: number, roleName: string, assignedBy: number): Promise<void> {
    const role = await db
      .select()
      .from(roles)
      .where(eq(roles.name, roleName))
      .then(result => result[0])

    if (!role) {
      throw new Error(`Role ${roleName} não encontrada`)
    }

    await db
      .insert(userRoles)
      .values({
        userId,
        companyId,
        roleId: role.roleId,
        assignedBy,
        isActive: true,
      })
      .onConflictDoUpdate({
        target: [userRoles.userId, userRoles.companyId, userRoles.roleId],
        set: {
          isActive: true,
          assignedBy,
          assignedAt: new Date(),
        }
      })
  }

  // Revogar role de usuário
  async revokeRole(userId: number, companyId: number, roleName: string): Promise<void> {
    const role = await db
      .select()
      .from(roles)
      .where(eq(roles.name, roleName))
      .then(result => result[0])

    if (!role) {
      throw new Error(`Role ${roleName} não encontrada`)
    }

    await db
      .update(userRoles)
      .set({ isActive: false })
      .where(
        and(
          eq(userRoles.userId, userId),
          eq(userRoles.companyId, companyId),
          eq(userRoles.roleId, role.roleId)
        )
      )
  }
}

export const permissionService = new PermissionService()