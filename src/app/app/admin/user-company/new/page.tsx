"use client"

import type React from "react"

import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Save } from "lucide-react"
import Link from "next/link"
import { usePageInfo } from "@/hooks/use-page-info"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function NewUserCompanyPage() {
  const breadcrumbs = useMemo(() => [ 
    { label: "RampSync", href: "/app" }, 
    { label: "Vínculo Trabalhista", href: "/admin/user-company" },
    { label: "Novo" }],
  []);
          
  usePageInfo({
    title: "Realizar vínculo trabalhista",
    breadcrumbs
  })

  const [formData, setFormData] = useState({
    userId: "",
    companyId: "",
    role: "operator",
    status: 1,
    startDate: "",
    endDate: "",
  })

  // Mock data - substituir por dados reais do banco
  const users = [
    { userId: 1, fullName: "João Silva Santos", email: "joao.silva@email.com" },
    { userId: 2, fullName: "Maria Costa Oliveira", email: "maria.costa@email.com" },
    { userId: 3, fullName: "Pedro Lima", email: "pedro.lima@email.com" },
  ]

  const companies = [
    { companyId: 1, companyName: "TAM Linhas Aéreas" },
    { companyId: 2, companyName: "GOL Linhas Aéreas" },
    { companyId: 3, companyName: "GroundForce Handling" },
    { companyId: 4, companyName: "Cargo Express" },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Dados da relação:", formData)
    alert("Relação criada com sucesso!")
  }

  const handleChange = (name: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto sm:px-2 lg:px-4 py-4 flex justify-end">
        <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle>Dados do Vínculo</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="userId">Usuário *</Label>
                <Select
                  value={formData.userId.toString()}
                  onValueChange={(value) => handleChange("userId", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione um usuário..." />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user.userId} value={user.userId.toString()}>
                        {user.fullName} ({user.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="companyId">Empresa *</Label>
                <Select
                  value={formData.companyId.toString()}
                  onValueChange={(value) => handleChange("companyId", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione uma empresa..." />
                  </SelectTrigger>
                  <SelectContent>
                    {companies.map((company) => (
                      <SelectItem key={company.companyId} value={company.companyId.toString()}>
                        {company.companyName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="role">Função *</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => handleChange("role", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione uma função..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrador</SelectItem>
                    <SelectItem value="operator">Operador</SelectItem>
                    <SelectItem value="viewer">Visualizador</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status.toString()}
                  onValueChange={(value) => handleChange("status", Number(value))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione o status..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Ativo</SelectItem>
                    <SelectItem value="0">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="startDate">Data de Início *</Label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleChange("startDate", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="endDate">Data de Fim</Label>
                <Input
                  id="endDate"
                  name="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleChange("endDate", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Link href="/admin/user-company">
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
