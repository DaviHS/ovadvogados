"use client"

import { use, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useFieldArray, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Plus, X } from "lucide-react"
import { toast } from "sonner"

import { userUpdateSchema } from "@/validators/user"
import { api } from "@/trpc/react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { usePageInfo } from "@/hooks/use-page-info"

interface Props {
  params: Promise<{ userId: string }>
}

export default function UserEditPage({ params }: Props) {
  const router = useRouter()
  const { userId } = use(params)
  const numericUserId = Number(userId)

  const { data: user, isLoading: isLoadingUser } = api.user.getById.useQuery(
    { userId: numericUserId },
    { enabled: !isNaN(numericUserId) }
  )
  const { data: allRoles } = api.role.list.useQuery()
  const { data: companies } = api.company.list.useQuery()

  const breadcrumbs = useMemo(
    () => [
      { label: "RampSync", href: "/app" },
      { label: "Usuários", href: "/admin/users" },
      { label: user?.fullName || "Carregando..." },
    ],
    [user?.fullName]
  )
  
  usePageInfo({
    title: user?.fullName || "Cadastro de Usuário",
    breadcrumbs,
  })

  const utils = api.useUtils()

  const updateUser = api.user.update.useMutation({
    onSuccess: () => {
      utils.user.getById.invalidate()
      toast.success("Usuário atualizado com sucesso!")
      router.push("/admin/users")
      router.refresh()
    },
    onError: (error) => {
      toast.error("Erro ao atualizar usuário: " + error.message)
    },
  })

  const defaultValues = useMemo(() => {
    if (!user) return undefined

    return {
      userId: user.userId,
      fullName: user.fullName,
      email: user.email,
      enrollmentNumber: user.enrollmentNumber || "",
      status: user.status ?? 1,
      password: "",
      companies: user.companies.map((company) => ({
        companyId: company.companyId,
        roles: company.roles.map((r) => r.roleId),
      })),
    }
  }, [user])

  const form = useForm<z.infer<typeof userUpdateSchema>>({
    resolver: zodResolver(userUpdateSchema),
    defaultValues,
  })

  useEffect(() => {
    if (defaultValues) {
      form.reset(defaultValues)
    }
  }, [defaultValues, form])


  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "companies",
  })

  const onSubmit = (values: z.infer<typeof userUpdateSchema>) => {
    console.log(values)
    updateUser.mutate(values)
  }

  if (isLoadingUser || !defaultValues || !companies || !allRoles) {
    return <p>Carregando...</p>
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="max-w-4xl mx-auto py-10 space-y-8"
    >
      <Card>
        <CardHeader>
          <CardTitle>Informações do Usuário</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="fullName">Nome Completo</Label>
            <Input id="fullName" {...form.register("fullName")} />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" {...form.register("email")} />
          </div>

          <div>
            <Label htmlFor="enrollmentNumber">Matrícula</Label>
            <Input id="enrollmentNumber" {...form.register("enrollmentNumber")} />
          </div>

          <div>
            <Label>Status</Label>
            <Select
              value={String(form.watch("status"))}
              onValueChange={(val) => form.setValue("status", Number(val))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Status" />
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
          <div className="flex justify-between items-center">
            <CardTitle>Empresas e Funções</CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ companyId: 0, roles: [] })}
            >
              <Plus className="h-4 w-4 mr-1" />
              Adicionar Empresa
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {fields.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>Nenhuma empresa vinculada</p>
              <p className="text-sm">Clique em "Adicionar Empresa"</p>
            </div>
          ) : (
            fields.map((field, index) => (
              <div
                key={field.id}
                className="flex gap-4 items-end p-4 border rounded-lg"
              >
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Empresa *</Label>
                    <Select
                      value={form.watch(`companies.${index}.companyId`)?.toString() || ""}
                      onValueChange={(value) =>
                        form.setValue(`companies.${index}.companyId`, Number(value))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a empresa" />
                      </SelectTrigger>
                      <SelectContent>
                        {companies.map((company) => (
                          <SelectItem
                            key={company.companyId}
                            value={company.companyId.toString()}
                          >
                            {company.companyName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Funções</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {allRoles.map((role) => {
                        const roles = form.watch(`companies.${index}.roles`) || []
                        const isChecked = roles.includes(role.roleId)

                        return (
                          <label key={role.roleId} className="flex items-center gap-2">
                            <Checkbox
                              checked={isChecked}
                              onCheckedChange={() => {
                                const current = [...roles]
                                const updated = isChecked
                                  ? current.filter((id) => id !== role.roleId)
                                  : [...current, role.roleId]
                                form.setValue(`companies.${index}.roles`, updated)
                              }}
                            />
                            {role.name}
                          </label>
                        )
                      })}
                    </div>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => remove(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}
        </CardContent>
      </Card>
      <div className="flex justify-end items-center">
        <Button type="submit" disabled={updateUser.isPending}>
          {updateUser.isPending ? "Salvando..." : "Salvar Alterações"}
        </Button>
      </div>
    </form>
  )
}
