"use client"

import React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface UserPersonalInfoFormProps {
  formData: {
    fullName: string
    email: string
    enrollmentNumber: string
    status: number
  }
  setFormData: React.Dispatch<
    React.SetStateAction<{
      fullName: string
      email: string
      enrollmentNumber: string
      status: number
    }>
  >
}

export default function UserPersonalInfoForm({ formData, setFormData }: UserPersonalInfoFormProps) {
  return (
    <fieldset className="border rounded p-4 space-y-4">
      <legend className="font-semibold text-lg">Dados Pessoais</legend>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="fullName">Nome Completo</Label>
          <Input
            id="fullName"
            type="text"
            value={formData.fullName}
            onChange={(e) => setFormData((prev) => ({ ...prev, fullName: e.target.value }))}
            placeholder="Digite o nome completo"
            required
          />
        </div>

        <div>
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
            placeholder="Digite o e-mail"
            required
          />
        </div>

        <div>
          <Label htmlFor="enrollmentNumber">Matrícula</Label>
          <Input
            id="enrollmentNumber"
            type="text"
            value={formData.enrollmentNumber}
            onChange={(e) => setFormData((prev) => ({ ...prev, enrollmentNumber: e.target.value }))}
            placeholder="Número da matrícula"
            required
          />
        </div>

        <div>
          <Label htmlFor="status">Status</Label>
          <Select
            value={String(formData.status)}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, status: Number(value) }))
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
      </div>
    </fieldset>
  )
}
