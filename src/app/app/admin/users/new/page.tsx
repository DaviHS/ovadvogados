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
import { CompanyAssignment, Permission } from "@/types/permissions"
import { useRouter } from "next/navigation"

export default function NewUserPage() {
  const router = useRouter()
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
  const { data: roles = [], isLoading: rolesLoading } = api.role.listWithPermissions.useQuery()
  const { data: companies = [], isLoading: companiesLoading } = api.company.list.useQuery()
  const createUser = api.user.create.useMutation({
    onSuccess: () => {
      toast({ title: "Usuário criado com sucesso!" })
      router.push("/admin/users")
    },
    onError: (error) => {
      toastError({ title: "Erro ao criar usuário", description: error.message })
    },
  })

  const [companyAssignments, setCompanyAssignments] = useState<CompanyAssignment[]>([])

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

    const hasCompany = companyAssignments.some((c) => c.assigned)
    if (!hasCompany) {
      toastError({ title: "Usuário deve estar vinculado a pelo menos uma empresa." })
      return
    }

    const assignedCompanies = companyAssignments
      .filter((c) => c.assigned)
      .map((c) => ({ companyId: c.companyId, roles: c.roles }))

    try {
      await createUser.mutateAsync({
        ...formData,
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
    const allRoles: number[] = []
    companyAssignments.forEach((company) => {
      if (company.assigned) {
        allRoles.push(...company.roles)
      }
    })
    return [...new Set(allRoles)]
  }

  const getAllPermissions = (): Permission[] => {
    const selectedRoleIds = getSelectedRoles()
    const allPermissions: Permission[] = []

    selectedRoleIds.forEach((roleId) => {
      const role = roles.find((r) => r.roleId === roleId)
      if (role) {
        allPermissions.push(...role.permissions)
      }
    })

    return allPermissions.filter(
      (permission, index, self) =>
        index === self.findIndex((p) => p.resource === permission.resource && p.action === permission.action),
    )
  }

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

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Permissões por Empresa
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="companies" className="space-y-6">
                <TabsList>
                  <TabsTrigger value="companies">Empresas e Funções</TabsTrigger>
                  <TabsTrigger value="preview">Resumo</TabsTrigger>
                </TabsList>

                <TabsContent value="companies">
                  <div className="space-y-4">
                    <Alert>
                      <Building2 className="h-4 w-4" />
                      <AlertDescription>
                        Todos os usuários precisam estar vinculados a pelo menos uma empresa.
                      </AlertDescription>
                    </Alert>

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
                              {roles.map((role) => (
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
