"use client"

import { useMemo, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Edit, Trash2, Eye, Building2 } from "lucide-react"
import Link from "next/link"
import { getNumberStatusColor, getStatusText } from "@/lib"
import { usePageInfo } from "@/hooks/use-page-info"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { api } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function CompaniesPage() {
  const breadcrumbs = useMemo(
    () => [
      { label: "RampSync", href: "/app" },
      { label: "Empresas" },
    ],
    []
  )

  usePageInfo({
    title: "Empresas",
    breadcrumbs,
  })

  const { toast, toastError } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const { data: companies, isLoading, error, refetch } = api.company.list.useQuery()

  const deleteCompany = api.company.delete.useMutation({
    onSuccess: () => {
      toast({ description: "Empresa excluída com sucesso!" })
      refetch()
    },
    onError: (error) => {
      toastError({ title: "Erro:", description: "Erro ao excluir empresa: " + error.message })
    },
  })

  const handleDeleteCompany = async (companyId: number) => {
    try {
      await deleteCompany.mutateAsync({ companyId })
    } catch (error) {
      console.error("Erro ao excluir empresa:", error)
    }
  }

  if (isLoading) return <div>Carregando empresas...</div>
  if (error) return <div>Erro ao carregar: {error.message}</div>

  const filteredCompanies = (companies ?? []).filter((company) => {
    const status = company.status ?? 0

    const matchesSearch =
      (company.companyName ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (company.cnpj ?? "").includes(searchTerm) ||
      (company.email ?? "").toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || status.toString() === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Empresas</h1>
            <p className="text-gray-600">Gerencie empresas do sistema</p>
          </div>
          <Link href="/admin/companies/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nova Empresa
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar por nome, CNPJ ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[160px]">
              <SelectValue placeholder="Todos os Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Status</SelectItem>
              <SelectItem value="1">Ativa</SelectItem>
              <SelectItem value="0">Inativa</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Companies list */}
        <div className="grid grid-cols-1 gap-6 mb-8">
          {filteredCompanies.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Nenhuma empresa encontrada.</p>
            </div>
          )}

          {filteredCompanies.map((company) => (
            <Card key={company.companyId} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <div className="flex-1">
                    {/* Header info */}
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <Building2 className="h-5 w-5 text-muted-foreground" />
                      <h3 className="text-lg font-semibold">{company.companyName}</h3>
                      <Badge className={getNumberStatusColor(company.status!)}>{getStatusText(company.status!)}</Badge>
                    </div>

                    {/* Details grid */}
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
                        <p>{company.userCount ?? 0}</p>
                      </div>
                    </div>

                    {/* Extra info */}
                    <div className="flex flex-col sm:flex-row gap-2 mt-3 text-sm text-muted-foreground">
                      <div>
                        <span className="font-medium text-foreground">Telefone:</span> {company.phone}
                      </div>
                      <div>
                        <span className="font-medium text-foreground">Cadastro:</span>{" "}
                        {new Date(company.createdAt!).toLocaleDateString("pt-BR")}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex sm:flex-col justify-end items-end gap-2">
                    <Link href={`/admin/companies/${company.companyId}`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-green-600 hover:text-green-700 hover:bg-green-300 border-green-300 hover:border-green-400 transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href={`/admin/companies/${company.companyId}/edit`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-300 border-blue-300 hover:border-blue-400 transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-300 hover:border-red-400 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja excluir a empresa{" "}
                            <strong>{company.companyName}</strong>? Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteCompany(company.companyId)}
                            className="bg-red-600 hover:bg-red-700"
                            disabled={deleteCompany.isPending}
                          >
                            {deleteCompany.isPending ? "Excluindo..." : "Excluir"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
