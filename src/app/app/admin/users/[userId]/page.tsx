"use client"

import { use, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, Shield, Building2, User, Calendar, Mail, Hash } from "lucide-react"
import Link from "next/link"
import { api } from "@/trpc/react"
import { usePageInfo } from "@/hooks/use-page-info"
import { getNumberStatusColor, getStatusText } from "@/lib"

interface Props {
  params: Promise<{ userId: string }>
}

export default function UserDetailsPage({ params }: Props) {
  const { userId } = use(params)
  const userIdNum = Number.parseInt(userId)

  const { data: user, isLoading } = api.user.getById.useQuery({ userId: userIdNum }, { enabled: !isNaN(userIdNum) })

  const { data: userPermissions } = api.user.getUserPermissions.useQuery(
    { userId: userIdNum },
    { enabled: !isNaN(userIdNum) },
  )

  const breadcrumbs = useMemo(
    () => [
      { label: "RampSync", href: "/app" },
      { label: "Usuários", href: "/admin/users" },
      { label: user?.fullName || "Carregando..." },
    ],
    [user?.fullName],
  )

  usePageInfo({
    title: user?.fullName || "Detalhes do Usuário",
    breadcrumbs,
  })

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-40 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Usuário não encontrado</h2>
            <p className="text-gray-600 mb-4">O usuário solicitado não existe ou foi removido.</p>
            <Link href="/admin/users">
              <Button>Voltar para Usuários</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const globalRoles = user.roles.filter((role) => !role.companyId)
  const companyRoles = user.roles.filter((role) => role.companyId)

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">{user.fullName}</h1>
            <p className="text-gray-600">Detalhes do usuário</p>
          </div>
          <Link href={`/admin/users/${user.userId}/edit`}>
            <Button>
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Informações Básicas */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Informações Básicas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-gray-500" />
                <div>
                  <label className="text-sm font-medium text-gray-500">Nome Completo</label>
                  <p className="text-lg">{user.fullName}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-gray-500" />
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="text-lg break-words">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Hash className="h-4 w-4 text-gray-500" />
                <div>
                  <label className="text-sm font-medium text-gray-500">Matrícula</label>
                  <p className="text-lg">{user.enrollmentNumber || "Não informado"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-4 w-4" />
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <div className="mt-1">
                    <Badge className={getNumberStatusColor(user.status)}>{getStatusText(user.status)}</Badge>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-gray-500" />
                <div>
                  <label className="text-sm font-medium text-gray-500">Criado em</label>
                  <p className="text-lg">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString("pt-BR") : "Não informado"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Funções e Permissões */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Funções e Permissões
              </CardTitle>
              <CardDescription>Funções atribuídas e permissões resultantes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Funções Globais */}
              <div>
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Funções Globais
                </h3>
                <div className="flex flex-wrap gap-2">
                  {globalRoles.map((role) => (
                    <Badge key={`global-${role.roleId}`} variant="default">
                      {role.role.name}
                    </Badge>
                  ))}
                  {globalRoles.length === 0 && <p className="text-sm text-gray-500">Nenhuma função global atribuída</p>}
                </div>
              </div>

              {/* Funções por Empresa */}
              <div>
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Funções por Empresa
                </h3>
                <div className="space-y-3">
                  {companyRoles.length > 0 ? (
                    Object.entries(
                      companyRoles.reduce(
                        (acc, role) => {
                          const companyName = role.company?.companyName || "Empresa não encontrada"
                          if (!acc[companyName]) {
                            acc[companyName] = []
                          }
                          acc[companyName].push(role)
                          return acc
                        },
                        {} as Record<string, typeof companyRoles>,
                      ),
                    ).map(([companyName, roles]) => (
                      <div key={companyName} className="border rounded-lg p-4 bg-gray-50">
                        <div className="flex items-center gap-2 mb-2">
                          <Building2 className="h-4 w-4 text-blue-600" />
                          <span className="font-medium">{companyName}</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {roles.map((role) => (
                            <Badge key={`company-${role.roleId}-${role.companyId}`} variant="outline">
                              {role.role.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">Nenhuma função por empresa atribuída</p>
                  )}
                </div>
              </div>

              {/* Permissões Resultantes */}
              <div>
                <h3 className="font-medium mb-3">Permissões Resultantes</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {userPermissions?.permissions.map((permission, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200"
                    >
                      <span className="text-sm font-medium capitalize">{permission.resource}</span>
                      <Badge variant="outline" className="text-xs bg-white">
                        {permission.action}
                      </Badge>
                    </div>
                  )) || <p className="text-sm text-gray-500 col-span-full">Nenhuma permissão atribuída</p>}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
