"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plane, ClipboardCheck, Users, AlertTriangle, Loader2 } from "lucide-react"
import Link from "next/link"
import { usePageInfo } from "@/hooks/use-page-info"
import { useMemo } from "react"
import { api } from "@/lib/api"
import { format, isToday, isThisMonth } from "date-fns"
import { ptBR } from "date-fns/locale"

export default function Handling() {
  const breadcrumbs = useMemo(() => [ 
    { label: "RampSync" }
  ], []);
  
  usePageInfo({
    title: `Tela Início`,
    breadcrumbs,
  })

  // Buscar dados reais dos atendimentos
  const { data: handlingsData, isLoading, error } = api.handling.list.useQuery({
    page: 1,
    limit: 100,
  })

  // Calcular estatísticas com base nos dados reais
  const stats = useMemo(() => {
    if (!handlingsData?.items) {
      return [
        { title: "Atendimentos Hoje", value: "0", description: "Carregando...", icon: Users, color: "text-blue-600" },
        { title: "Atendimentos Concluídos", value: "0", description: "Total", icon: ClipboardCheck, color: "text-green-600" },
        { title: "Aeronaves Ativas", value: "0", description: "Últimos 7 dias", icon: Plane, color: "text-green-600" },
        { title: "Alertas", value: "0", description: "Danos detectados", icon: AlertTriangle, color: "text-red-600" },
      ]
    }

    const items = handlingsData.items
    const today = new Date()
    
    // DEBUG: Log para verificar as datas
    console.log("Datas dos atendimentos:", items.map(item => ({
      id: item.handlingId,
      date: item.date,
      createdAt: item.createdAt,
      isToday: item.createdAt ? isToday(new Date(item.createdAt)) : false
    })))

    // Atendimentos de hoje (baseado na criação)
    const todayItems = items.filter(item => 
      item.createdAt && isToday(new Date(item.createdAt))
    ).length

    // Atendimentos em andamento hoje
    const inProgressToday = items.filter(item => 
      item.createdAt && 
      isToday(new Date(item.createdAt)) && 
      item.status === 1
    ).length

    // Atendimentos concluídos (total)
    const completedItems = items.filter(item => item.status === 2).length

    // Aeronaves únicas dos últimos 7 dias
    const lastWeek = new Date()
    lastWeek.setDate(lastWeek.getDate() - 7)
    const uniqueAircrafts = new Set(
      items
        .filter(item => 
          item.createdAt && 
          new Date(item.createdAt) >= lastWeek
        )
        .map(item => item.aircraftRegistration)
        .filter(Boolean)
    ).size

    // Alertas - atendimentos com danos detectados
    const alertsCount = items.filter(item => item.damageDetected).length

    return [
      {
        title: "Atendimentos Hoje",
        value: todayItems.toString(),
        description: `${inProgressToday} em andamento`,
        icon: Users,
        color: "text-blue-600",
      },
      {
        title: "Atendimentos Concluídos",
        value: completedItems.toString(),
        description: "Total",
        icon: ClipboardCheck,
        color: "text-green-600",
      },
      {
        title: "Aeronaves Ativas",
        value: uniqueAircrafts.toString(),
        description: "Últimos 7 dias",
        icon: Plane,
        color: "text-green-600",
      },
      {
        title: "Alertas",
        value: alertsCount.toString(),
        description: "Danos detectados",
        icon: AlertTriangle,
        color: "text-red-600",
      },
    ]
  }, [handlingsData])

  // Atendimentos recentes (últimos 3)
  const recentHandlings = useMemo(() => {
    if (!handlingsData?.items) return []

    return handlingsData.items
      .sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0
        return dateB - dateA
      })
      .slice(0, 3)
      .map(item => {
        const displayDate = item.createdAt ? new Date(item.createdAt) : new Date()
        return {
          id: item.handlingId.toString(),
          aircraft: item.aircraftRegistration,
          flightNumber: item.flightNumber,
          type: item.flightType === 'arrival' ? 'Chegada' : 'Partida',
          status: item.status === 2 ? 'Concluído' : item.status === 1 ? 'Em andamento' : 'Pendente',
          time: item.timeCompleted,
          date: format(displayDate, "dd/MM/yyyy", { locale: ptBR }),
          client: item.client,
        }
      })
  }, [handlingsData])

  // Função para mapear status para cores
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Concluído':
        return "bg-green-100 text-green-800"
      case 'Em andamento':
        return "bg-blue-100 text-blue-800"
      case 'Pendente':
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Carregando dados...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-4" />
          <p className="text-red-500">Erro ao carregar dados: {error.message}</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="mt-4"
          >
            Tentar Novamente
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto py-4">
        <div className="flex justify-end mb-6">
          <Link href="/walkarounds/new">
            <Button>Novo Atendimento/Inspeção</Button>
          </Link>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Atendimentos Recentes */}
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Atendimentos Recentes</CardTitle>
              <CardDescription>Últimos atendimentos registrados no sistema</CardDescription>
            </CardHeader>
            <CardContent>
              {recentHandlings.length > 0 ? (
                <>
                  <div className="space-y-4">
                    {recentHandlings.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium">{item.aircraft}</p>
                            <span className="text-sm text-gray-500">•</span>
                            <p className="text-sm text-gray-600">Voo {item.flightNumber}</p>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="capitalize">{item.type}</span>
                            <span>•</span>
                            <span>{item.client}</span>
                            <span>•</span>
                            <span>{item.date}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{item.time}</p>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${getStatusColor(item.status)}`}
                          >
                            {item.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4">
                    <Link href="/app/walkarounds">
                      <Button variant="outline" className="w-full">
                        Ver Todos os Atendimentos ({handlingsData?.total || 0})
                      </Button>
                    </Link>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <ClipboardCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">Nenhum atendimento encontrado</p>
                  <Link href="/walkarounds/new">
                    <Button>Criar Primeiro Atendimento</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Cards de Ação Rápida */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="text-center">
                <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-semibold text-blue-900 mb-2">Gerenciar Equipe</h3>
                <p className="text-blue-700 text-sm mb-4">Atribuir e gerenciar equipes de atendimento</p>
                <Button variant="outline" className="border-blue-300 text-blue-700">
                  Acessar
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-green-50 border-green-200">
            <CardContent className="pt-6">
              <div className="text-center">
                <ClipboardCheck className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <h3 className="font-semibold text-green-900 mb-2">Relatórios</h3>
                <p className="text-green-700 text-sm mb-4">Gerar relatórios de desempenho</p>
                <Button variant="outline" className="border-green-300 text-green-700">
                  Gerar
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-orange-50 border-orange-200">
            <CardContent className="pt-6">
              <div className="text-center">
                <AlertTriangle className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <h3 className="font-semibold text-orange-900 mb-2">Alertas</h3>
                <p className="text-orange-700 text-sm mb-4">Verificar incidentes e problemas</p>
                <Button variant="outline" className="border-orange-300 text-orange-700">
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