"use client"

import { useMemo, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Edit, Eye, Loader2 } from "lucide-react"
import Link from "next/link"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { getPriorityColor, getStatusColor } from "@/lib"
import { usePageInfo } from "@/hooks/use-page-info"
import { api } from "@/lib/api"

interface Atendimento {
  handlingId: number
  flightNumber: string
  aircraftRegistration: string
  client: string
  flightType: string
  status: number
  date: string
  timeCompleted: string
  teamLeader: string
  base: string
}

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

  // Função para mapear status numérico para texto
  const mapStatus = (status: number): "Pendente" | "Em andamento" | "Concluído" | "Cancelado" => {
    switch (status) {
      case 0: return "Cancelado"
      case 1: return "Em andamento"
      case 2: return "Concluído"
      case 3: return "Pendente"
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
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Erro ao carregar atendimentos: {error.message}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="pb-4 flex justify-end">
          <Link href="/walkarounds/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Atendimento/Inspeção
            </Button>
          </Link>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
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

        <div className="grid grid-cols-1 gap-6 mb-8">
          {filteredAtendimentos.map((atendimento) => {
            const status = mapStatus(atendimento.status!)
            const priority = getPriority(atendimento.flightType)
            
            return (
              <Card key={atendimento.handlingId} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <h3 className="text-lg font-semibold break-words">
                          Voo {atendimento.flightNumber} - {atendimento.aircraftRegistration}
                        </h3>
                        <Badge className={getStatusColor(status)}>{status}</Badge>
                        <Badge className={getPriorityColor(priority)}>{priority}</Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 break-words">
                        <div>
                          <p className="font-medium">Cliente</p>
                          <p>{atendimento.client}</p>
                        </div>
                        <div>
                          <p className="font-medium">Tipo de Voo</p>
                          <p className="capitalize">{atendimento.flightType}</p>
                        </div>
                        <div>
                          <p className="font-medium">Líder da Equipe</p>
                          <p>{atendimento.teamLeader}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Data:</span> {new Date(atendimento.date).toLocaleDateString('pt-BR')}
                        </div>
                        <div>
                          <span className="font-medium">Hora:</span> {atendimento.timeCompleted}
                        </div>
                        <div>
                          <span className="font-medium">Base:</span> {atendimento.base}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex-shrink-0 flex gap-2 mt-4 sm:mt-0 sm:ml-4 justify-end self-stretch sm:self-auto">
                      <Link href={`/walkarounds/${atendimento.handlingId}`}>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-green-600 hover:text-green-700 hover:bg-green-300 border-green-300 hover:border-green-400 transition-colors"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href={`/walkarounds/${atendimento.handlingId}/edit`}>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-300 border-blue-300 hover:border-blue-400 transition-colors"
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
          <div className="text-center py-12">
            <p className="text-gray-500">
              {searchTerm || statusFilter !== "all" 
                ? "Nenhum atendimento encontrado com os filtros aplicados." 
                : "Nenhum atendimento cadastrado."
              }
            </p>
          </div>
        )}
      </div>
    </div>
  )
}