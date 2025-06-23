"use client"

import type React from "react"

import { useMemo, useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Save, Eye, EyeOff, Shield, Building2, Users } from "lucide-react"
import Link from "next/link"
import { api } from "@/trpc/react"
import { usePageInfo } from "@/hooks/use-page-info"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Role {
  roleId: number
  name: string
  description: string
  permissions: Array<{ resource: string; action: string }>
}

interface Company {
  companyId: number
  companyName: string
  cnpj: string
}

interface CompanyAssignment {
  companyId: number
  companyName: string
  roles: number[]
  assigned: boolean
}

export default function NewUserPage() {
  const breadcrumbs = useMemo(
    () => [{ label: "RampSync", href: "/app" }, { label: "Usuários", href: "/admin/users" }, { label: "Cadastro" }],
    [],
  )

  usePageInfo({
    title: "Cadastro de Usuários",
    breadcrumbs,
  })

  const { toast, toastError } = useToast()
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    enrollmentNumber: "",
    password: "",
    confirmPassword: "",
    status: 1,
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [globalRoles, setGlobalRoles] = useState<number[]>([])
  const { data: roles = [], isLoading: rolesLoading } = api.role.listWithPermissions.useQuery()
  const { data: companies = [], isLoading: companiesLoading } = api.company.list.useQuery()
  const createUser = api.user.create.useMutation({
    onSuccess: () => {
      toast({ title: "Usuário criado com sucesso!" })
      // Redirecionar para lista de usuários
    },
    onError: (error) => {
      toastError({ title: "Erro ao criar usuário", description: error.message })
    },
  })

  // Atualizar o estado inicial das empresas
  const [companyAssignments, setCompanyAssignments] = useState<CompanyAssignment[]>([])

  // Efeito para atualizar as empresas quando carregarem
  useEffect(() => {
    if (companies.length > 0) {
      setCompanyAssignments(
        companies.map((company) => ({
          companyId: company.companyId,
          companyName: company.companyName,
          roles: [],
          assigned: false,
        })),
      )
    }
  }, [companies])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      toastError({ title: "As senhas não coincidem!" })
      return
    }

    const assignedCompanies = companyAssignments
      .filter((c) => c.assigned)
      .map((c) => ({ companyId: c.companyId, roles: c.roles }))

    try {
      await createUser.mutateAsync({
        ...formData,
        globalRoles,
        companies: assignedCompanies,
      })
    } catch (err) {
      console.error(err)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleGlobalRoleToggle = (roleId: number) => {
    setGlobalRoles((prev) => (prev.includes(roleId) ? prev.filter((id) => id !== roleId) : [...prev, roleId]))
  }

  const handleCompanyAssignment = (companyId: number, assigned: boolean) => {
    setCompanyAssignments((prev) =>
      prev.map((company) =>
        company.companyId === companyId ? { ...company, assigned, roles: assigned ? company.roles : [] } : company,
      ),
    )
  }

  const handleCompanyRoleToggle = (companyId: number, roleId: number) => {
    setCompanyAssignments((prev) =>
      prev.map((company) =>
        company.companyId === companyId
          ? {
              ...company,
              roles: company.roles.includes(roleId)
                ? company.roles.filter((id) => id !== roleId)
                : [...company.roles, roleId],
            }
          : company,
      ),
    )
  }

  const getSelectedRoles = () => {
    const allRoles = [...globalRoles]
    companyAssignments.forEach((company) => {
      if (company.assigned) {
        allRoles.push(...company.roles)
      }
    })
    return [...new Set(allRoles)]
  }

  const getAllPermissions = () => {
    const selectedRoleIds = getSelectedRoles()
    const allPermissions: Array<{ resource: string; action: string }> = []

    selectedRoleIds.forEach((roleId) => {
      const role = roles.find((r) => r.roleId === roleId)
      if (role) {
        allPermissions.push(...role.permissions.map((p) => ({ resource: p.resource, action: p.action })))
      }
    })

    // Remove duplicatas
    const uniquePermissions = allPermissions.filter(
      (permission, index, self) =>
        index === self.findIndex((p) => p.resource === permission.resource && p.action === permission.action),
    )

    return uniquePermissions
  }

  const isAdminRole = globalRoles.some((roleId) => {
    const role = roles.find((r) => r.roleId === roleId)
    return role?.name === "Super Administrador" || role?.name === "Administrador"
  })

  if (rolesLoading || companiesLoading) {
    return (
      <div className="max-w-7xl mx-auto py-4">
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
    )
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto py-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Dados Pessoais */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Dados Pessoais
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="fullName">Nome Completo *</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Nome completo do usuário"
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="email@exemplo.com"
                  required
                />
              </div>
              <div>
                <Label htmlFor="enrollmentNumber">Matrícula *</Label>
                <Input
                  id="enrollmentNumber"
                  name="enrollmentNumber"
                  value={formData.enrollmentNumber}
                  onChange={handleChange}
                  placeholder="EMP001"
                  required
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status.toString()}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      status: Number(value),
                    }))
                  }
                >
                  <SelectTrigger id="status" className="w-full">
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Ativo</SelectItem>
                    <SelectItem value="0">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Configuração de Senha */}
          <Card>
            <CardHeader>
              <CardTitle>Configuração de Senha</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="password">Senha *</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Digite a senha"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirmar Senha *</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirme a senha"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Funções e Permissões */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Funções e Permissões
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="global" className="space-y-6">
                <TabsList>
                  <TabsTrigger value="global">Funções Globais</TabsTrigger>
                  <TabsTrigger value="companies">Funções por Empresa</TabsTrigger>
                  <TabsTrigger value="preview">Resumo de Permissões</TabsTrigger>
                </TabsList>

                <TabsContent value="global">
                  <div className="space-y-4">
                    <div className="text-sm text-gray-600 mb-4">
                      Funções globais se aplicam a todo o sistema, independente da empresa.
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {roles.map((role) => (
                        <div key={role.roleId} className="border rounded-lg p-4">
                          <div className="flex items-start space-x-3">
                            <Checkbox
                              id={`global-role-${role.roleId}`}
                              checked={globalRoles.includes(role.roleId)}
                              onCheckedChange={() => handleGlobalRoleToggle(role.roleId)}
                            />
                            <div className="flex-1">
                              <Label htmlFor={`global-role-${role.roleId}`} className="font-medium">
                                {role.name}
                              </Label>
                              <p className="text-sm text-gray-600 mt-1">{role.description}</p>
                              <div className="flex flex-wrap gap-1 mt-2">
                                {role.permissions.slice(0, 3).map((permission, index: number) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {permission.action} {permission.resource}
                                  </Badge>
                                ))}
                                {role.permissions.length > 3 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{role.permissions.length - 3} mais
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="companies">
                  <div className="space-y-4">
                    {!isAdminRole && (
                      <Alert>
                        <Building2 className="h-4 w-4" />
                        <AlertDescription>
                          Selecione as empresas e funções específicas para este usuário. Usuários não-administradores
                          precisam estar vinculados a pelo menos uma empresa.
                        </AlertDescription>
                      </Alert>
                    )}

                    {companyAssignments.map((company) => (
                      <div key={company.companyId} className="border rounded-lg p-4">
                        <div className="flex items-center space-x-3 mb-4">
                          <Checkbox
                            id={`company-${company.companyId}`}
                            checked={company.assigned}
                            onCheckedChange={(checked) =>
                              handleCompanyAssignment(company.companyId, checked as boolean)
                            }
                          />
                          <Label htmlFor={`company-${company.companyId}`} className="font-medium">
                            {company.companyName}
                          </Label>
                        </div>

                        {company.assigned && (
                          <div className="ml-6 space-y-3">
                            <Label className="text-sm font-medium">Funções nesta empresa:</Label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {roles
                                .filter((role) => role.name !== "Super Administrador" && role.name !== "Administrador")
                                .map((role) => (
                                  <div key={role.roleId} className="flex items-center space-x-2">
                                    <Checkbox
                                      id={`company-${company.companyId}-role-${role.roleId}`}
                                      checked={company.roles.includes(role.roleId)}
                                      onCheckedChange={() => handleCompanyRoleToggle(company.companyId, role.roleId)}
                                    />
                                    <Label
                                      htmlFor={`company-${company.companyId}-role-${role.roleId}`}
                                      className="text-sm"
                                    >
                                      {role.name}
                                    </Label>
                                  </div>
                                ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="preview">
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium mb-3">Funções Selecionadas</h3>
                      <div className="flex flex-wrap gap-2">
                        {getSelectedRoles().map((roleId) => {
                          const role = roles.find((r) => r.roleId === roleId)
                          return role ? (
                            <Badge key={roleId} variant="secondary">
                              {role.name}
                            </Badge>
                          ) : null
                        })}
                        {getSelectedRoles().length === 0 && (
                          <p className="text-sm text-gray-500">Nenhuma função selecionada</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium mb-3">Permissões Resultantes</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {getAllPermissions().map((permission, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <span className="text-sm capitalize">{permission.resource}</span>
                            <Badge variant="outline" className="text-xs">
                              {permission.action}
                            </Badge>
                          </div>
                        ))}
                        {getAllPermissions().length === 0 && (
                          <p className="text-sm text-gray-500 col-span-full">Nenhuma permissão atribuída</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium mb-3">Empresas com Acesso</h3>
                      <div className="space-y-2">
                        {isAdminRole && (
                          <div className="p-2 bg-blue-50 rounded border-l-4 border-blue-400">
                            <p className="text-sm font-medium text-blue-800">
                              Acesso a todas as empresas (Administrador)
                            </p>
                          </div>
                        )}
                        {companyAssignments
                          .filter((c) => c.assigned)
                          .map((company) => (
                            <div key={company.companyId} className="p-2 bg-gray-50 rounded">
                              <p className="text-sm font-medium">{company.companyName}</p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {company.roles.map((roleId) => {
                                  const role = roles.find((r) => r.roleId === roleId)
                                  return role ? (
                                    <Badge key={roleId} variant="outline" className="text-xs">
                                      {role.name}
                                    </Badge>
                                  ) : null
                                })}
                              </div>
                            </div>
                          ))}
                        {!isAdminRole && companyAssignments.filter((c) => c.assigned).length === 0 && (
                          <p className="text-sm text-gray-500">Nenhuma empresa selecionada</p>
                        )}
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Link href="/admin/users">
              <Button
                variant="outline"
                className="text-red-600 hover:text-red-700 hover:bg-red-300 border-red-300 hover:border-red-400 transition-colors"
              >
                Cancelar
              </Button>
            </Link>
            <Button type="submit">
              <Save className="h-4 w-4 mr-2" />
              Salvar Usuário
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
