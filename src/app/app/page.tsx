"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Plane, 
  ClipboardCheck, 
  Users, 
  AlertTriangle, 
  FileText, 
  Settings,
  BarChart3,
  Shield
} from "lucide-react"
import Link from "next/link"
import { usePageInfo } from "@/hooks/use-page-info"
import { useMemo } from "react"
import { api } from "@/lib/api"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { LoadingState } from "@/components/ui/loading-state"
import { ErrorDisplay } from "@/components/ui/error-display"

export default function Dashboard() {
  const breadcrumbs = useMemo(() => [{ label: "RampSync" }], [])

  usePageInfo({
    title: `Dashboard`,
    breadcrumbs,
  })

  const { data: handlingsData, isLoading, error } = api.handling.list.useQuery({
    page: 1,
    limit: 100,
  })

  const stats = useMemo(() => {
    if (!handlingsData?.items) {
      return [
        { title: "Atendimentos Hoje", value: "0", description: "Carregando...", icon: Users, color: "text-blue-600" },
        { title: "Atendimentos Concluídos", value: "0", description: "Total", icon: ClipboardCheck, color: "text-green-600" },
        { title: "Aeronaves Ativas", value: "0", description: "Últimos 7 dias", icon: Plane, color: "text-green-600" },
        { title: "Alertas", value: "0", description: "Requer atenção", icon: AlertTriangle, color: "text-red-600" },
      ]
    }

    const items = handlingsData.items
    const todayItems = items.length
    const completedItems = items.filter(item => item.status === 2).length
    const uniqueAircrafts = new Set(items.map(item => item.aircraftRegistration).filter(Boolean)).size
    const alertsCount = items.filter(item => item.damageDetected).length

    return [
      {
        title: "Total de Atendimentos",
        value: todayItems.toString(),
        description: `${items.filter(item => item.status === 1).length} em andamento`,
        icon: Users,
        color: "text-blue-600",
      },
      {
        title: "Concluídos",
        value: completedItems.toString(),
        description: "Atendimentos finalizados",
        icon: ClipboardCheck,
        color: "text-green-600",
      },
      {
        title: "Aeronaves",
        value: uniqueAircrafts.toString(),
        description: "Aeronaves atendidas",
        icon: Plane,
        color: "text-green-600",
      },
      {
        title: "Alertas",
        value: alertsCount.toString(),
        description: "Incidentes reportados",
        icon: AlertTriangle,
        color: "text-red-600",
      },
    ]
  }, [handlingsData])

  const modules = [
    {
      title: "Walkarounds",
      description: "Inspeções e atendimentos de aeronaves",
      icon: ClipboardCheck,
      href: "/app/walkarounds",
      color: "bg-blue-50 border-blue-200 text-blue-700",
      features: ["Inspeções visuais", "Checklists", "Relatórios de danos"]
    },
    {
      title: "Gestão de Equipes",
      description: "Alocação e gestão de pessoal",
      icon: Users,
      href: "/app/teams",
      color: "bg-green-50 border-green-200 text-green-700",
      features: ["Alocação de equipes", "Escalas", "Desempenho"]
    },
    {
      title: "Relatórios",
      description: "Analytics e relatórios de desempenho",
      icon: BarChart3,
      href: "/app/reports",
      color: "bg-purple-50 border-purple-200 text-purple-700",
      features: ["Métricas de desempenho", "Analytics", "Exportação"]
    },
    {
      title: "Manutenção",
      description: "Controle de manutenção preventiva",
      icon: Settings,
      href: "/app/maintenance",
      color: "bg-orange-50 border-orange-200 text-orange-700",
      features: ["Agendamentos", "Histórico", "Peças"]
    },
    {
      title: "Documentação",
      description: "Manuais e documentação técnica",
      icon: FileText,
      href: "/app/docs",
      color: "bg-gray-50 border-gray-200 text-gray-700",
      features: ["Manuais", "Procedimentos", "Checklists"]
    },
    {
      title: "Segurança",
      description: "Conformidade e segurança operacional",
      icon: Shield,
      href: "/app/safety",
      color: "bg-red-50 border-red-200 text-red-700",
      features: ["Conformidade", "Incidentes", "Auditorias"]
    }
  ]

  if (isLoading) return <LoadingState message="Carregando Dashboard..." />
  if (error) return <ErrorDisplay message={`Erro ao carregar dados: ${error.message}`} />

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto py-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-2">Visão geral das operações e atendimentos</p>
          </div>
          <div className="flex gap-3">
            <Link href="/app/walkarounds/new">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <ClipboardCheck className="h-4 w-4 mr-2" />
                Novo Atendimento
              </Button>
            </Link>
            <Link href="/app/walkarounds">
              <Button variant="outline">
                <Plane className="h-4 w-4 mr-2" />
                Ver Todos
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <Card key={stat.title} className="hover:shadow-lg transition-all duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="w-full h-full">
          <CardHeader>
            <CardTitle>Módulos do Sistema</CardTitle>
            <CardDescription>Acesso rápido às funcionalidades</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {modules.map((module) => (
                <Link key={module.title} href={module.href}>
                  <div
                    className={`h-full flex flex-col justify-between p-4 rounded-lg border-2 transition-all hover:shadow-md hover:scale-105 cursor-pointer ${module.color}`}
                  >
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <module.icon className="h-5 w-5" />
                        <h3 className="font-semibold">{module.title}</h3>
                      </div>
                      <p className="text-sm opacity-80 mb-2">{module.description}</p>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-auto">
                      {module.features.map((feature, index) => (
                        <span
                          key={index}
                          className="text-xs bg-white bg-opacity-50 px-2 py-1 rounded"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="pt-6">
              <div className="text-center">
                <ClipboardCheck className="h-8 w-8 mx-auto mb-2" />
                <h3 className="font-semibold mb-2">Walkaround Rápido</h3>
                <p className="text-blue-100 text-sm mb-4">Iniciar inspeção rápida</p>
                <Link href="/app/walkarounds/new">
                  <Button variant="secondary" size="sm">
                    Iniciar Agora
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="pt-6">
              <div className="text-center">
                <BarChart3 className="h-8 w-8 mx-auto mb-2" />
                <h3 className="font-semibold mb-2">Relatório Diário</h3>
                <p className="text-green-100 text-sm mb-4">Gerar relatório do dia</p>
                <Button variant="secondary" size="sm">
                  Gerar
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="pt-6">
              <div className="text-center">
                <Users className="h-8 w-8 mx-auto mb-2" />
                <h3 className="font-semibold mb-2">Minha Equipe</h3>
                <p className="text-purple-100 text-sm mb-4">Gerenciar escalas</p>
                <Button variant="secondary" size="sm">
                  Acessar
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardContent className="pt-6">
              <div className="text-center">
                <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
                <h3 className="font-semibold mb-2">Alertas</h3>
                <p className="text-orange-100 text-sm mb-4">Verificar incidentes</p>
                <Button variant="secondary" size="sm">
                  Verificar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}