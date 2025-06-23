"use client"

import type React from "react"
import { usePermissions } from "@/hooks/use-permissions"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"

interface PermissionGuardProps {
  children: React.ReactNode
  resource?: string
  action?: string
  roles?: string[]
  fallback?: React.ReactNode
  requireAll?: boolean // Se true, precisa de TODAS as permissões. Se false, precisa de pelo menos uma
}

export function PermissionGuard({
  children,
  resource,
  action,
  roles = [],
  fallback,
  requireAll = false,
}: PermissionGuardProps) {
  const { hasPermission, hasAnyRole, hasRole } = usePermissions()

  const hasRequiredPermission = resource && action ? hasPermission(resource, action) : true
  const hasRequiredRole = roles.length > 0 ? (requireAll ? roles.every(hasRole) : hasAnyRole(roles)) : true

  const hasAccess = requireAll ? hasRequiredPermission && hasRequiredRole : hasRequiredPermission || hasRequiredRole

  if (!hasAccess) {
    return (
      fallback || (
        <Alert variant="destructive" className="m-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>Você não tem permissão para acessar este recurso.</AlertDescription>
        </Alert>
      )
    )
  }

  return <>{children}</>
}
