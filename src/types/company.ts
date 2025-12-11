export interface Company {
  companyId: number
  companyName: string
  cnpj?: string | null
  email?: string | null
  phone?: string | null
  address?: string | null
  city?: string | null
  state?: string | null
  zipCode?: string | null
  status?: number | null
  companyType?: string | null
  createdAt?: string | Date | null
  updatedAt?: string | Date | null
  users?: Array<{
    user: {
      userId: number
      fullName: string
      email: string
      status: number | null
    }
    role: {
      roleId: number
      name: string
    }
  }>
}