"use client"

import { useMemo, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Edit, Eye } from "lucide-react"
import Link from "next/link"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { getPriorityColor, getStatusColor } from "@/lib"
import { usePageInfo } from "@/hooks/use-page-info"

interface Atendimento {
  id: string
  aircraft: string
  company: string
  serviceType: string
  status: "Pendente" | "Em andamento" | "Concluído" | "Cancelado"
  startTime: string
  endTime?: string
  responsible: string
  priority: "Baixa" | "Média" | "Alta" | "Crítica"
}

export default function WalkaroundsPage() {
  const breadcrumbs = useMemo(() => [ 
    { label: "RampSync", href: "/app" }, 
    { label: "Walkaround" }],
  []);
  
  usePageInfo({
    title: "Atendimentos e Inspeção Walkarounds",
    breadcrumbs
  })
    
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const atendimentos: Atendimento[] = [
    {
      id: "ATD-001",
      aircraft: "PR-ABC",
      company: "TAM Linhas Aéreas",
      serviceType: "Abastecimento",
      status: "Em andamento",
      startTime: "14:30",
      responsible: "João Silva",
      priority: "Alta",
    },
    {
      id: "ATD-002",
      aircraft: "PR-DEF",
      company: "GOL Linhas Aéreas",
      serviceType: "Limpeza",
      status: "Concluído",
      startTime: "13:45",
      endTime: "14:15",
      responsible: "Maria Santos",
      priority: "Média",
    },
    {
      id: "ATD-003",
      aircraft: "PR-GHI",
      company: "Azul Linhas Aéreas",
      serviceType: "Catering",
      status: "Pendente",
      startTime: "15:00",
      responsible: "Pedro Costa",
      priority: "Baixa",
    },
    {
      id: "ATD-004",
      aircraft: "PR-JKL",
      company: "LATAM Airlines",
      serviceType: "Manutenção",
      status: "Em andamento",
      startTime: "12:00",
      responsible: "Ana Oliveira",
      priority: "Crítica",
    },
  ]

  const filteredAtendimentos = atendimentos.filter((atendimento) => {
    const matchesSearch =
      atendimento.aircraft.toLowerCase().includes(searchTerm.toLowerCase()) ||
      atendimento.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      atendimento.serviceType.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || atendimento.status === statusFilter
    return matchesSearch && matchesStatus
  })

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
              placeholder="Buscar por aeronave, empresa ou serviço..."
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
          {filteredAtendimentos.map((atendimento) => (
            <Card key={atendimento.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <h3 className="text-lg font-semibold break-words">{atendimento.aircraft}</h3>
                      <Badge className={getStatusColor(atendimento.status)}>{atendimento.status}</Badge>
                      <Badge className={getPriorityColor(atendimento.priority)}>{atendimento.priority}</Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 break-words">
                      <div>
                        <p className="font-medium">Empresa</p>
                        <p>{atendimento.company}</p>
                      </div>
                      <div>
                        <p className="font-medium">Tipo de Serviço</p>
                        <p>{atendimento.serviceType}</p>
                      </div>
                      <div>
                        <p className="font-medium">Responsável</p>
                        <p>{atendimento.responsible}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Início:</span> {atendimento.startTime}
                      </div>
                      {atendimento.endTime && (
                        <div>
                          <span className="font-medium">Fim:</span> {atendimento.endTime}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex-shrink-0 flex gap-2 mt-4 sm:mt-0 sm:ml-4 justify-end self-stretch sm:self-auto">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-green-600 hover:text-green-700 hover:bg-green-300 border-green-300 hover:border-green-400 transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Link href={`/walkarounds/${atendimento.id}/edit`}>
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
          ))}
        </div>

        {filteredAtendimentos.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Nenhum atendimento encontrado.</p>
          </div>
        )}
      </div>
    </div>
  )
}
