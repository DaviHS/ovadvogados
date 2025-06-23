"use client"

import React from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RoleWithPermissions } from "@/types/permissions" // ou o tipo correto que você tiver

interface UserRolesFormProps {
  roles: RoleWithPermissions[] // ou `Role[]` se for mais simples
  globalRoles: number[]
  setGlobalRoles: React.Dispatch<React.SetStateAction<number[]>>
}

export default function UserRolesForm({ roles, globalRoles, setGlobalRoles }: UserRolesFormProps) {
  function toggleRole(roleId: number) {
    if (globalRoles.includes(roleId)) {
      setGlobalRoles((prev) => prev.filter((id) => id !== roleId))
    } else {
      setGlobalRoles((prev) => [...prev, roleId])
    }
  }

  return (
    <fieldset className="border rounded p-4 space-y-4">
      <legend className="font-semibold text-lg">Funções Globais</legend>

      <div className="flex flex-col space-y-2">
        {roles.map((role) => (
          <div key={role.roleId} className="flex items-center space-x-2">
            <Checkbox
              id={`role-${role.roleId}`}
              checked={globalRoles.includes(role.roleId)}
              onCheckedChange={() => toggleRole(role.roleId)}
            />
            <Label htmlFor={`role-${role.roleId}`}>{role.name}</Label>
          </div>
        ))}
      </div>
    </fieldset>
  )
}
