export type UserWithRoles = {
  userId: number
  fullName: string
  email: string
  enrollmentNumber?: string
  createdAt?: string
  status?: number
  roles: {
    name: string
    companyName?: string
  }[]
}
