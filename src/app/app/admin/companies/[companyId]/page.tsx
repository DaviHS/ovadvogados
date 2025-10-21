"use client"

import { use } from "react"
import Link from "next/link"
import { ArrowLeft, Building2, Calendar, Edit, Mail, Phone, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { usePageInfo } from "@/hooks/use-page-info"
import { getNumberStatusColor, getStatusText } from "@/lib"
import { api } from "@/trpc/react"

interface Props {
  params: Promise<{ companyId: string }>
}

export default function CompanyDetailsPage({ params }: Props) {
  const { companyId } = use(params)
  const numericCompanyId = Number(companyId)

  const { data: company, isLoading } = api.company.getById.useQuery(
    { companyId: numericCompanyId },
    { enabled: !isNaN(numericCompanyId) }
  )

  usePageInfo({
    title: company?.companyName || "Empresa",
    breadcrumbs: [
      { label: "RampSync", href: "/app" },
      { label: "Empresas", href: "/admin/companies" },
      { label: company?.companyName || "Visualizar" },
    ],
  })

  if (isLoading) {
    return <p>Carregando dados da empresa...</p>
  }

  if (!company) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold">Empresa não encontrada</h2>
        <p className="text-gray-600">Verifique se a empresa ainda existe.</p>
        <Link href="/admin/companies">
          <Button className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto py-2 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{company.companyName}</h1>
          <p className="text-muted-foreground">Informações detalhadas da empresa</p>
        </div>
        <Link href={`/admin/companies/${company.companyId}/edit`}>
          <Button>
            <Edit className="w-4 h-4 mr-2" />
            Editar
           </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Informações da Empresa
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <Info label="CNPJ" value={company!.cnpj!} />
          <Info label="Email" value={company!.email!} />
          <Info label="Telefone" value={company!.phone!} />
          <Info label="Status">
            <Badge className={getNumberStatusColor(company.status ?? 0)}>
              {getStatusText(company.status ?? 0)}
            </Badge>
          </Info>
          <Info label="Tipo" value={company.companyType ?? "Não informado"} />
          <Info label="Localização" value={`${company.city} / ${company.state}`} />
          <Info
            label="Criada em"
            value={
              company.createdAt
                ? new Date(company.createdAt).toLocaleDateString("pt-BR")
                : "Não informado"
            }
            icon={<Calendar className="h-4 w-4 text-gray-500" />}
          />
        </CardContent>
      </Card>

      {company.users && company.users.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Usuários Vinculados
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {company.users.map((user) => (
              <div key={user.userId} className="flex justify-between text-sm">
                <span>{user.fullName}</span>
                <span className="text-gray-500">{user.email}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function Info({
  label,
  value,
  icon,
  children,
}: {
  label: string
  value?: string
  icon?: React.ReactNode
  children?: React.ReactNode
}) {
  return (
    <div className="flex items-center gap-3">
      {icon}
      <div>
        <p className="text-xs font-semibold text-gray-500">{label}</p>
        <div className="text-base">
          {value || children || "Não informado"}
        </div>
      </div>
    </div>
  )
}
