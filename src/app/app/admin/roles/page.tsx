"use client"

import { useState, useCallback, useMemo } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Plus,
  Edit,
  Trash2,
  Shield,
  Users,
  Save,
  X,
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { api } from "@/trpc/react"
import { useToast } from "@/hooks/use-toast"

type Permission = {
  permissionId: number
  name: string
  description: string | null
  resource: string
  action: string
}

type RoleWithPermissions = {
  roleId: number
  name: string
  description: string
  createdAt: Date
  updatedAt: Date
  userCount: number
  permissions: Permission[]
}

type RoleForm = {
  name: string
  description: string
  permissions: number[]
}

const RESOURCE_LABELS: Record<string, string> = {
  users: "Usuários",
  companies: "Empresas",
  walkarounds: "Walkarounds",
  reports: "Relatórios",
  settings: "Configurações",
}

const ACTION_LABELS: Record<string, string> = {
  read: "Visualizar",
  create: "Criar",
  update: "Editar",
  delete: "Excluir",
}

function getResourceLabel(resource: string) {
  return RESOURCE_LABELS[resource] || resource
}

function getActionLabel(action: string) {
  return ACTION_LABELS[action] || action
}

export default function RolesManagementPage() {
  const { toast } = useToast()

  // Queries
  const {
    data: roles = [],
    isLoading: rolesLoading,
    refetch: refetchRoles,
  } = api.role.listWithPermissions.useQuery()
  const {
    data: permissions = {} as Record<string, Permission[]>,
    isLoading: permissionsLoading,
  } = api.permission.list.useQuery()

  console.log('Roles:', roles)

  // Mutations
  const createRole = api.role.create.useMutation({
    onSuccess: () => {
      toast({ title: "Função criada com sucesso!" })
      refetchRoles()
      resetForm()
    },
    onError: (error) => {
      toast({
        title: "Erro ao criar função",
        description: error.message,
        variant: "destructive",
      })
    },
  })

  const updateRole = api.role.update.useMutation({
    onSuccess: () => {
      toast({ title: "Função atualizada com sucesso!" })
      refetchRoles()
      resetForm()
    },
    onError: (error) => {
      toast({
        title: "Erro ao atualizar função",
        description: error.message,
        variant: "destructive",
      })
    },
  })

  const deleteRole = api.role.delete.useMutation({
    onSuccess: () => {
      toast({ title: "Função excluída com sucesso!" })
      refetchRoles()
    },
    onError: (error) => {
      toast({
        title: "Erro ao excluir função",
        description: error.message,
        variant: "destructive",
      })
    },
  })

  // States
  const [selectedRole, setSelectedRole] = useState<RoleWithPermissions | null>(
    null,
  )
  const [isEditing, setIsEditing] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [roleForm, setRoleForm] = useState<RoleForm>({
    name: "",
    description: "",
    permissions: [],
  })

  // Handlers
  const resetForm = useCallback(() => {
    setIsCreating(false)
    setIsEditing(false)
    setSelectedRole(null)
    setRoleForm({ name: "", description: "", permissions: [] })
  }, [])

  const handleCreateClick = useCallback(() => {
    resetForm()
    setIsCreating(true)
  }, [resetForm])

  const handleEditClick = useCallback(
    (role: RoleWithPermissions) => {
      setSelectedRole(role)
      setRoleForm({
        name: role.name,
        description: role.description,
        permissions: role.permissions.map((p) => p.permissionId),
      })
      setIsEditing(true)
      setIsCreating(false)
    },
    [],
  )

  const handlePermissionToggle = useCallback((permissionId: number) => {
    setRoleForm((prev) => {
      const hasPermission = prev.permissions.includes(permissionId)
      return {
        ...prev,
        permissions: hasPermission
          ? prev.permissions.filter((id) => id !== permissionId)
          : [...prev.permissions, permissionId],
      }
    })
  }, [])

  const handleSave = useCallback(async () => {
    try {
      if (isCreating) {
        await createRole.mutateAsync(roleForm)
      } else if (selectedRole) {
        await updateRole.mutateAsync({ roleId: selectedRole.roleId, ...roleForm })
      }
    } catch (error) {
      console.error("Erro ao salvar função:", error)
    }
  }, [createRole, updateRole, isCreating, roleForm, selectedRole])

  const handleDelete = useCallback(
    async (roleId: number) => {
      if (confirm("Tem certeza que deseja excluir esta função?")) {
        try {
          await deleteRole.mutateAsync({ roleId })
        } catch (error) {
          console.error("Erro ao excluir função:", error)
        }
      }
    },
    [deleteRole],
  )

  const groupedPermissions = useMemo(() => {
    if (!Array.isArray(permissions)) return {}

    return permissions.reduce((acc, permission) => {
      const { resource } = permission
      if (!acc[resource]) {
        acc[resource] = []
      }
      acc[resource].push(permission)
      return acc
    }, {} as Record<string, Permission[]>)
  }, [permissions])

  if (rolesLoading || permissionsLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Components para melhorar legibilidade
  const RoleItem = ({
    role,
    onEdit,
    onDelete,
  }: {
    role: RoleWithPermissions
    onEdit: (role: RoleWithPermissions) => void
    onDelete: (roleId: number) => void
  }) => (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <h3 className="font-semibold">{role.name}</h3>
          <Badge variant="secondary">{role.userCount} usuários</Badge>
        </div>
        <p className="text-sm text-gray-600 mb-2">{role.description}</p>
        <div className="flex flex-wrap gap-1">
          {role.permissions.slice(0, 3).map((permission) => (
            <Badge key={permission.permissionId} variant="outline" className="text-xs">
              {permission.name}
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
        <Button variant="outline" size="sm" onClick={() => onEdit(role)}>
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDelete(role.roleId)}
          disabled={role.userCount > 0}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )

  const RoleForm = () => (
    <Card>
      <CardHeader>
        <CardTitle>{isCreating ? "Nova Função" : "Editar Função"}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="roleName">Nome</Label>
          <Input
            id="roleName"
            value={roleForm.name}
            onChange={(e) => setRoleForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="Ex: Administrador"
          />
        </div>
        <div>
          <Label htmlFor="roleDescription">Descrição</Label>
          <Textarea
            id="roleDescription"
            value={roleForm.description}
            onChange={(e) => setRoleForm((f) => ({ ...f, description: e.target.value }))}
            placeholder="Descrição da função"
          />
        </div>
        <div>
          <Label>Permissões</Label>
          <Tabs defaultValue={Object.keys(groupedPermissions)[0] || ""}>
            <TabsList className="mb-2">
              {Object.keys(groupedPermissions).map((resource) => (
                <TabsTrigger key={resource} value={resource}>
                  {getResourceLabel(resource)}
                </TabsTrigger>
              ))}
            </TabsList>
            {Object.entries(groupedPermissions).map(([resource, permsObj]) => {
  const permsArray = Object.values(permsObj) as Permission[]  // converte objeto em array
  return (
    <TabsContent key={resource} value={resource} className="space-y-1">
      {permsArray.map((permission) => (
        <div key={permission.permissionId} className="flex items-center gap-2">
          <Checkbox
            id={`perm-${permission.permissionId}`}
            checked={roleForm.permissions.includes(permission.permissionId)}
            onCheckedChange={() => handlePermissionToggle(permission.permissionId)}
          />
          <Label htmlFor={`perm-${permission.permissionId}`} className="cursor-pointer">
            {permission.name}
          </Label>
        </div>
      ))}
    </TabsContent>
  )
})}

        </Tabs>
      </div>
      <div className="flex gap-2">
        <Button onClick={resetForm} variant="secondary">
          <X className="mr-2 h-4 w-4" />
          Cancelar
        </Button>

        <Button
          onClick={handleSave}
          disabled={!roleForm.name || roleForm.permissions.length === 0}
        >
          <Save size={16} className="mr-2" />
          Salvar
        </Button>
      </div>
    </CardContent>
  </Card>
)


  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <header className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gerenciar Funções</h1>
        <Button onClick={handleCreateClick}>
          <Plus size={16} className="mr-2" />
          Nova Função
        </Button>
      </header>

      {isCreating || isEditing ? (
        <RoleForm />
      ) : (
        <div className="space-y-4">
          {roles.map((role) => (
            <RoleItem
              key={role.roleId}
              role={role}
              onEdit={handleEditClick}
              onDelete={handleDelete}
            />
          ))}
          {roles.length === 0 && (
            <p className="text-gray-500">Nenhuma função cadastrada.</p>
          )}
        </div>
      )}
    </main>
  )
}
