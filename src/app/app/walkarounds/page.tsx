"use client"

import { useMemo, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Edit, Eye, Plane, Users, ClipboardCheck, AlertTriangle, Clock, Calendar } from "lucide-react"
import Link from "next/link"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { getPriorityColor, getStatusColor } from "@/lib"
import { usePageInfo } from "@/hooks/use-page-info"
import { api } from "@/lib/api"
import { LoadingState } from "@/components/ui/loading-state"
import { ErrorDisplay } from "@/components/ui/error-display"

export default function WalkaroundsPage() {
  const breadcrumbs = useMemo(() => [ 
    { label: "RampSync", href: "/app" }, 
    { label: "Walkaround" }],
  [])
  
  usePageInfo({
    title: "Atendimentos e Inspeção Walkarounds",
    breadcrumbs
  })
    
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  // Buscar dados reais da API
  const { data: atendimentosData, isLoading, error } = api.handling.list.useQuery({
    page: 1,
    limit: 50,
    search: searchTerm,
  })

  // Estatísticas para o dashboard
  const dashboardStats = useMemo(() => {
    if (!atendimentosData?.items) return null

    const items = atendimentosData.items
    const totalAtendimentos = items.length
    const emAndamento = items.filter(item => item.status === 1).length
    const concluidos = items.filter(item => item.status === 2).length
    const comDanos = items.filter(item => item.damageDetected).length

    return [
      {
        title: "Total de Atendimentos",
        value: totalAtendimentos.toString(),
        description: "Todos os registros",
        icon: ClipboardCheck,
        color: "text-blue-600",
        bgColor: "bg-blue-50"
      },
      {
        title: "Em Andamento",
        value: emAndamento.toString(),
        description: "Atendimentos ativos",
        icon: Users,
        color: "text-orange-600",
        bgColor: "bg-orange-50"
      },
      {
        title: "Concluídos",
        value: concluidos.toString(),
        description: "Finalizados com sucesso",
        icon: ClipboardCheck,
        color: "text-green-600",
        bgColor: "bg-green-50"
      },
      {
        title: "Com Danos",
        value: comDanos.toString(),
        description: "Incidentes reportados",
        icon: AlertTriangle,
        color: "text-red-600",
        bgColor: "bg-red-50"
      },
    ]
  }, [atendimentosData])

  // Função para mapear status numérico para texto
  const mapStatus = (status: number): "Pendente" | "Em andamento" | "Concluído" | "Cancelado" => {
    switch (status) {
      case 0: return "Cancelado"
      case 1: return "Em andamento"
      case 2: return "Concluído"
      default: return "Pendente"
    }
  }

  // Função para determinar prioridade baseada no tipo de voo
  const getPriority = (flightType: string): "Baixa" | "Média" | "Alta" | "Crítica" => {
    switch (flightType) {
      case "international": return "Alta"
      case "charter": return "Crítica"
      case "cargo": return "Média"
      default: return "Baixa"
    }
  }

  const filteredAtendimentos = (atendimentosData?.items || []).filter((atendimento) => {
    const matchesSearch =
      atendimento.flightNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      atendimento.aircraftRegistration.toLowerCase().includes(searchTerm.toLowerCase()) ||
      atendimento.client.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || mapStatus(atendimento.status!) === statusFilter
    
    return matchesSearch && matchesStatus
  })

  if (isLoading) {
    return <LoadingState message="Carregando atendimentos..." />
  }

  if (error) {
    return <ErrorDisplay message={`Erro ao carregar atendimentos: ${error.message}`} />
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Walkarounds</h1>
            <p className="text-gray-600 mt-2">Gerencie todos os atendimentos e inspeções de aeronaves</p>
          </div>
          <Link href="/app/walkarounds/new">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Novo Atendimento
            </Button>
          </Link>
        </div>

        {/* Dashboard Stats */}
        {dashboardStats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {dashboardStats.map((stat) => (
              <Card key={stat.title} className={`${stat.bgColor} border-0`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <p className="text-sm font-medium text-gray-600 mt-1">{stat.title}</p>
                      <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
                    </div>
                    <div className={`p-3 rounded-full ${stat.bgColor}`}>
                      <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Filtros e Busca */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar por voo, aeronave ou cliente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full"
                />
              </div>
              <div className="w-full sm:w-[220px]">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Todos os Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Status</SelectItem>
                    <SelectItem value="Pendente">Pendente</SelectItem>
                    <SelectItem value="Em andamento">Em andamento</SelectItem>
                    <SelectItem value="Concluído">Concluído</SelectItem>
                    <SelectItem value="Cancelado">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Atendimentos */}
        <div className="grid grid-cols-1 gap-6 mb-8">
          {filteredAtendimentos.map((atendimento) => {
            const status = mapStatus(atendimento.status!)
            const priority = getPriority(atendimento.flightType)
            
            return (
              <Card key={atendimento.handlingId} className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap mb-3">
                        <div className="flex items-center gap-2">
                          <Plane className="h-5 w-5 text-gray-400" />
                          <h3 className="text-lg font-semibold break-words">
                            {atendimento.flightNumber} • {atendimento.aircraftRegistration}
                          </h3>
                        </div>
                        <div className="flex gap-2">
                          <Badge variant="secondary" className={getStatusColor(status)}>
                            {status}
                          </Badge>
                          <Badge variant="outline" className={getPriorityColor(priority)}>
                            {priority}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div className="space-y-1">
                          <p className="font-medium text-gray-900">Cliente</p>
                          <p>{atendimento.client}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="font-medium text-gray-900">Líder da Equipe</p>
                          <p>{atendimento.teamLeader}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="font-medium text-gray-900">Base</p>
                          <p>{atendimento.base}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span>{new Date(atendimento.date).toLocaleDateString('pt-BR')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span>{atendimento.timeCompleted}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Plane className="h-4 w-4 text-gray-400" />
                          <span className="capitalize">{atendimento.flightType}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 mt-4 sm:mt-0 sm:ml-4">
                      <Link href={`/app/walkarounds/${atendimento.handlingId}`}>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href={`/app/walkarounds/${atendimento.handlingId}/edit`}>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {filteredAtendimentos.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Plane className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {searchTerm || statusFilter !== "all" 
                  ? "Nenhum atendimento encontrado" 
                  : "Nenhum atendimento cadastrado"
                }
              </h3>
              <p className="text-gray-500 mb-6">
                {searchTerm || statusFilter !== "all" 
                  ? "Tente ajustar os filtros de busca ou status." 
                  : "Comece criando seu primeiro atendimento."
                }
              </p>
              <Link href="/app/walkarounds/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Primeiro Atendimento
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}