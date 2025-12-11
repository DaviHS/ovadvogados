// src/app/app/admin/companies/[companyId]/page.tsx
"use client"

import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit, Users, Building, Mail, Phone, MapPin, Calendar, Shield } from "lucide-react"
import Link from "next/link"
import { usePageInfo } from "@/hooks/use-page-info"
import { api } from "@/lib/api"
import { PermissionGuard, usePermission } from "@/components/auth/permission-guard"
import { SYSTEM_PERMISSIONS } from "@/lib/permissions"
import { Unauthorized } from "@/components/auth/unauthorized"
import { Badge } from "@/components/ui/badge"
import { LoadingState } from "@/components/ui/loading-state"
import { CompanyInfoCard } from "../_components/company-info-card"
// import { BillingCard } from "../_components/billing-card"
import { UsersCard } from "../_components/users-card"

export default function CompanyDetailPage() {
  const params = useParams()
  const companyId = Number(params.companyId)
  
  const { hasPermission: canRead, isLoading: permissionLoading } = usePermission(SYSTEM_PERMISSIONS.COMPANY_READ)
  const { hasPermission: canUpdate } = usePermission(SYSTEM_PERMISSIONS.COMPANY_UPDATE)
  
  const { data: company, isLoading } = api.admin.company.getById.useQuery(
    { companyId },
    { enabled: canRead }
  )

  usePageInfo({
    title: company ? `Empresa - ${company.companyName}` : "Carregando...",
    breadcrumbs: [
      { label: "RampSync", href: "/app" },
      { label: "Admin", href: "/app/admin" },
      { label: "Empresas", href: "/app/admin/companies" },
      { label: company?.companyName || "Detalhes" }
    ]
  })

  if (permissionLoading || isLoading) {
    return <LoadingState message="Carregando empresa..." />
  }

  if (!canRead) {
    return <Unauthorized 
      title="Acesso Negado"
      message="Você não tem permissão para visualizar esta empresa"
      requiredPermission={SYSTEM_PERMISSIONS.COMPANY_READ}
    />
  }

  if (!company) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="p-8 text-center">
            <Building className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Empresa não encontrada</h3>
            <p className="text-gray-500 mb-4">A empresa solicitada não existe ou foi removida.</p>
            <Link href="/app/admin/companies">
              <Button>Voltar para Empresas</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <Building className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold">{company.companyName}</h1>
              <p className="text-gray-600">Detalhes da empresa</p>
            </div>
          </div>
          
          <PermissionGuard permission={SYSTEM_PERMISSIONS.COMPANY_UPDATE}>
            <Link href={`/app/admin/companies/${companyId}/edit`}>
              <Button>
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Button>
            </Link>
          </PermissionGuard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <CompanyInfoCard company={company} />
          </div>

          <div className="space-y-6">
            <PermissionGuard permission={SYSTEM_PERMISSIONS.USER_READ}>
              <UsersCard companyId={companyId} />
            </PermissionGuard>

            {/* <PermissionGuard permission={SYSTEM_PERMISSIONS.BILLING_READ}>
              <BillingCard companyId={companyId} />
            </PermissionGuard> */}
          </div>
        </div>
      </div>
    </div>
  )
}