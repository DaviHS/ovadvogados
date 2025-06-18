"use client"

import type React from "react"

import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Save, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { api } from "@/trpc/react"
import { usePageInfo } from "@/hooks/use-page-info"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

interface CompanyAssignment {
  companyId: number
  companyName: string
  role: string
  assigned: boolean
}

export default function NewUserPage() {
  const breadcrumbs = useMemo(() => [ 
    { label: "RampSync", href: "/app" }, 
    { label: "Usuários", href: "/admin/users" }, 
    { label: "Cadastro" }],
  [])

  usePageInfo({
    title: "Cadastro de Usuários",
    breadcrumbs
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

  const [companyAssignments, setCompanyAssignments] = useState<CompanyAssignment[]>([
    { companyId: 1, companyName: "TAM Linhas Aéreas", role: "operator", assigned: false },
    { companyId: 2, companyName: "GOL Linhas Aéreas", role: "operator", assigned: false },
    { companyId: 3, companyName: "Azul Linhas Aéreas", role: "operator", assigned: false },
    { companyId: 4, companyName: "LATAM Airlines", role: "operator", assigned: false },
  ])

  const createUser = api.user.create.useMutation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      alert("As senhas não coincidem!")
      return
    }

    const assignedCompanies = companyAssignments
      .filter((c) => c.assigned)
      .map((c) => ({ companyId: c.companyId, role: c.role }))

    try {
      await createUser.mutateAsync({
        ...formData,
        companies: assignedCompanies,
      })

      toast({ title: "Usuário criado com sucesso!" })
    } catch (err) {
      console.error(err)
      toastError({ title: "Ocorreu um erro ao tentar criar um usuário" })
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleCompanyAssignment = (
    companyId: number,
    field: "assigned" | "role",
    value: boolean | string
  ) => {
    setCompanyAssignments((prev) =>
      prev.map((company) =>
        company.companyId === companyId ? { ...company, [field]: value } : company
      )
    )
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto py-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Dados Pessoais</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              <div className="md:col-span-2">
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
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="email@exemplo.com"
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

          <Card>
            <CardHeader>
              <CardTitle>Configuração de Senha</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
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
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Empresas e Permissões</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {companyAssignments.map((company) => (
                  <div
                    key={company.companyId}
                    className="flex items-center justify-between p-1 border rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id={`company-${company.companyId}`}
                        checked={company.assigned}
                        onCheckedChange={(checked) =>
                          handleCompanyAssignment(company.companyId, "assigned", checked as boolean)
                        }
                      />
                      <Label htmlFor={`company-${company.companyId}`} className="font-medium">
                        {company.companyName}
                      </Label>
                    </div>
                    {company.assigned && (
                      <div className="flex items-center space-x-2">
                        <Label htmlFor={`role-${company.companyId}`} className="text-sm">
                          Função:
                        </Label>
                        <Select
                          value={company.role}
                          onValueChange={(value) =>
                            handleCompanyAssignment(company.companyId, "role", value)
                          }
                        >
                          <SelectTrigger id={`role-${company.companyId}`} className="w-full">
                            <SelectValue placeholder="Selecione a função" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Administrador</SelectItem>
                            <SelectItem value="operator">Operador</SelectItem>
                            <SelectItem value="viewer">Visualizador</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Link href="/admin/user">
              <Button
                variant="outline"
                className="text-red-600 hover:text-red-700 hover:bg-red-300 border-red-300 hover:border-red-400 transition-colors"
              >
                Cancelar
              </Button>
            </Link>
            <Button type="submit">
              <Save className="h-4 w-4 mr-2" />
              Salvar
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
