// src/app/app/admin/companies/[companyId]/page.tsx
"use client"

import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, Building, Mail, Phone, MapPin, Users, Calendar, Shield } from "lucide-react"
import Link from "next/link"
import { usePageInfo } from "@/hooks/use-page-info"
import { api } from "@/lib/api"
import { LoadingState } from "@/components/ui/loading-state"
import { ErrorDisplay } from "@/components/ui/error-display"

export default function CompanyDetailPage() {
  const params = useParams()
  const companyId = Number(params.companyId)

  const { data: company, isLoading, error } = api.admin.company.getById.useQuery({ companyId })

  usePageInfo({
    title: company ? `Empresa - ${company.companyName}` : "Carregando...",
    breadcrumbs: [
      { label: "RampSync", href: "/app" },
      { label: "Admin", href: "/app/admin" },
      { label: "Empresas", href: "/app/admin/companies" },
      { label: company?.companyName || "Detalhes" }
    ]
  })

  if (isLoading) return <LoadingState message="Carregando empresa..." />
  if (error) return <ErrorDisplay message={`Erro ao carregar empresa: ${error.message}`} />
  if (!company) return <ErrorDisplay message="Empresa não encontrada" />

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link href="/app/admin/companies">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <Building className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold">{company.companyName}</h1>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={company.status === 1 ? "default" : "secondary"}>
                    {company.status === 1 ? "Ativa" : "Inativa"}
                  </Badge>
                  {company.companyType && (
                    <Badge variant="outline" className="capitalize">
                      {company.companyType}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
          <Link href={`/app/admin/companies/${companyId}/edit`}>
            <Button>
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Informações da Empresa */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Informações da Empresa</CardTitle>
                <CardDescription>Dados cadastrais e informações de contato</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Dados Cadastrais
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between py-2 border-b">
                          <span className="text-sm font-medium">Nome:</span>
                          <span className="text-sm text-gray-600">{company.companyName}</span>
                        </div>
                        {company.cnpj && (
                          <div className="flex items-center justify-between py-2 border-b">
                            <span className="text-sm font-medium">CNPJ:</span>
                            <span className="text-sm text-gray-600">{company.cnpj}</span>
                          </div>
                        )}
                        {company.companyType && (
                          <div className="flex items-center justify-between py-2 border-b">
                            <span className="text-sm font-medium">Tipo:</span>
                            <span className="text-sm text-gray-600 capitalize">{company.companyType}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Contato
                      </h3>
                      <div className="space-y-3">
                        {company.email && (
                          <div className="flex items-center justify-between py-2 border-b">
                            <span className="text-sm font-medium">Email:</span>
                            <span className="text-sm text-gray-600">{company.email}</span>
                          </div>
                        )}
                        {company.phone && (
                          <div className="flex items-center justify-between py-2 border-b">
                            <span className="text-sm font-medium">Telefone:</span>
                            <span className="text-sm text-gray-600">{company.phone}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Localização
                      </h3>
                      <div className="space-y-3">
                        {company.address && (
                          <div className="py-2 border-b">
                            <span className="text-sm font-medium block mb-1">Endereço:</span>
                            <span className="text-sm text-gray-600">{company.address}</span>
                          </div>
                        )}
                        {(company.city || company.state) && (
                          <div className="flex items-center justify-between py-2 border-b">
                            <span className="text-sm font-medium">Cidade/UF:</span>
                            <span className="text-sm text-gray-600">
                              {[company.city, company.state].filter(Boolean).join(" - ")}
                            </span>
                          </div>
                        )}
                        {company.zipCode && (
                          <div className="flex items-center justify-between py-2 border-b">
                            <span className="text-sm font-medium">CEP:</span>
                            <span className="text-sm text-gray-600">{company.zipCode}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Datas
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between py-2 border-b">
                          <span className="text-sm font-medium">Criada em:</span>
                          <span className="text-sm text-gray-600">
                            {new Date(company.createdAt!).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                        {company.updatedAt && (
                          <div className="flex items-center justify-between py-2 border-b">
                            <span className="text-sm font-medium">Atualizada em:</span>
                            <span className="text-sm text-gray-600">
                              {new Date(company.updatedAt).toLocaleDateString('pt-BR')}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Usuários Vinculados */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Usuários Vinculados
                </CardTitle>
                <CardDescription>Usuários associados a esta empresa</CardDescription>
              </CardHeader>
              <CardContent>
                {company.users && company.users.length > 0 ? (
                  <div className="space-y-3">
                    {company.users.map((userRole) => (
                      <div key={userRole.user.userId} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-medium text-sm">{userRole.user.fullName}</p>
                            <p className="text-xs text-gray-600 mt-1">{userRole.user.email}</p>
                            <div className="flex gap-1 mt-2">
                              <Badge variant="outline" className="text-xs">
                                {userRole.role.name}
                              </Badge>
                              <Badge 
                                variant={userRole.user.status === 1 ? "default" : "secondary"} 
                                className="text-xs"
                              >
                                {userRole.user.status === 1 ? "Ativo" : "Inativo"}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 text-sm">Nenhum usuário vinculado</p>
                    <Button variant="outline" size="sm" className="mt-3">
                      Vincular Usuário
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}