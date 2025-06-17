"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Edit, Trash2, Eye } from "lucide-react"
import Link from "next/link"

interface User {
  userId: number
  fullName: string
  email: string
  enrollmentNumber: string
  status: number
  createdAt: string
  companies: string[]
}

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  // Mock data - substituir por dados reais do banco
  const users: User[] = [
    {
      userId: 1,
      fullName: "João Silva Santos",
      email: "joao.silva@email.com",
      enrollmentNumber: "EMP001",
      status: 1,
      createdAt: "2024-01-15",
      companies: ["TAM Linhas Aéreas", "Gol Linhas Aéreas"],
    },
    {
      userId: 2,
      fullName: "Maria Costa Oliveira",
      email: "maria.costa@email.com",
      enrollmentNumber: "EMP002",
      status: 1,
      createdAt: "2024-01-10",
      companies: ["Azul Linhas Aéreas"],
    },
    {
      userId: 3,
      fullName: "Pedro Lima",
      email: "pedro.lima@email.com",
      enrollmentNumber: "EMP003",
      status: 0,
      createdAt: "2024-01-05",
      companies: ["LATAM Airlines"],
    },
  ]

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.enrollmentNumber.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || user.status.toString() === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: number) => {
    return status === 1 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
  }

  const getStatusText = (status: number) => {
    return status === 1 ? "Ativo" : "Inativo"
  }

  return (
    <div className="min-h-screen">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestão de Usuários</h1>
              <p className="text-gray-600">Gerencie usuários do sistema</p>
            </div>
            <Link href="/admin/usuarios/novo">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Novo Usuário
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
              placeholder="Buscar por nome, email ou matrícula..."
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
            <option value="1">Ativo</option>
            <option value="0">Inativo</option>
          </select>
        </div>

        <div className="grid gap-4">
          {filteredUsers.map((user) => (
            <Card key={user.userId} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <h3 className="text-lg font-semibold">{user.fullName}</h3>
                      <Badge className={getStatusColor(user.status)}>{getStatusText(user.status)}</Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div>
                        <p className="font-medium">Email</p>
                        <p>{user.email}</p>
                      </div>
                      <div>
                        <p className="font-medium">Matrícula</p>
                        <p>{user.enrollmentNumber}</p>
                      </div>
                      <div>
                        <p className="font-medium">Data de Cadastro</p>
                        <p>{new Date(user.createdAt).toLocaleDateString("pt-BR")}</p>
                      </div>
                    </div>
                    <div className="mt-2">
                      <p className="font-medium text-sm text-gray-600">Empresas:</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {user.companies.map((company, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {company}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Link href={`/admin/usuarios/${user.userId}/editar`}>
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

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Nenhum usuário encontrado.</p>
          </div>
        )}
      </div>
    </div>
  )
}
