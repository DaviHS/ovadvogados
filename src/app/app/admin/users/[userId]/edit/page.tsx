"use client"

import type React from "react"

import { use, useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Save, X, Plus } from "lucide-react"
import Link from "next/link"
import { api } from "@/trpc/react"
import { usePageInfo } from "@/hooks/use-page-info"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Props {
  params: Promise<{ userId: string }>
}

export default function EditUserPage({ params }: Props) {
  const { userId } = use(params)
  const userIdNum = Number.parseInt(userId)
  const router = useRouter()

  const { data: user, isLoading } = api.user.getById.useQuery({ userId: userIdNum }, { enabled: !isNaN(userIdNum) })
  const { data: roles } = api.role.list.useQuery()
  const { data: companies } = api.company.list.useQuery()

  const updateUser = api.user.update.useMutation({
    onSuccess: () => {
      toast.success("Usuário atualizado com sucesso!")
      router.push(`/admin/users/${userIdNum}`)
    },
    onError: (error) => {
      toast.error("Erro ao atualizar usuário: " + error.message)
    },
  })

  const assignRole = api.userRole.assign.useMutation({
    onSuccess: () => {
      toast.success("Função atribuída com sucesso!")
      refetchUser()
    },
    onError: (error) => {
      toast.error("Erro ao atribuir função: " + error.message)
    },
  })

  const removeRole = api.userRole.remove.useMutation({
    onSuccess: () => {
      toast.success("Função removida com sucesso!")
      refetchUser()
    },
    onError: (error) => {
      toast.error("Erro ao remover função: " + error.message)
    },
  })

  const { refetch: refetchUser } = api.user.getById.useQuery({ userId: userIdNum })

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    enrollmentNumber: "",
    status: 1,
  })

  const [newRole, setNewRole] = useState({
    roleId: "",
    companyId: "",
  })

  // Atualizar form quando user carregar
  useMemo(() => {
    if (user) {
      setFormData({
        fullName: user.fullName,
        email: user.email,
        enrollmentNumber: user.enrollmentNumber || "",
        status: Number(user.status),
      })
    }
  }, [user])

  const breadcrumbs = useMemo(
    () => [
      { label: "RampSync", href: "/app" },
      { label: "Usuários", href: "/admin/users" },
      { label: user?.fullName || "Carregando...", href: `/admin/users/${userIdNum}` },
      { label: "Editar" },
    ],
    [user?.fullName, userIdNum],
  )

  usePageInfo({
    title: `Editar ${user?.fullName || "Usuário"}`,
    breadcrumbs,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await updateUser.mutateAsync({
        userId: userIdNum,
        ...formData,
      })
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error)
    }
  }

  const handleAssignRole = async () => {
    if (!newRole.roleId) {
      toast.error("Selecione uma função")
      return
    }

    try {
      await assignRole.mutateAsync({
        userId: userIdNum,
        roleId: Number.parseInt(newRole.roleId),
        companyId: newRole.companyId ? Number.parseInt(newRole.companyId) : null,
      })
      setNewRole({ roleId: "", companyId: "" })
    } catch (error) {
      console.error("Erro ao atribuir função:", error)
    }
  }

  const handleRemoveRole = async (roleId: number, companyId: number | null) => {
    try {
      await removeRole.mutateAsync({
        userId: userIdNum,
        roleId,
        companyId,
      })
    } catch (error) {
      console.error("Erro ao remover função:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="space-y-6">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="h-40 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Usuário não encontrado</h2>
            <p className="text-gray-600 mb-4">O usuário solicitado não existe ou foi removido.</p>
            <Link href="/admin/users">
              <Button>Voltar para Usuários</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const globalRoles = user.roles.filter((role) => !role.companyId)
  const companyRoles = user.roles.filter((role) => role.companyId)

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">Editar {user.fullName}</h1>
            <p className="text-gray-600">Atualize as informações do usuário</p>
          </div>
        </div>

        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList>
            <TabsTrigger value="basic">Informações Básicas</TabsTrigger>
            <TabsTrigger value="roles">Funções e Permissões</TabsTrigger>
          </TabsList>

          <TabsContent value="basic">
            <Card>
              <CardHeader>
                <CardTitle>Informações Básicas</CardTitle>
                <CardDescription>Atualize os dados básicos do usuário</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="fullName">Nome Completo *</Label>
                      <Input
                        id="fullName"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="enrollmentNumber">Matrícula</Label>
                      <Input
                        id="enrollmentNumber"
                        value={formData.enrollmentNumber}
                        onChange={(e) => setFormData({ ...formData, enrollmentNumber: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="status">Status</Label>
                      <Select
                        value={formData.status.toString()}
                        onValueChange={(value) => setFormData({ ...formData, status: Number.parseInt(value) })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Ativo</SelectItem>
                          <SelectItem value="0">Inativo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button type="submit" disabled={updateUser.isPending}>
                      <Save className="h-4 w-4 mr-2" />
                      {updateUser.isPending ? "Salvando..." : "Salvar Alterações"}
                    </Button>
                    <Link href={`/admin/users/${userIdNum}`}>
                      <Button type="button" variant="outline">
                        Cancelar
                      </Button>
                    </Link>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="roles">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Adicionar Nova Função</CardTitle>
                  <CardDescription>Atribua uma nova função ao usuário</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="w-full md:w-auto">
                      <Label htmlFor="roleSelect">Função</Label>
                      <Select
                        value={newRole.roleId}
                        onValueChange={(value) => setNewRole({ ...newRole, roleId: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma função" />
                        </SelectTrigger>
                        <SelectContent>
                          {roles?.map((role) => (
                            <SelectItem key={role.roleId} value={role.roleId.toString()}>
                              {role.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="w-full md:w-auto">
                      <Label htmlFor="companySelect">Empresa (Opcional)</Label>
                      <Select
                        value={newRole.companyId}
                        onValueChange={(value) => setNewRole({ ...newRole, companyId: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Função global" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="full">Função Global</SelectItem>
                          {companies?.map((company) => (
                            <SelectItem key={company.companyId} value={company.companyId.toString()}>
                              {company.companyName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="w-full md:w-auto">
                      <Button
                        onClick={handleAssignRole}
                        disabled={assignRole.isPending}
                        className="w-full md:w-auto"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        {assignRole.isPending ? "Adicionando..." : "Adicionar"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Funções Atuais */}
              <Card>
                <CardHeader>
                  <CardTitle>Funções Atuais</CardTitle>
                  <CardDescription>Funções atribuídas ao usuário</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Funções Globais */}
                  <div>
                    <h3 className="font-medium mb-3">Funções Globais</h3>
                    <div className="space-y-2">
                      {globalRoles.map((role) => (
                        <div
                          key={`global-${role.roleId}`}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <Badge variant="default">{role.role.name}</Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoveRole(role.roleId, null)}
                            disabled={removeRole.isPending}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      {globalRoles.length === 0 && (
                        <p className="text-sm text-gray-500">Nenhuma função global atribuída</p>
                      )}
                    </div>
                  </div>

                  {/* Funções por Empresa */}
                  <div>
                    <h3 className="font-medium mb-3">Funções por Empresa</h3>
                    <div className="space-y-3">
                      {companyRoles.length > 0 ? (
                        Object.entries(
                          companyRoles.reduce(
                            (acc, role) => {
                              const companyName = role.company?.companyName || "Empresa não encontrada"
                              if (!acc[companyName]) {
                                acc[companyName] = []
                              }
                              acc[companyName].push(role)
                              return acc
                            },
                            {} as Record<string, typeof companyRoles>,
                          ),
                        ).map(([companyName, roles]) => (
                          <div key={companyName} className="border rounded-lg p-4">
                            <h4 className="font-medium mb-2">{companyName}</h4>
                            <div className="space-y-2">
                              {roles.map((role) => (
                                <div
                                  key={`company-${role.roleId}-${role.companyId}`}
                                  className="flex items-center justify-between p-2 bg-gray-50 rounded"
                                >
                                  <Badge variant="outline">{role.role.name}</Badge>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleRemoveRole(role.roleId, role.companyId)}
                                    disabled={removeRole.isPending}
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500">Nenhuma função por empresa atribuída</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
