export type Permission = {
  resource: string
  action: string
}

export type Role = {
  roleId: number
  name: string
  description: string
  permissions: Permission[]
}

export type Company = {
  companyId: number
  companyName: string
  cnpj: string
}

export type CompanyAssignment = {
  companyId: number
  companyName: string
  roles: number[]
  assigned: boolean
}


export interface RoleWithPermissions {
  roleId: number
  name: string
  description?: string | null
  permissions: {
    permissionId: number
    name: string
    description?: string | null
  }[]
}
