"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Edit, Eye } from "lucide-react"
import Link from "next/link"

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

export default function AtendimentosPage() {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Concluído":
        return "bg-green-100 hover:bg-green-300 text-green-800"
      case "Em andamento":
        return "bg-blue-100 hover:bg-blue-300 text-blue-800"
      case "Pendente":
        return "bg-yellow-100 hover:bg-yellow-300 text-yellow-800"
      case "Cancelado":
        return "bg-red-100 hover:bg-red-300 text-red-800"
      default:
        return "bg-gray-100 hover:bg-gray-300 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Crítica":
        return "bg-red-100 hover:bg-red-300 text-red-800"
      case "Alta":
        return "bg-orange-100 hover:bg-orange-300 text-orange-800"
      case "Média":
        return "bg-yellow-100 hover:bg-yellow-300 text-yellow-800"
      case "Baixa":
        return "bg-green-100 hover:bg-green-300 text-green-800"
      default:
        return "bg-gray-100 hover:bg-gray-300 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-end">
        <Link href="/app/atendimentos/novo">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Novo Atendimento/Inspeção
          </Button>
        </Link>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar por aeronave, empresa ou serviço..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Todos os Status</option>
            <option value="Pendente">Pendente</option>
            <option value="Em andamento">Em andamento</option>
            <option value="Concluído">Concluído</option>
            <option value="Cancelado">Cancelado</option>
          </select>
        </div>

        <div className="grid gap-4">
          {filteredAtendimentos.map((atendimento) => (
            <Card key={atendimento.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <h3 className="text-lg font-semibold">{atendimento.aircraft}</h3>
                      <Badge className={getStatusColor(atendimento.status)}>{atendimento.status}</Badge>
                      <Badge className={getPriorityColor(atendimento.priority)}>{atendimento.priority}</Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
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
                    <div className="flex gap-4 mt-2 text-sm text-gray-600">
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
                  <div className="flex gap-2 ml-4">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Link href={`/app/atendimentos/${atendimento.id}/editar`}>
                      <Button variant="outline" size="sm">
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
