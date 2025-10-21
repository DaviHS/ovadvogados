"use client"

import { use } from "react"
import Link from "next/link"
import { useMemo } from "react"
import {
  ArrowLeft,
  Building2,
  Calendar,
  Edit,
  Hash,
  Mail,
  User,
} from "lucide-react"

import { api } from "@/trpc/react"
import { usePageInfo } from "@/hooks/use-page-info"
import { getNumberStatusColor, getStatusText } from "@/lib"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface Props {
  params: Promise<{ userId: string }>
}

export default function UserDetailsPage({ params }: Props) {
  const { userId } = use(params)
  const userIdNum = Number(userId)

  const { data: user, isLoading } = api.user.getById.useQuery(
    { userId: userIdNum },
    { enabled: !isNaN(userIdNum) }
  )

  const breadcrumbs = useMemo(
    () => [
      { label: "RampSync", href: "/app" },
      { label: "Usuários", href: "/admin/users" },
      { label: user?.fullName || "Carregando..." },
    ],
    [user?.fullName]
  )

  usePageInfo({
    title: user?.fullName || "Detalhes do Usuário",
    breadcrumbs,
  })

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto py-12 text-center">
          <h2 className="text-2xl font-bold">Usuário não encontrado</h2>
          <p className="text-gray-600">Verifique se o usuário ainda existe.</p>
          <Link href="/admin/users" className="mt-4 inline-block">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">{user.fullName}</h1>
            <p className="text-muted-foreground">Detalhes do usuário</p>
          </div>
          <Link href={`/admin/users/${user.userId}/edit`}>
            <Button>
              <Edit className="w-4 h-4 mr-2" />
              Editar
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Informações Básicas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  icon: <User className="h-4 w-4 text-gray-500" />,
                  label: "Nome Completo",
                  value: user.fullName,
                },
                {
                  icon: <Mail className="h-4 w-4 text-gray-500" />,
                  label: "Email",
                  value: user.email,
                },
                {
                  icon: <Hash className="h-4 w-4 text-gray-500" />,
                  label: "Matrícula",
                  value: user.enrollmentNumber || "Não informada",
                },
                {
                  icon: <div className="h-4 w-4" />,
                  label: "Status",
                  value: (
                    <Badge className={getNumberStatusColor(user.status ?? 0)}>
                      {getStatusText(user.status ?? 0)}
                    </Badge>
                  ),
                },
                {
                  icon: <Calendar className="h-4 w-4 text-gray-500" />,
                  label: "Criado em",
                  value: user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("pt-BR")
                    : "Não informado",
                },
              ].map((field, i) => (
                <div key={i} className="flex items-start gap-3">
                  {field.icon}
                  <div>
                    <div className="text-sm text-muted-foreground">{field.label}</div>
                    <div className="text-base font-medium">{field.value}</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Funções por Empresa
              </CardTitle>
              <CardDescription>Funções atribuídas por empresa</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {user.companies.length > 0 ? (
                user.companies.map((company) => (
                  <div
                    key={company.companyId}
                    className="border rounded-lg p-4 bg-gray-50"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Building2 className="h-4 w-4 text-blue-600" />
                      <span className="font-medium">{company.companyName}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {company.roles.length > 0 ? (
                        company.roles.map((role) => (
                          <Badge key={role.roleId} variant="outline">
                            {role.roleName}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500">Nenhuma função atribuída</p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">Usuário não possui empresas vinculadas</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function InfoRow({
  icon,
  label,
  value,
  children,
}: {
  icon: React.ReactNode
  label: string
  value?: React.ReactNode
  children?: React.ReactNode
}) {
  return (
    <div className="flex items-center gap-3">
      {icon}
      <div>
        <label className="text-sm font-medium text-gray-500">{label}</label>
        <div className="text-lg">
          {value !== undefined ? value : children}
        </div>
      </div>
    </div>
  )
}
