"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Search, Plus, Edit, Trash2, Users, Building2 } from "lucide-react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

import { getNumberStatusColor, getRoleColor, getRoleText, getStatusText } from "@/lib"
import { usePageInfo } from "@/hooks/use-page-info"

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

export default function UserCompanyPage() {
  const breadcrumbs = useMemo(
    () => [
      { label: "RampSync", href: "/app" },
      { label: "Vínculo Trabalhista" },
    ],
    []
  )

  usePageInfo({
    title: "Gestão de vínculos Trabalhista",
    breadcrumbs,
  })

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

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="pb-4 flex justify-end">
          <Link href="/admin/user-company/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Vínculo
            </Button>
          </Link>
        </div>
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

          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Todas as Funções" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as Funções</SelectItem>
              <SelectItem value="admin">Administrador</SelectItem>
              <SelectItem value="operator">Operador</SelectItem>
              <SelectItem value="viewer">Visualizador</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[160px]">
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
          {filteredUserCompanies.map((uc) => (
            <Card key={uc.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex flex-wrap items-center gap-2 text-sm font-semibold text-gray-800">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-gray-500" />
                        {uc.userName}
                      </div>
                      <span className="text-gray-400">→</span>
                      <div className="flex items-center gap-1">
                        <Building2 className="h-4 w-4 text-gray-500" />
                        {uc.companyName}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 text-sm">
                      <Badge className={getRoleColor(uc.role)}>{getRoleText(uc.role)}</Badge>
                      <Badge className={getNumberStatusColor(uc.status)}>{getStatusText(uc.status)}</Badge>
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

                  <div className="flex flex-wrap gap-2 justify-end sm:justify-start">
                    <Link href={`/admin/usuarios-empresas/${uc.id}/editar`}>
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

        {filteredUserCompanies.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Nenhuma relação encontrada.</p>
          </div>
        )}
      </div>
    </div>
  )
}
