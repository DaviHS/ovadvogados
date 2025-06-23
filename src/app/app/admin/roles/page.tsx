"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Edit, Trash2, Shield, Users, Save, X } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Adicione as importações da API
import { api } from "@/trpc/react"
import { useToast } from "@/hooks/use-toast"

interface Permission {
  id: number
  name: string
  description: string
  resource: string
  action: string
}

interface Role {
  id: number
  roleId: number
  name: string
  description: string
  permissions: Permission[]
  userCount: number
}

export default function RolesManagementPage() {
  // Substitua os estados mockados por:
  const { toast } = useToast()
  const { data: roles = [], isLoading: rolesLoading, refetch: refetchRoles } = api.role.listWithPermissions.useQuery()
  const { data: permissions = [], isLoading: permissionsLoading } = api.permission.list.useQuery()

  const createRole = api.role.create.useMutation({
    onSuccess: () => {
      toast({ title: "Função criada com sucesso!" })
      refetchRoles()
      setIsCreatingRole(false)
      setRoleForm({ name: "", description: "", permissions: [] })
    },
    onError: (error) => {
      toast({ title: "Erro ao criar função", description: error.message, variant: "destructive" })
    },
  })

  const updateRole = api.role.update.useMutation({
    onSuccess: () => {
      toast({ title: "Função atualizada com sucesso!" })
      refetchRoles()
      setIsEditingRole(false)
      setSelectedRole(null)
    },
    onError: (error) => {
      toast({ title: "Erro ao atualizar função", description: error.message, variant: "destructive" })
    },
  })

  const deleteRole = api.role.delete.useMutation({
    onSuccess: () => {
      toast({ title: "Função excluída com sucesso!" })
      refetchRoles()
    },
    onError: (error) => {
      toast({ title: "Erro ao excluir função", description: error.message, variant: "destructive" })
    },
  })

  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [isEditingRole, setIsEditingRole] = useState(false)
  const [isCreatingRole, setIsCreatingRole] = useState(false)
  const [roleForm, setRoleForm] = useState({
    name: "",
    description: "",
    permissions: [] as number[],
  })

  const handleCreateRole = () => {
    setIsCreatingRole(true)
    setRoleForm({ name: "", description: "", permissions: [] })
  }

  const handleEditRole = (role: Role) => {
    setSelectedRole(role)
    setIsEditingRole(true)
    setRoleForm({
      name: role.name,
      description: role.description,
      permissions: role.permissions.map((p) => p.id),
    })
  }

  // Atualizar as funções para usar a API
  const handleSaveRole = async () => {
    try {
      if (isCreatingRole) {
        await createRole.mutateAsync({
          name: roleForm.name,
          description: roleForm.description,
          permissions: roleForm.permissions,
        })
      } else if (selectedRole) {
        await updateRole.mutateAsync({
          roleId: selectedRole.roleId,
          name: roleForm.name,
          description: roleForm.description,
          permissions: roleForm.permissions,
        })
      }
    } catch (error) {
      console.error("Erro ao salvar função:", error)
    }
  }

  // const handleDeleteRole = (roleId: number) => {
  //   if (confirm("Tem certeza que deseja excluir esta função?")) {
  //     setRoles(roles.filter((r) => r.id !== roleId))
  //   }
  // }

  const handleDeleteRole = async (roleId: number) => {
    if (confirm("Tem certeza que deseja excluir esta função?")) {
      try {
        await deleteRole.mutateAsync({ roleId })
      } catch (error) {
        console.error("Erro ao excluir função:", error)
      }
    }
  }

  const handlePermissionToggle = (permissionId: number) => {
    setRoleForm((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter((id) => id !== permissionId)
        : [...prev.permissions, permissionId],
    }))
  }

  // Atualizar o agrupamento de permissões
  const groupedPermissions = permissions.reduce(
    (acc, permission) => {
      if (!acc[permission.resource]) {
        acc[permission.resource] = []
      }
      acc[permission.resource].push(permission)
      return acc
    },
    {} as Record<string, typeof permissions>,
  )

  const getResourceLabel = (resource: string) => {
    const labels: Record<string, string> = {
      users: "Usuários",
      companies: "Empresas",
      walkarounds: "Walkarounds",
      reports: "Relatórios",
      settings: "Configurações",
    }
    return labels[resource] || resource
  }

  const getActionLabel = (action: string) => {
    const labels: Record<string, string> = {
      read: "Visualizar",
      create: "Criar",
      update: "Editar",
      delete: "Excluir",
    }
    return labels[action] || action
  }

  // Adicionar loading states
  if (rolesLoading || permissionsLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gerenciamento de Funções e Permissões</h1>
          <p className="text-gray-600">Configure funções e permissões do sistema</p>
        </div>
        <Button onClick={handleCreateRole}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Função
        </Button>
      </div>

      <Tabs defaultValue="roles" className="space-y-6">
        <TabsList>
          <TabsTrigger value="roles">Funções</TabsTrigger>
          <TabsTrigger value="permissions">Permissões</TabsTrigger>
        </TabsList>

        <TabsContent value="roles">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Lista de Funções */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Funções do Sistema
                  </CardTitle>
                  <CardDescription>Gerencie as funções e suas permissões</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {roles.map((role) => (
                      <div key={role.roleId} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold">{role.name}</h3>
                            <Badge variant="secondary">{role.userCount} usuários</Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{role.description}</p>
                          <div className="flex flex-wrap gap-1">
                            {role.permissions.slice(0, 3).map((permission) => (
                              <Badge key={permission.id} variant="outline" className="text-xs">
                                {getActionLabel(permission.action)} {getResourceLabel(permission.resource)}
                              </Badge>
                            ))}
                            {role.permissions.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{role.permissions.length - 3} mais
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleEditRole(role)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteRole(role.roleId)}
                            disabled={role.userCount > 0}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Formulário de Edição */}
            {(isCreatingRole || isEditingRole) && (
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>{isCreatingRole ? "Nova Função" : "Editar Função"}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="roleName">Nome da Função</Label>
                      <Input
                        id="roleName"
                        value={roleForm.name}
                        onChange={(e) => setRoleForm((prev) => ({ ...prev, name: e.target.value }))}
                        placeholder="Ex: Supervisor"
                      />
                    </div>
                    <div>
                      <Label htmlFor="roleDescription">Descrição</Label>
                      <Textarea
                        id="roleDescription"
                        value={roleForm.description}
                        onChange={(e) => setRoleForm((prev) => ({ ...prev, description: e.target.value }))}
                        placeholder="Descreva as responsabilidades desta função"
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label>Permissões</Label>
                      <div className="max-h-60 overflow-y-auto border rounded-lg p-3 space-y-3">
                        {Object.entries(groupedPermissions).map(([resource, resourcePermissions]) => (
                          <div key={resource}>
                            <h4 className="font-medium text-sm mb-2">{getResourceLabel(resource)}</h4>
                            <div className="space-y-2 ml-4">
                              {resourcePermissions.map((permission) => (
                                <div key={permission.id} className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`permission-${permission.id}`}
                                    checked={roleForm.permissions.includes(permission.id)}
                                    onCheckedChange={() => handlePermissionToggle(permission.id)}
                                  />
                                  <Label htmlFor={`permission-${permission.id}`} className="text-sm">
                                    {permission.name}
                                  </Label>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button onClick={handleSaveRole} className="flex-1">
                        <Save className="h-4 w-4 mr-2" />
                        Salvar
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsCreatingRole(false)
                          setIsEditingRole(false)
                          setSelectedRole(null)
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="permissions">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Permissões do Sistema
              </CardTitle>
              <CardDescription>Visualize todas as permissões disponíveis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Object.entries(groupedPermissions).map(([resource, resourcePermissions]) => (
                  <div key={resource}>
                    <h3 className="text-lg font-semibold mb-3">{getResourceLabel(resource)}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {resourcePermissions.map((permission) => (
                        <div key={permission.id} className="border rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">{permission.name}</h4>
                            <Badge variant="outline">{getActionLabel(permission.action)}</Badge>
                          </div>
                          <p className="text-sm text-gray-600">{permission.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
