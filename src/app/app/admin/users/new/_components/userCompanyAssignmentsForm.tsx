"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

interface Role {
  roleId: number
  name: string
}

interface CompanyAssignment {
  companyId: number
  companyName: string
  roles: number[]
  assigned: boolean
}

interface UserCompanyAssignmentsFormProps {
  companyAssignments: CompanyAssignment[]
  setCompanyAssignments: React.Dispatch<React.SetStateAction<CompanyAssignment[]>>
  roles: Role[]
  isAdminRole: boolean
}

export default function UserCompanyAssignmentsForm({
  companyAssignments,
  setCompanyAssignments,
  roles,
  isAdminRole,
}: UserCompanyAssignmentsFormProps) {
  function handleCompanyAssignment(companyId: number, assigned: boolean) {
    setCompanyAssignments((prev) =>
      prev.map((c) =>
        c.companyId === companyId ? { ...c, assigned } : c
      )
    )
  }

  function handleCompanyRoleToggle(companyId: number, roleId: number) {
    setCompanyAssignments((prev) =>
      prev.map((company) => {
        if (company.companyId !== companyId) return company

        const roleExists = company.roles.includes(roleId)
        const updatedRoles = roleExists
          ? company.roles.filter((id) => id !== roleId)
          : [...company.roles, roleId]

        return { ...company, roles: updatedRoles }
      })
    )
  }

  if (isAdminRole) {
    return (
      <div className="border rounded p-4">
        <legend className="font-semibold text-lg mb-2">Empresas atribuídas</legend>
        <p className="text-sm text-muted-foreground">
          Usuários com a função de administrador têm acesso a todas as empresas.
        </p>
      </div>
    )
  }

  return (
    <fieldset className="border rounded p-4 space-y-4">
      <legend className="font-semibold text-lg">Empresas atribuídas</legend>

      {companyAssignments.map((company) => (
        <div key={company.companyId} className="space-y-2 border p-2 rounded-md">
          <div className="flex items-center space-x-2">
            <Checkbox
              id={`company-${company.companyId}`}
              checked={company.assigned}
              onCheckedChange={(checked) =>
                handleCompanyAssignment(company.companyId, Boolean(checked))
              }
            />
            <Label htmlFor={`company-${company.companyId}`}>
              {company.companyName}
            </Label>
          </div>

          {company.assigned && (
            <div className="ml-6 space-y-1">
              {roles.map((role) => (
                <div key={role.roleId} className="flex items-center space-x-2">
                  <Checkbox
                    id={`company-${company.companyId}-role-${role.roleId}`}
                    checked={company.roles.includes(role.roleId)}
                    onCheckedChange={() =>
                      handleCompanyRoleToggle(company.companyId, role.roleId)
                    }
                  />
                  <Label htmlFor={`company-${company.companyId}-role-${role.roleId}`}>
                    {role.name}
                  </Label>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </fieldset>
  )
}
