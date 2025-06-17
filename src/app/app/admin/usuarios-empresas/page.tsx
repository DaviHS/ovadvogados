"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Edit, Trash2, Users, Building2 } from "lucide-react"
import Link from "next/link"

interface UserCompany {
  id: number
  userId: number
  userName: string
  userEmail: string
  companyId: number
  companyName: string
  role: string
  status: number
  startDate: string
  endDate?: string
}

export default function UserCompanies() {
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const userCompanies: UserCompany[] = [
    {
      id: 1,
      userId: 1,
      userName: "João Silva Santos",
      userEmail: "joao.silva@email.com",
      companyId: 1,
      companyName: "TAM Linhas Aéreas",
      role: "admin",
      status: 1,
      startDate: "2024-01-15",
    },
    {
      id: 2,
      userId: 1,
      userName: "João Silva Santos",
      userEmail: "joao.silva@email.com",
      companyId: 2,
      companyName: "GOL Linhas Aéreas",
      role: "operator",
      status: 1,
      startDate: "2024-01-20",
    },
    {
      id: 3,
      userId: 2,
      userName: "Maria Costa Oliveira",
      userEmail: "maria.costa@email.com",
      companyId: 3,
      companyName: "GroundForce Handling",
      role: "operator",
      status: 1,
      startDate: "2024-01-10",
    },
    {
      id: 4,
      userId: 3,
      userName: "Pedro Lima",
      userEmail: "pedro.lima@email.com",
      companyId: 4,
      companyName: "Cargo Express",
      role: "viewer",
      status: 0,
      startDate: "2024-01-05",
      endDate: "2024-02-01",
    },
  ]

  const filteredUserCompanies = userCompanies.filter((uc) => {
    const matchesSearch =
      uc.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      uc.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      uc.companyName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === "all" || uc.role === roleFilter
    const matchesStatus = statusFilter === "all" || uc.status.toString() === statusFilter
    return matchesSearch && matchesRole && matchesStatus
  })

  const getStatusColor = (status: number) => {
    return status === 1 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
  }

  const getStatusText = (status: number) => {
    return status === 1 ? "Ativo" : "Inativo"
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-800"
      case "operator":
        return "bg-blue-100 text-blue-800"
      case "viewer":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getRoleText = (role: string) => {
    switch (role) {
      case "admin":
        return "Administrador"
      case "operator":
        return "Operador"
      case "viewer":
        return "Visualizador"
      default:
        return role
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Usuários x Empresas</h1>
              <p className="text-gray-600">Gerencie as relações entre usuários e empresas</p>
            </div>
            <Link href="/admin/usuarios-empresas/nova">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nova Relação
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar por usuário ou empresa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Todas as Funções</option>
            <option value="admin">Administrador</option>
            <option value="operator">Operador</option>
            <option value="viewer">Visualizador</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Todos os Status</option>
            <option value="1">Ativo</option>
            <option value="0">Inativo</option>
          </select>
        </div>

        <div className="grid gap-4">
          {filteredUserCompanies.map((uc) => (
            <Card key={uc.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-gray-400" />
                        <span className="font-semibold">{uc.userName}</span>
                      </div>
                      <span className="text-gray-400">→</span>
                      <div className="flex items-center gap-2">
                        <Building2 className="h-5 w-5 text-gray-400" />
                        <span className="font-semibold">{uc.companyName}</span>
                      </div>
                      <Badge className={getStatusColor(uc.status)}>{getStatusText(uc.status)}</Badge>
                      <Badge className={getRoleColor(uc.role)}>{getRoleText(uc.role)}</Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div>
                        <p className="font-medium">Email do Usuário</p>
                        <p>{uc.userEmail}</p>
                      </div>
                      <div>
                        <p className="font-medium">Data de Início</p>
                        <p>{new Date(uc.startDate).toLocaleDateString("pt-BR")}</p>
                      </div>
                      <div>
                        <p className="font-medium">Data de Fim</p>
                        <p>{uc.endDate ? new Date(uc.endDate).toLocaleDateString("pt-BR") : "Indefinido"}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Link href={`/admin/usuarios-empresas/${uc.id}/editar`}>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredUserCompanies.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Nenhuma relação encontrada.</p>
          </div>
        )}
      </div>
    </div>
  )
}
