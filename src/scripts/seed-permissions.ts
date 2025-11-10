// src/scripts/seed-permissions.ts
import { db } from "@/server/db"
import { roles, permissions, rolePermissions } from "@/server/db/schema"
import { SYSTEM_PERMISSIONS, SYSTEM_ROLES, ROLE_PERMISSIONS_MAP } from "@/lib/permissions"

export async function seedPermissions() {
  console.log('🌱 Iniciando seed de permissões...')

  // Criar permissões
  const permissionEntries = Object.entries(SYSTEM_PERMISSIONS)
  for (const [key, permissionName] of permissionEntries) {
    const [resource, action] = permissionName.split('.')
    
    await db
      .insert(permissions)
      .values({
        resource,
        action,
        name: permissionName,
        description: `Permissão para ${action} ${resource}`,
        category: 'system',
      })
      .onConflictDoNothing()
  }

  // Criar roles do sistema
  for (const [roleName, rolePermissionsList] of Object.entries(ROLE_PERMISSIONS_MAP)) {
    const [role] = await db
      .insert(roles)
      .values({
        name: roleName,
        description: `Role de ${roleName.replace('_', ' ')}`,
        isSystemRole: true,
      })
      .returning()
      .onConflictDoUpdate({
        target: roles.name,
        set: {
          description: `Role de ${roleName.replace('_', ' ')}`,
          isSystemRole: true,
        }
      })

    // Associar permissões à role
    for (const permissionName of rolePermissionsList) {
      const permission = await db
        .select()
        .from(permissions)
        .where(eq(permissions.name, permissionName))
        .then(result => result[0])

      if (permission) {
        await db
          .insert(rolePermissions)
          .values({
            roleId: role.roleId,
            permissionId: permission.permissionId,
            granted: true,
          })
          .onConflictDoNothing()
      }
    }
  }

  console.log('✅ Seed de permissões concluído!')
}