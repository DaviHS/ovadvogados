import "dotenv/config";
import { db } from "@/server/db"
import { permissions, roles, rolePermissions } from "@/server/db/schema"


const initialPermissions = [
  // Usuários
  {
    name: "Visualizar Usuários",
    description: "Permite visualizar lista de usuários",
    resource: "users",
    action: "read",
  },
  { name: "Criar Usuários", description: "Permite criar novos usuários", resource: "users", action: "create" },
  { name: "Editar Usuários", description: "Permite editar usuários existentes", resource: "users", action: "update" },
  { name: "Excluir Usuários", description: "Permite excluir usuários", resource: "users", action: "delete" },

  // Empresas
  {
    name: "Visualizar Empresas",
    description: "Permite visualizar lista de empresas",
    resource: "companies",
    action: "read",
  },
  { name: "Criar Empresas", description: "Permite criar novas empresas", resource: "companies", action: "create" },
  {
    name: "Editar Empresas",
    description: "Permite editar empresas existentes",
    resource: "companies",
    action: "update",
  },
  { name: "Excluir Empresas", description: "Permite excluir empresas", resource: "companies", action: "delete" },

  // Walkarounds
  {
    name: "Visualizar Walkarounds",
    description: "Permite visualizar walkarounds",
    resource: "walkarounds",
    action: "read",
  },
  { name: "Criar Walkarounds", description: "Permite criar walkarounds", resource: "walkarounds", action: "create" },
  { name: "Editar Walkarounds", description: "Permite editar walkarounds", resource: "walkarounds", action: "update" },
  {
    name: "Excluir Walkarounds",
    description: "Permite excluir walkarounds",
    resource: "walkarounds",
    action: "delete",
  },

  // Relatórios
  { name: "Visualizar Relatórios", description: "Permite visualizar relatórios", resource: "reports", action: "read" },
  { name: "Gerar Relatórios", description: "Permite gerar relatórios", resource: "reports", action: "create" },

  // Configurações
  {
    name: "Configurações do Sistema",
    description: "Permite alterar configurações",
    resource: "settings",
    action: "update",
  },
]

const initialRoles = [
  {
    name: "Super Administrador",
    description: "Acesso total ao sistema",
    permissions: [
      "users:read",
      "users:create",
      "users:update",
      "users:delete",
      "companies:read",
      "companies:create",
      "companies:update",
      "companies:delete",
      "walkarounds:read",
      "walkarounds:create",
      "walkarounds:update",
      "walkarounds:delete",
      "reports:read",
      "reports:create",
      "settings:update",
    ],
  },
  {
    name: "Administrador",
    description: "Acesso administrativo limitado",
    permissions: [
      "users:read",
      "users:create",
      "users:update",
      "companies:read",
      "companies:update",
      "walkarounds:read",
      "reports:read",
    ],
  },
  {
    name: "Supervisor",
    description: "Supervisão de operações",
    permissions: ["walkarounds:read", "walkarounds:create", "walkarounds:update", "reports:read"],
  },
  {
    name: "Operador",
    description: "Operações básicas",
    permissions: ["walkarounds:read", "walkarounds:create", "walkarounds:update"],
  },
  {
    name: "Visualizador",
    description: "Apenas visualização",
    permissions: ["walkarounds:read", "reports:read"],
  },
]

export async function seedPermissions() {
  console.log("🌱 Inserindo permissões...")

  // Inserir permissões
  const insertedPermissions = await db.insert(permissions).values(initialPermissions).returning()
  console.log(`✅ ${insertedPermissions.length} permissões inseridas`)

  // Inserir roles
  const insertedRoles = await db
    .insert(roles)
    .values(
      initialRoles.map((role) => ({
        name: role.name,
        description: role.description,
      })),
    )
    .returning()
  console.log(`✅ ${insertedRoles.length} funções inseridas`)

  // Associar permissões às roles
  for (const role of initialRoles) {
    const dbRole = insertedRoles.find((r) => r.name === role.name)
    if (!dbRole) continue

    const rolePermissionsList = []
    for (const permissionKey of role.permissions) {
      const [resource, action] = permissionKey.split(":")
      const permission = insertedPermissions.find((p) => p.resource === resource && p.action === action)
      if (permission) {
        rolePermissionsList.push({
          roleId: dbRole.roleId,
          permissionId: permission.permissionId,
        })
      }
    }

    if (rolePermissionsList.length > 0) {
      await db.insert(rolePermissions).values(rolePermissionsList)
    }
  }

  console.log("✅ Associações role-permissão criadas")
  console.log("🎉 Seed de permissões concluído!")
}
if (import.meta.url === `file://${process.argv[1]}`) {
  seedPermissions().catch((err) => {
    console.error("❌ Erro ao rodar seed:", err);
    process.exit(1);
  });
}

