import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { HandlingData } from "@/types/handling"

interface CancellationProps {
  formData: HandlingData
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void
}

export default function Cancellation({ formData, handleChange }: CancellationProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>9. Dados para Cancelamento</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="cancellationRequester">Nome</Label>
          <Input
            id="cancellationRequester"
            name="cancellationRequester"
            value={formData.cancellationRequester}
            onChange={handleChange}
            placeholder="Nome completo"
          />
        </div>
        <div>
          <Label htmlFor="cancellationReason">Motivo</Label>
          <Input
            id="cancellationReason"
            name="cancellationReason"
            value={formData.cancellationReason}
            onChange={handleChange}
            placeholder="Motivo do cancelamento"
          />
        </div>
      </CardContent>
    </Card>
  )
}