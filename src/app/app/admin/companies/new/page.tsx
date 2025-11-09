// src/app/app/admin/companies/new/page.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Save, Loader2 } from "lucide-react"
import Link from "next/link"
import { usePageInfo } from "@/hooks/use-page-info"
import { api } from "@/lib/api"
import { companySchema, type CompanyData } from "@/validators/company"
import z from "zod"

export default function NewCompanyPage() {
  const router = useRouter()
  
  usePageInfo({
    title: "Cadastrar Empresa",
    breadcrumbs: [
      { label: "RampSync", href: "/app" },
      { label: "Admin", href: "/app/admin" },
      { label: "Empresas", href: "/app/admin/companies" },
      { label: "Nova Empresa" }
    ]
  })

  const [formData, setFormData] = useState<CompanyData>({
    companyName: "",
    cnpj: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    companyType: "",
    status: 1,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const createMutation = api.admin.company.create.useMutation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    try {
      // Validar dados
      companySchema.parse(formData)

      // Criar empresa
      await createMutation.mutateAsync(formData)

      // Redirecionar para a listagem
      router.push("/app/admin/companies")
      router.refresh()
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {}
        error.errors.forEach((err) => {
          if (err.path) {
            fieldErrors[err.path[0]] = err.message
          }
        })
        setErrors(fieldErrors)
      } else {
        setErrors({ general: "Erro ao criar empresa. Tente novamente." })
      }
    }
  }

  const handleInputChange = (field: keyof CompanyData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header simplificado - apenas o título */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Cadastrar Nova Empresa</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Informações da Empresa</CardTitle>
              <CardDescription>Preencha os dados da empresa para cadastrá-la no sistema</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {errors.general && (
                <div className="p-4 text-sm text-red-500 bg-red-50 rounded-lg">
                  {errors.general}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="companyName" className="block text-sm font-medium">
                    Nome da Empresa *
                  </label>
                  <Input
                    id="companyName"
                    value={formData.companyName}
                    onChange={(e) => handleInputChange("companyName", e.target.value)}
                    placeholder="Digite o nome da empresa"
                    className={errors.companyName ? "border-red-500" : ""}
                  />
                  {errors.companyName && (
                    <p className="text-sm text-red-500">{errors.companyName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="cnpj" className="block text-sm font-medium">
                    CNPJ
                  </label>
                  <Input
                    id="cnpj"
                    value={formData.cnpj}
                    onChange={(e) => handleInputChange("cnpj", e.target.value)}
                    placeholder="00.000.000/0000-00"
                    className={errors.cnpj ? "border-red-500" : ""}
                  />
                  {errors.cnpj && (
                    <p className="text-sm text-red-500">{errors.cnpj}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="empresa@exemplo.com"
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="phone" className="block text-sm font-medium">
                    Telefone
                  </label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="(11) 99999-9999"
                    className={errors.phone ? "border-red-500" : ""}
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-500">{errors.phone}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="companyType" className="block text-sm font-medium">
                    Tipo de Empresa
                  </label>
                  <Select
                    value={formData.companyType}
                    onValueChange={(value) => handleInputChange("companyType", value)}
                  >
                    <SelectTrigger className={errors.companyType ? "border-red-500" : ""}>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="airline">Companhia Aérea</SelectItem>
                      <SelectItem value="handler">Handler</SelectItem>
                      <SelectItem value="maintenance">Manutenção</SelectItem>
                      <SelectItem value="supplier">Fornecedor</SelectItem>
                      <SelectItem value="other">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.companyType && (
                    <p className="text-sm text-red-500">{errors.companyType}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="status" className="block text-sm font-medium">
                    Status
                  </label>
                  <Select
                    value={formData.status.toString()}
                    onValueChange={(value) => handleInputChange("status", parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Ativa</SelectItem>
                      <SelectItem value="0">Inativa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium">
                    Endereço
                  </label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    placeholder="Digite o endereço completo"
                    rows={3}
                    className={errors.address ? "border-red-500" : ""}
                  />
                  {errors.address && (
                    <p className="text-sm text-red-500">{errors.address}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="city" className="block text-sm font-medium">
                    Cidade
                  </label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    placeholder="Digite a cidade"
                    className={errors.city ? "border-red-500" : ""}
                  />
                  {errors.city && (
                    <p className="text-sm text-red-500">{errors.city}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="state" className="block text-sm font-medium">
                    Estado (UF)
                  </label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => handleInputChange("state", e.target.value.toUpperCase())}
                    placeholder="SP"
                    maxLength={2}
                    className={errors.state ? "border-red-500" : ""}
                  />
                  {errors.state && (
                    <p className="text-sm text-red-500">{errors.state}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="zipCode" className="block text-sm font-medium">
                    CEP
                  </label>
                  <Input
                    id="zipCode"
                    value={formData.zipCode}
                    onChange={(e) => handleInputChange("zipCode", e.target.value)}
                    placeholder="00000-000"
                    className={errors.zipCode ? "border-red-500" : ""}
                  />
                  {errors.zipCode && (
                    <p className="text-sm text-red-500">{errors.zipCode}</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <Link href="/app/admin/companies">
                  <Button type="button" variant="outline">
                    Cancelar
                  </Button>
                </Link>
                <Button 
                  type="submit" 
                  disabled={createMutation.isPending}
                  className="min-w-[150px]"
                >
                  {createMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Cadastrando...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Cadastrar Empresa
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  )
}