"use client"

import { useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { companyUpdateSchema, type CompanyUpdateSchema } from "@/validators/company"
import { usePageInfo } from "@/hooks/use-page-info"
import { api } from "@/trpc/react"
import { useToast } from "@/hooks/use-toast"

export default function CompanyEditPage() {
  const router = useRouter()
  const { companyId } = useParams<{ companyId: string }>()
  const numericCompanyId = Number(companyId)
  const { toast, toastError } = useToast()

  const form = useForm<CompanyUpdateSchema>({
    resolver: zodResolver(companyUpdateSchema),
    defaultValues: {
      companyId: numericCompanyId,
      status: 1,
    },
  })

  const { data: company, isLoading } = api.company.getById.useQuery(
    { companyId: numericCompanyId },
    { enabled: !isNaN(numericCompanyId) }
  )

  const updateCompany = api.company.update.useMutation({
    onSuccess: () => {
      toast({description: "Edição realizada com sucesso"})
      router.push(`/admin/companies/${numericCompanyId}`)
    },
    onError: (error) => {
      toastError({ title: "Erro ao atualizar empresa: ", description: error.message })
    }, 
  })

  usePageInfo({
    title: "Editar Empresa",
    breadcrumbs: [
      { label: "RampSync", href: "/app" },
      { label: "Empresas", href: "/admin/companies" },
      { label: company?.companyName || "Editar" },
    ],
  })

  useEffect(() => {
    if (company) {
      const { users, createdAt, updatedAt, ...rest } = company

      const sanitized = Object.fromEntries(
        Object.entries(rest).map(([key, value]) => [key, value ?? undefined])
      )

      form.reset({
        ...sanitized,
        companyId: numericCompanyId,
        status: company.status ?? 1,
      })
    }
  }, [company])

  const onSubmit = (values: CompanyUpdateSchema) => {
    updateCompany.mutate(values)
  }

  if (isLoading || !company) {
    return <p>Carregando dados da empresa...</p>
  }

  return (
    <div className="max-w-3xl mx-auto py-2">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Editar Empresa</h1>
        <Link href={`/admin/companies/${companyId}`}>
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Cancelar
          </Button>
        </Link>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle>Dados da Empresa</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome da Empresa</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome da empresa" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cnpj"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CNPJ</FormLabel>
                    <FormControl>
                      <Input placeholder="00.000.000/0001-00" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="companyType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo da Empresa</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || ""}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                      </FormControl>
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
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="email@empresa.com" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone</FormLabel>
                    <FormControl>
                      <Input placeholder="(11) 90000-0000" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Endereço</FormLabel>
                    <FormControl>
                      <Input placeholder="Rua Exemplo, 123" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cidade</FormLabel>
                    <FormControl>
                      <Input placeholder="São Paulo" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || ""}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o estado" />
                        </SelectTrigger>
                      </FormControl>
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
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="zipCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CEP</FormLabel>
                    <FormControl>
                      <Input placeholder="00000-000" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                      value={String(field.value ?? 1)}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1">Ativa</SelectItem>
                        <SelectItem value="0">Inativa</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </CardContent>

            <CardFooter className="flex justify-end gap-4">
              <Link href={`/admin/companies/${companyId}`}>
                <Button
                  type="button"
                  variant="outline"
                  className="text-red-600 border-red-300 hover:text-red-700 hover:border-red-400 hover:bg-red-100"
                >
                  Cancelar
                </Button>
              </Link>
              <Button type="submit" disabled={updateCompany.isPending}>
                <Save className="h-4 w-4 mr-2" />
                {updateCompany.isPending ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  )
}
