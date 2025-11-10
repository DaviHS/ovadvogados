"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Save, Loader2 } from "lucide-react"
import { usePageInfo } from "@/hooks/use-page-info"
import { api } from "@/lib/api"
import { PermissionGuard, usePermission } from "@/components/auth/permission-guard"
import { SYSTEM_PERMISSIONS } from "@/lib/permissions"
import { Unauthorized } from "@/components/auth/unauthorized"

export default function NewCompanyPage() {
  const router = useRouter()
  const { hasPermission, isLoading: permissionLoading } = usePermission(SYSTEM_PERMISSIONS.COMPANY_UPDATE)
  const createMutation = api.admin.company.create.useMutation()

  usePageInfo({
    title: "Nova Empresa",
    breadcrumbs: [
      { label: "RampSync", href: "/app" },
      { label: "Admin", href: "/app/admin" },
      { label: "Empresas", href: "/app/admin/companies" },
      { label: "Nova" }
    ]
  })

  if (permissionLoading) {
    return <div>Carregando...</div>
  }

  if (!hasPermission) {
    return <Unauthorized 
      title="Acesso Negado"
      message="Você não tem permissão para criar empresas"
      requiredPermission={SYSTEM_PERMISSIONS.COMPANY_UPDATE}
    />
  }

  const handleSubmit = async (formData: any) => {
    try {
      await createMutation.mutateAsync(formData)
      router.push("/app/admin/companies")
    } catch (error) {
      console.error("Erro ao criar empresa:", error)
    }
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Nova Empresa</h1>
        
        <CompanyForm 
          onSubmit={handleSubmit} 
          isLoading={createMutation.isPending}
        />
      </div>
    </div>
  )
}