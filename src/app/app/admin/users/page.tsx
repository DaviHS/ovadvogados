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
import { api } from "@/trpc/react"
import { toast } from "sonner"
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

export default function UsersPage() {
  const breadcrumbs = useMemo(() => [{ label: "RampSync", href: "/app" }, { label: "Gestão de Usuários" }], [])

  usePageInfo({
    title: "Gestão de Usuários",
    breadcrumbs,
  })

  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  
  const { data: users, isLoading, refetch } = api.user.getAll.useQuery(undefined, {
    refetchOnMount: true,
  })

  const deleteUser = api.user.delete.useMutation({
    onSuccess: () => {
      toast.success("Usuário excluído com sucesso!")
      refetch()
    },
    onError: (error) => {
      toast.error("Erro ao excluir usuário: " + error.message)
    },
  })

  const filteredUsers = useMemo(() => {
    if (!users) return []

    return users.filter((user) => {
      const matchesSearch =
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.enrollmentNumber?.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === "all" || user.status!.toString() === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [users, searchTerm, statusFilter])

  const handleDeleteUser = async (userId: number, userName: string) => {
    try {
      await deleteUser.mutateAsync({ userId })
    } catch (error) {
      console.error("Erro ao excluir usuário:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-40 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Usuários</h1>
            <p className="text-gray-600">Gerencie usuários do sistema</p>
          </div>
          <Link href="/admin/users/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Usuário
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
                      <Badge className={getNumberStatusColor(user.status!)}>{getStatusText(user!.status!)}</Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-700">
                      <div>
                        <p className="font-medium text-gray-600">Email</p>
                        <p className="break-words">{user.email}</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-600">Matrícula</p>
                        <p>{user.enrollmentNumber || "Não informado"}</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-600">Data de Cadastro</p>
                        <p>{user.createdAt ? new Date(user.createdAt).toLocaleDateString("pt-BR") : "Não informado"}</p>
                      </div>
                    </div>

                    <div>
                      <p className="font-medium text-sm text-gray-600">Funções</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {user.roles.slice(0, 3).map((role, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {role.name}
                            {role.companyName && ` (${role.companyName})`}
                          </Badge>
                        ))}
                        {user.roles.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{user.roles.length - 3} mais
                          </Badge>
                        )}
                        {user.roles.length === 0 && (
                          <span className="text-gray-400 text-xs">Nenhuma função atribuída</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex sm:flex-col justify-end items-end gap-2">
                    <Link href={`/admin/users/${user.userId}`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-green-600 hover:text-green-700 hover:bg-green-50 border-green-300 hover:border-green-400 transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>

                    <Link href={`/admin/users/${user.userId}/edit`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-300 hover:border-blue-400 transition-colors"
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
                            Tem certeza que deseja excluir o usuário <strong>{user.fullName}</strong>? Esta ação não
                            pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteUser(user.userId, user.fullName)}
                            className="bg-red-600 hover:bg-red-700"
                            disabled={deleteUser.isPending}
                          >
                            {deleteUser.isPending ? "Excluindo..." : "Excluir"}
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

        {filteredUsers.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <p className="text-gray-500">Nenhum usuário encontrado.</p>
          </div>
        )}
      </div>
    </div>
  )
}
