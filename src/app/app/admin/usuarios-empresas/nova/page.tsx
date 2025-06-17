"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"

export default function NovaRelacaoPage() {
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-6">
            <Link href="/admin/usuarios-empresas">
              <Button variant="ghost" size="sm" className="mr-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Nova Relação Usuário x Empresa</h1>
              <p className="text-gray-600">Vincule um usuário a uma empresa</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Dados da Relação</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="userId">Usuário *</Label>
                <select
                  id="userId"
                  name="userId"
                  value={formData.userId}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Selecione um usuário...</option>
                  {users.map((user) => (
                    <option key={user.userId} value={user.userId}>
                      {user.fullName} ({user.email})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="companyId">Empresa *</Label>
                <select
                  id="companyId"
                  name="companyId"
                  value={formData.companyId}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Selecione uma empresa...</option>
                  {companies.map((company) => (
                    <option key={company.companyId} value={company.companyId}>
                      {company.companyName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="role">Função *</Label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="admin">Administrador</option>
                  <option value="operator">Operador</option>
                  <option value="viewer">Visualizador</option>
                </select>
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={1}>Ativo</option>
                  <option value={0}>Inativo</option>
                </select>
              </div>
              <div>
                <Label htmlFor="startDate">Data de Início *</Label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="endDate">Data de Fim</Label>
                <Input id="endDate" name="endDate" type="date" value={formData.endDate} onChange={handleChange} />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Link href="/admin/usuarios-empresas">
              <Button variant="outline">Cancelar</Button>
            </Link>
            <Button type="submit">
              <Save className="h-4 w-4 mr-2" />
              Salvar Relação
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
