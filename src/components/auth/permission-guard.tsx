// src/components/auth/permission-guard.tsx
"use client"

import { ReactNode } from "react"
import { api } from "@/lib/api"
import { Unauthorized } from "./unauthorized"

interface PermissionGuardProps {
  permission: string
  children: ReactNode
  fallback?: ReactNode
  companyId?: number // Opcional, pega do contexto se não informado
}

export function PermissionGuard({ 
  permission, 
  children, 
  fallback = null,
  companyId 
}: PermissionGuardProps) {
  const { data: hasPermission, isLoading } = api.auth.hasPermission.useQuery(
    { permission, companyId },
    { 
      enabled: true,
      staleTime: 5 * 60 * 1000, // Cache de 5 minutos
    }
  )

  if (isLoading) {
    return <div className="animate-pulse">...</div>
  }

  return hasPermission ? <>{children}</> : <>{fallback}</>
}

// Hook para uso em componentes
export function usePermission(permission: string, companyId?: number) {
  const { data: hasPermission, isLoading } = api.auth.hasPermission.useQuery(
    { permission, companyId },
    { 
      enabled: true,
      staleTime: 5 * 60 * 1000,
    }
  )

  return {
    hasPermission: !!hasPermission,
    isLoading
  }
}

// Componente para rotas protegidas
export function ProtectedRoute({ 
  children, 
  permission,
  fallback 
}: {
  children: ReactNode
  permission: string
  fallback?: ReactNode
}) {
  const { hasPermission, isLoading } = usePermission(permission)

  if (isLoading) {
    return <div>Carregando permissões...</div>
  }

  if (!hasPermission) {
    return fallback || <Unauthorized />
  }

  return <>{children}</>
}