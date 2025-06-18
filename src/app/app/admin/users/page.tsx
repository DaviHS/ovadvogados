"use client"

import { useMemo, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Edit, Trash2, Eye } from "lucide-react"
import Link from "next/link"
import { usePageInfo } from "@/hooks/use-page-info"
import { getNumberStatusColor, getStatusText } from "@/lib"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"

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
  const breadcrumbs = useMemo(() => [ 
    { label: "RampSync", href: "/app" }, 
    { label: "Gestão de Usuários" }],
  [])

  usePageInfo({
    title: "Gestão de Usuários",
    breadcrumbs
  })

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

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="pb-4 flex justify-end">
          <Link href="/admin/users/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Cadastrar Usuário
            </Button>
          </Link>
        </div>

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

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Todos os Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Status</SelectItem>
              <SelectItem value="1">Ativo</SelectItem>
              <SelectItem value="0">Inativo</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 gap-6 mb-8">
          {filteredUsers.map((user) => (
            <Card key={user.userId} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <div className="flex-1 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <h3 className="text-lg font-semibold truncate">{user.fullName}</h3>
                      <Badge className={getNumberStatusColor(user.status)}>{getStatusText(user.status)}</Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-700">
                      <div>
                        <p className="font-medium text-gray-600">Email</p>
                        <p className="break-words">{user.email}</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-600">Matrícula</p>
                        <p>{user.enrollmentNumber}</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-600">Data de Cadastro</p>
                        <p>{new Date(user.createdAt).toLocaleDateString("pt-BR")}</p>
                      </div>
                    </div>

                    <div>
                      <p className="font-medium text-sm text-gray-600">Empresas</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {user.companies.map((company, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {company}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex sm:flex-col justify-end items-end gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-green-600 hover:text-green-700 hover:bg-green-300 border-green-300 hover:border-green-400 transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Link href={`/admin/user/${user.userId}/edit`}>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-300 border-blue-300 hover:border-blue-400 transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-red-600 hover:text-red-700 hover:bg-red-300 border-red-300 hover:border-red-400 transition-colors"
                    >
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
