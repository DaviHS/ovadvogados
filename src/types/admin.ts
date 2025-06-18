export interface Company {
  companyId: number
  companyName: string
  cnpj: string | null
  email: string | null
  phone: string | null
  city: string | null
  state: string | null
  companyType: string | null
  status: number | null
  createdAt: string | null
  usersCount: number | 0
}
