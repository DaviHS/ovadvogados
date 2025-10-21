"use client"

import type React from "react"
import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Save } from "lucide-react"
import Link from "next/link"
import { usePageInfo } from "@/hooks/use-page-info"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { formatCNPJ, formatPhone, formatZipCode } from "@/lib"
import { api } from "@/trpc/react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

export default function NewCompanyPage() {
  const breadcrumbs = useMemo(() => [
    { label: "RampSync", href: "/app" },
    { label: "Empresas", href: "/admin/companies" },
    { label: "Cadastro" }
  ], []);

  usePageInfo({
    title: "Cadastro de Empresas",
    breadcrumbs
  })

  const { toast, toastError } = useToast()
  const createCompany = api.company.create.useMutation()
  const router = useRouter()

  const [formData, setFormData] = useState({
    companyName: "",
    cnpj: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    companyType: "airline",
    status: 1,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await createCompany.mutateAsync(formData)
      toast({ title: "Empresa cadastrada com sucesso!" })
      router.push("/admin/companies")
    } catch (err) {
      console.error(err)
      toastError({ title: "Erro ao cadastrar empresa" })
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto py-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Dados da Empresa</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="companyName">Nome da Empresa *</Label>
                <Input
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="Nome da empresa"
                  required
                />
              </div>

              <div>
                <Label htmlFor="cnpj">CNPJ *</Label>
                <Input
                  id="cnpj"
                  name="cnpj"
                  value={formData.cnpj}
                  onChange={(e) => setFormData({ ...formData, cnpj: formatCNPJ(e.target.value) })}
                  placeholder="00.000.000/0000-00"
                  maxLength={18}
                  required
                />
              </div>

              <div>
                <Label>Tipo de Empresa *</Label>
                <Select value={formData.companyType} onValueChange={(value) => setFormData({ ...formData, companyType: value })}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="airline">Companhia Aérea</SelectItem>
                    <SelectItem value="ground_handling">Ground Handling</SelectItem>
                    <SelectItem value="cargo">Carga</SelectItem>
                    <SelectItem value="maintenance">Manutenção</SelectItem>
                    <SelectItem value="catering">Catering</SelectItem>
                    <SelectItem value="fuel">Combustível</SelectItem>
                    <SelectItem value="security">Segurança</SelectItem>
                    <SelectItem value="other">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="contato@empresa.com.br"
                />
              </div>

              <div>
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: formatPhone(e.target.value) })}
                  placeholder="(11) 99999-9999"
                  maxLength={15}
                />
              </div>

              <div>
                <Label>Status</Label>
                <Select value={String(formData.status)} onValueChange={(value) => setFormData({ ...formData, status: Number(value) })}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Ativa</SelectItem>
                    <SelectItem value="0">Inativa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Endereço</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-3">
                <Label htmlFor="address">Endereço</Label>
                <Textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Rua, número, complemento"
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="city">Cidade</Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="São Paulo"
                />
              </div>

              <div>
                <Label>Estado</Label>
                <Select value={formData.state} onValueChange={(value) => setFormData({ ...formData, state: value })}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione o estado" />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA",
                      "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN",
                      "RS", "RO", "RR", "SC", "SP", "SE", "TO",
                    ].map((uf) => (
                      <SelectItem key={uf} value={uf}>{uf}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="zipCode">CEP</Label>
                <Input
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={(e) => setFormData({ ...formData, zipCode: formatZipCode(e.target.value) })}
                  placeholder="00000-000"
                  maxLength={9}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Link href="/admin/companies">
              <Button
                variant="outline"
                className="text-red-600 hover:text-red-700 hover:bg-red-300 border-red-300 hover:border-red-400 transition-colors"
              >
                Cancelar
              </Button>
            </Link>
            <Button type="submit">
              <Save className="h-4 w-4 mr-2" />
              Salvar Empresa
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
