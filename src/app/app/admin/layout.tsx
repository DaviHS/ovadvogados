"use client"

import type React from "react"

import { PermissionGuard } from "@/components/auth/permission-guard"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <PermissionGuard
      roles={["super_admin", "admin"]}
      fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Acesso Restrito</h2>
            <p className="text-gray-600">Você precisa de permissões de administrador para acessar esta área.</p>
          </div>
        </div>
      }
    >
      {children}
    </PermissionGuard>
  )
}
