// "use client"

// import { useSession } from "next-auth/react"
// import { useMemo } from "react"
// import { api } from "@/trpc/react"

// export interface Permission {
//   resource: string
//   action: string
// }

// export interface UserPermissions {
//   permissions: Permission[]
//   roles: string[]
//   companies: Array<{
//     companyId: number
//     companyName: string
//     role: string
//   }>
// }

// export function usePermissions() {
//   const { data: session } = useSession()

//   const { data: userPermissions, isLoading } = api.user.getUserPermissions.useQuery(
//     { userId: Number(session?.user?.userId) || 0 },
//     {
//       enabled: !!session?.user?.userId,
//       staleTime: 5 * 60 * 1000, // 5 minutos
//     },
//   )

//   const permissions = useMemo(() => {
//     return userPermissions?.permissions || []
//   }, [userPermissions?.permissions])

//   const roles = useMemo(() => {
//     return userPermissions?.roles?.map((role) => role.name) || []
//   }, [userPermissions?.roles])

//   const companies = useMemo(() => {
//     return userPermissions?.companies || []
//   }, [userPermissions?.companies])

//   const hasPermission = (resource: string, action: string): boolean => {
//     if (isLoading) return false
//     return permissions.some((permission) => permission.resource === resource && permission.action === action)
//   }

//   const hasRole = (role: string): boolean => {
//     if (isLoading) return false
//     return roles.includes(role)
//   }

//   const hasAnyRole = (rolesToCheck: string[]): boolean => {
//     if (isLoading) return false
//     return rolesToCheck.some((role) => roles.includes(role))
//   }

//   const isAdmin = (): boolean => {
//     if (isLoading) return false
//     return hasAnyRole(["Super Administrador", "Administrador"])
//   }

//   const canAccessCompany = (companyId: number): boolean => {
//     if (isLoading) return false
//     if (isAdmin()) return true
//     return companies.some((company) => company.companyId === companyId)
//   }

//   return {
//     permissions,
//     roles,
//     companies,
//     hasPermission,
//     hasRole,
//     hasAnyRole,
//     isAdmin,
//     canAccessCompany,
//     isLoading,
//   }
// }
