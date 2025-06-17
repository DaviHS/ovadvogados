"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Edit, Trash2, Eye, Building2 } from "lucide-react"
import Link from "next/link"

interface Company {
  companyId: number
  companyName: string
  cnpj: string
  email: string
  phone: string
  city: string
  state: string
  companyType: string
  status: number
  createdAt: string
  usersCount: number
}

export default function CompaniesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")

  const companies: Company[] = [
    {
      companyId: 1,
      companyName: "TAM Linhas Aéreas",
      cnpj: "02.012.862/0001-60",
      email: "contato@tam.com.br",
      phone: "(11) 3003-3000",
      city: "São Paulo",
      state: "SP",
      companyType: "airline",
      status: 1,
      createdAt: "2024-01-15",
      usersCount: 25,
    },
    {
      companyId: 2,
      companyName: "GOL Linhas Aéreas",
      cnpj: "06.164.253/0001-87",
      email: "contato@voegol.com.br",
      phone: "(11) 2125-3030",
      city: "São Paulo",
      state: "SP",
      companyType: "airline",
      status: 1,
      createdAt: "2024-01-10",
      usersCount: 18,
    },
    {
      companyId: 3,
      companyName: "GroundForce Handling",
      cnpj: "12.345.678/0001-90",
      email: "contato@groundforce.com.br",
      phone: "(11) 3456-7890",
      city: "Guarulhos",
      state: "SP",
      companyType: "ground_handling",
      status: 1,
      createdAt: "2024-01-05",
      usersCount: 42,
    },
    {
      companyId: 4,
      companyName: "Cargo Express",
      cnpj: "98.765.432/0001-10",
      email: "contato@cargoexpress.com.br",
      phone: "(11) 9876-5432",
      city: "São Paulo",
      state: "SP",
      companyType: "cargo",
      status: 0,
      createdAt: "2023-12-20",
      usersCount: 8,
    },
  ]

  const filteredCompanies = companies.filter((company) => {
    const matchesSearch =
      company.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.cnpj.includes(searchTerm) ||
      company.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || company.status.toString() === statusFilter
    const matchesType = typeFilter === "all" || company.companyType === typeFilter
    return matchesSearch && matchesStatus && matchesType
  })

  const getStatusColor = (status: number) => {
    return status === 1 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
  }

  const getStatusText = (status: number) => (status === 1 ? "Ativa" : "Inativa")

  const getTypeColor = (type: string) => {
    switch (type) {
      case "airline":
        return "bg-blue-100 text-blue-800"
      case "ground_handling":
        return "bg-purple-100 text-purple-800"
      case "cargo":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeText = (type: string) => {
    switch (type) {
      case "airline":
        return "Companhia Aérea"
      case "ground_handling":
        return "Ground Handling"
      case "cargo":
        return "Carga"
      default:
        return type
    }
  }

  return (
    <div className="min-h-screen ">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Gestão de Empresas</h1>
              <p className="text-muted-foreground">Gerencie empresas do sistema</p>
            </div>
            <Link href="/admin/empresas/nova">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nova Empresa
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar por nome, CNPJ ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">Todos os Tipos</option>
            <option value="airline">Companhia Aérea</option>
            <option value="ground_handling">Ground Handling</option>
            <option value="cargo">Carga</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">Todos os Status</option>
            <option value="1">Ativa</option>
            <option value="0">Inativa</option>
          </select>
        </div>

        <div className="grid gap-4">
          {filteredCompanies.map((company) => (
            <Card key={company.companyId} className="hover:shadow-sm transition-shadow">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <Building2 className="h-5 w-5 text-muted-foreground" />
                      <h3 className="text-lg font-semibold">{company.companyName}</h3>
                      <Badge className={getStatusColor(company.status)}>{getStatusText(company.status)}</Badge>
                      <Badge className={getTypeColor(company.companyType)}>{getTypeText(company.companyType)}</Badge>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                      <div>
                        <p className="font-medium text-foreground">CNPJ</p>
                        <p>{company.cnpj}</p>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Email</p>
                        <p>{company.email}</p>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Localização</p>
                        <p>
                          {company.city}/{company.state}
                        </p>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Usuários</p>
                        <p>{company.usersCount}</p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 mt-3 text-sm text-muted-foreground">
                      <div>
                        <span className="font-medium text-foreground">Telefone:</span> {company.phone}
                      </div>
                      <div>
                        <span className="font-medium text-foreground">Cadastro:</span>{" "}
                        {new Date(company.createdAt).toLocaleDateString("pt-BR")}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 md:mt-0 md:ml-4">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Link href={`/admin/empresas/${company.companyId}/editar`}>
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

        {filteredCompanies.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nenhuma empresa encontrada.</p>
          </div>
        )}
      </div>
    </div>
  )
}
