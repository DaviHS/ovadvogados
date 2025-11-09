// src/app/app/admin/companies/page.tsx
"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Edit, Eye, Building, Users, MapPin, Phone, Mail, MoreVertical } from "lucide-react"
import Link from "next/link"
import { usePageInfo } from "@/hooks/use-page-info"
import { api } from "@/lib/api"
import { LoadingState } from "@/components/ui/loading-state"
import { ErrorDisplay } from "@/components/ui/error-display"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function AdminCompaniesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [page, setPage] = useState(1)
  const limit = 10

  const { data: companiesData, isLoading, error } = api.admin.company.list.useQuery({
    page,
    limit,
    search: searchTerm,
  })

  const toggleStatusMutation = api.admin.company.toggleStatus.useMutation()
  const utils = api.useUtils()

  usePageInfo({
    title: "Gerenciar Empresas",
    breadcrumbs: [
      { label: "RampSync", href: "/app" },
      { label: "Admin", href: "/app/admin" },
      { label: "Empresas" }
    ]
  })

  const handleToggleStatus = async (companyId: number, currentStatus: number) => {
    try {
      await toggleStatusMutation.mutateAsync({
        companyId,
        status: currentStatus === 1 ? 0 : 1
      })
      utils.admin.company.list.invalidate()
    } catch (error) {
      console.error("Erro ao alterar status:", error)
    }
  }

  if (isLoading) return <LoadingState message="Carregando empresas..." />
  if (error) return <ErrorDisplay message={`Erro ao carregar empresas: ${error.message}`} />

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Empresas</h1>
            <p className="text-gray-600 mt-2">Gerencie todas as empresas cadastradas no sistema</p>
          </div>
          <Link href="/app/admin/companies/new">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Nova Empresa
            </Button>
          </Link>
        </div>

        {/* Busca */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar por nome, CNPJ ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900">{companiesData?.total || 0}</p>
                  <p className="text-sm font-medium text-gray-600">Total de Empresas</p>
                </div>
                <Building className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {companiesData?.items?.filter(c => c.status === 1).length || 0}
                  </p>
                  <p className="text-sm font-medium text-gray-600">Ativas</p>
                </div>
                <Badge className="bg-green-100 text-green-800">Ativo</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {companiesData?.items?.filter(c => c.status === 0).length || 0}
                  </p>
                  <p className="text-sm font-medium text-gray-600">Inativas</p>
                </div>
                <Badge variant="secondary">Inativo</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {companiesData?.items?.reduce((acc, company) => acc + (company.userCount || 0), 0) || 0}
                  </p>
                  <p className="text-sm font-medium text-gray-600">Usuários Totais</p>
                </div>
                <Users className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Empresas */}
        <div className="grid grid-cols-1 gap-6 mb-8">
          {companiesData?.items?.map((company) => (
            <Card key={company.companyId} className="hover:shadow-lg transition-all duration-200">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap mb-3">
                      <div className="flex items-center gap-2">
                        <Building className="h-5 w-5 text-gray-400" />
                        <h3 className="text-lg font-semibold break-words">
                          {company.companyName}
                        </h3>
                      </div>
                      <Badge variant={company.status === 1 ? "default" : "secondary"}>
                        {company.status === 1 ? "Ativa" : "Inativa"}
                      </Badge>
                      {company.companyType && (
                        <Badge variant="outline" className="capitalize">
                          {company.companyType}
                        </Badge>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                      {company.cnpj && (
                        <div className="space-y-1">
                          <p className="font-medium text-gray-900">CNPJ</p>
                          <p>{company.cnpj}</p>
                        </div>
                      )}
                      {company.email && (
                        <div className="space-y-1">
                          <p className="font-medium text-gray-900">Email</p>
                          <p className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {company.email}
                          </p>
                        </div>
                      )}
                      {(company.city || company.state) && (
                        <div className="space-y-1">
                          <p className="font-medium text-gray-900">Localização</p>
                          <p className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {[company.city, company.state].filter(Boolean).join(", ")}
                          </p>
                        </div>
                      )}
                      <div className="space-y-1">
                        <p className="font-medium text-gray-900">Usuários</p>
                        <p className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {company.userCount || 0} usuário(s)
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <span>📅</span>
                        <span>Criada em {new Date(company.createdAt!).toLocaleDateString('pt-BR')}</span>
                      </div>
                      {company.phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          <span>{company.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4 sm:mt-0 sm:ml-4">
                    <Link href={`/app/admin/companies/${company.companyId}`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href={`/app/admin/companies/${company.companyId}/edit`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-gray-600 hover:text-gray-700 hover:bg-gray-50 border-gray-200"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleToggleStatus(company.companyId, company.status!)}
                        >
                          {company.status === 1 ? "Desativar" : "Ativar"} Empresa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Paginação */}
        {companiesData && companiesData.totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <Button
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Anterior
            </Button>
            
            <span className="text-sm text-gray-600">
              Página {page} de {companiesData.totalPages}
            </span>
            
            <Button
              variant="outline"
              disabled={page === companiesData.totalPages}
              onClick={() => setPage(page + 1)}
            >
              Próxima
            </Button>
          </div>
        )}

        {companiesData?.items?.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Building className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {searchTerm ? "Nenhuma empresa encontrada" : "Nenhuma empresa cadastrada"}
              </h3>
              <p className="text-gray-500 mb-6">
                {searchTerm
                  ? "Tente ajustar os termos de busca."
                  : "Comece cadastrando a primeira empresa."
                }
              </p>
              <Link href="/app/admin/companies/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Cadastrar Empresa
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}