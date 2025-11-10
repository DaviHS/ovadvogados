// src/app/app/admin/companies/page.tsx
"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { usePageInfo } from "@/hooks/use-page-info"
import { api } from "@/lib/api"
import { PermissionGuard } from "@/components/auth/permission-guard"
import { SYSTEM_PERMISSIONS } from "@/lib/permissions"

export default function CompaniesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  
  // Busca condicional baseada na permissão
  const { data: companiesData, isLoading } = api.admin.company.list.useQuery(
    { page: 1, limit: 10, search: searchTerm },
    { 
      enabled: true, // Sempre habilita, mas o backend filtra
    }
  )

  usePageInfo({
    title: "Empresas",
    breadcrumbs: [
      { label: "RampSync", href: "/app" },
      { label: "Admin", href: "/app/admin" },
      { label: "Empresas" }
    ]
  })

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header com verificação de permissão */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Empresas</h1>
            <p className="text-gray-600">Gerencie as empresas do sistema</p>
          </div>
          
          <PermissionGuard permission={SYSTEM_PERMISSIONS.COMPANY_UPDATE}>
            <Link href="/app/admin/companies/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nova Empresa
              </Button>
            </Link>
          </PermissionGuard>
        </div>

        {/* Conteúdo da página */}
        <div className="space-y-6">
          {/* Busca sempre visível para quem pode ler */}
          <PermissionGuard permission={SYSTEM_PERMISSIONS.COMPANY_READ}>
            <Card>
              <CardContent className="p-4">
                <input
                  placeholder="Buscar empresas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </CardContent>
            </Card>
          </PermissionGuard>

          {/* Lista de empresas */}
          <PermissionGuard 
            permission={SYSTEM_PERMISSIONS.COMPANY_READ}
            fallback={
              <Card>
                <CardContent className="p-8 text-center">
                  <p>Você não tem permissão para visualizar empresas</p>
                </CardContent>
              </Card>
            }
          >
            {companiesData?.items?.map(company => (
              <CompanyCard key={company.companyId} company={company} />
            ))}
          </PermissionGuard>
        </div>
      </div>
    </div>
  )
}

// Componente individual da empresa com ações condicionais
function CompanyCard({ company }: { company: any }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-semibold">{company.companyName}</h3>
            <p className="text-sm text-gray-600">{company.email}</p>
          </div>
          
          <div className="flex gap-2">
            {/* Visualizar - disponível para quem pode ler */}
            <PermissionGuard permission={SYSTEM_PERMISSIONS.COMPANY_READ}>
              <Link href={`/app/admin/companies/${company.companyId}`}>
                <Button variant="outline" size="sm">
                  Ver
                </Button>
              </Link>
            </PermissionGuard>

            {/* Editar - apenas para quem pode atualizar */}
            <PermissionGuard permission={SYSTEM_PERMISSIONS.COMPANY_UPDATE}>
              <Link href={`/app/admin/companies/${company.companyId}/edit`}>
                <Button variant="outline" size="sm">
                  Editar
                </Button>
              </Link>
            </PermissionGuard>

            <PermissionGuard permission={SYSTEM_PERMISSIONS.COMPANY_MANAGE}>
              <Button variant="destructive" size="sm">
                Excluir
              </Button>
            </PermissionGuard>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}