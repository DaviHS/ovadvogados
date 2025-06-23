"use client"

import React from "react"
import { Badge } from "@/components/ui/badge"

interface Permission {
  resource: string
  action: string
}

interface Role {
  roleId: number
  name: string
  permissions: Permission[]
}

interface CompanyAssignment {
  companyId: number
  companyName: string
  roles: number[]
  assigned: boolean
}

interface UserPermissionsPreviewProps {
  roles: Role[]
  globalRoles: number[]
  companyAssignments: CompanyAssignment[]
  isAdminRole: boolean
}

export function UserPermissionsPreview({
  roles,
  globalRoles,
  companyAssignments,
  isAdminRole,
}: UserPermissionsPreviewProps) {
  // Funções selecionadas (globais + por empresa)
  const getSelectedRoles = () => {
    const allRoles = [...globalRoles]
    companyAssignments.forEach((company) => {
      if (company.assigned) {
        allRoles.push(...company.roles)
      }
    })
    return Array.from(new Set(allRoles))
  }

  // Permissões agregadas e sem duplicatas
  const getAllPermissions = () => {
    const selectedRoleIds = getSelectedRoles()
    const allPermissions: Permission[] = []

    selectedRoleIds.forEach((roleId) => {
      const role = roles.find((r) => r.roleId === roleId)
      if (role) {
        allPermissions.push(...role.permissions)
      }
    })

    // Remove duplicatas
    const uniquePermissions = allPermissions.filter(
      (permission, index, self) =>
        index === self.findIndex((p) => p.resource === permission.resource && p.action === permission.action),
    )

    return uniquePermissions
  }

  const selectedRoles = getSelectedRoles()
  const permissions = getAllPermissions()

  return (
    <div className="space-y-6">
      <section>
        <h3 className="font-medium mb-3">Funções Selecionadas</h3>
        <div className="flex flex-wrap gap-2">
          {selectedRoles.length > 0 ? (
            selectedRoles.map((roleId) => {
              const role = roles.find((r) => r.roleId === roleId)
              return role ? (
                <Badge key={roleId} variant="secondary">
                  {role.name}
                </Badge>
              ) : null
            })
          ) : (
            <p className="text-sm text-gray-500">Nenhuma função selecionada</p>
          )}
        </div>
      </section>

      <section>
        <h3 className="font-medium mb-3">Permissões Resultantes</h3>
        {permissions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {permissions.map((permission, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span className="text-sm capitalize">{permission.resource}</span>
                <Badge variant="outline" className="text-xs">
                  {permission.action}
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">Nenhuma permissão atribuída</p>
        )}
      </section>

      <section>
        <h3 className="font-medium mb-3">Empresas com Acesso</h3>
        <div className="space-y-2">
          {isAdminRole && (
            <div className="p-2 bg-blue-50 rounded border-l-4 border-blue-400">
              <p className="text-sm font-medium text-blue-800">Acesso a todas as empresas (Administrador)</p>
            </div>
          )}
          {!isAdminRole &&
            companyAssignments
              .filter((c) => c.assigned)
              .map((company) => (
                <div key={company.companyId} className="p-2 bg-gray-50 rounded">
                  <p className="text-sm font-medium">{company.companyName}</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {company.roles.map((roleId) => {
                      const role = roles.find((r) => r.roleId === roleId)
                      return role ? (
                        <Badge key={roleId} variant="outline" className="text-xs">
                          {role.name}
                        </Badge>
                      ) : null
                    })}
                  </div>
                </div>
              ))}
          {!isAdminRole && companyAssignments.filter((c) => c.assigned).length === 0 && (
            <p className="text-sm text-gray-500">Nenhuma empresa selecionada</p>
          )}
        </div>
      </section>
    </div>
  )
}
