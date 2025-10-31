import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { HandlingData } from "@/types/handling"

interface SignatureProps {
  formData: HandlingData
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void
}

export default function Signature({ formData, handleChange }: SignatureProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>12. Conferência e Assinatura</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-semibold">Responsável pelo Preenchimento</h4>
            <div>
              <Label htmlFor="responsibleName">Nome</Label>
              <Input
                id="responsibleName"
                name="responsibleName"
                value={formData.responsibleName}
                onChange={handleChange}
                placeholder="Nome completo"
              />
            </div>
            <div>
              <Label htmlFor="responsibleId">Matrícula</Label>
              <Input
                id="responsibleId"
                name="responsibleId"
                value={formData.responsibleId}
                onChange={handleChange}
                placeholder="Número da matrícula"
              />
            </div>
            <div>
              <Label>Assinatura</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center text-gray-500">
                Campo para assinatura digital
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="font-semibold">Representante do Cliente</h4>
            <div>
              <Label htmlFor="representativeName">Nome</Label>
              <Input
                id="representativeName"
                name="representativeName"
                value={formData.representativeName}
                onChange={handleChange}
                placeholder="Nome completo"
              />
            </div>
            <div>
              <Label htmlFor="representativeId">Matrícula</Label>
              <Input
                id="representativeId"
                name="representativeId"
                value={formData.representativeId}
                onChange={handleChange}
                placeholder="Número da matrícula"
              />
            </div>
            <div>
              <Label>Assinatura</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center text-gray-500">
                Campo para assinatura digital
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}