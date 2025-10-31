import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { HandlingData } from "@/types/handling"

interface DisembarkationProps {
  formData: HandlingData
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void
}

export default function DisembarkationForm({ formData, handleChange }: DisembarkationProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>4. Desembarque / Descaregamento</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <Label htmlFor="disembarkation.cargoDoorOpen">Abertura Porão</Label>
          <Input
            id="disembarkation.cargoDoorOpen"
            name="disembarkation.cargoDoorOpen"
            type="time"
            value={formData.disembarkation.cargoDoorOpen}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="disembarkation.cargoDoorClose">Fechº Porão</Label>
          <Input
            id="disembarkation.cargoDoorClose"
            name="disembarkation.cargoDoorClose"
            type="time"
            value={formData.disembarkation.cargoDoorClose}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="disembarkation.firstBaggage">1ª Bagagem</Label>
          <Input
            id="disembarkation.firstBaggage"
            name="disembarkation.firstBaggage"
            type="time"
            value={formData.disembarkation.firstBaggage}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="disembarkation.lastBaggage">Última Bagagem</Label>
          <Input
            id="disembarkation.lastBaggage"
            name="disembarkation.lastBaggage"
            type="time"
            value={formData.disembarkation.lastBaggage}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="disembarkation.firstCargo">1ª Carga</Label>
          <Input
            id="disembarkation.firstCargo"
            name="disembarkation.firstCargo"
            type="time"
            value={formData.disembarkation.firstCargo}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="disembarkation.lastCargo">Última Carga</Label>
          <Input
            id="disembarkation.lastCargo"
            name="disembarkation.lastCargo"
            type="time"
            value={formData.disembarkation.lastCargo}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="disembarkation.towingStart">Reb. Início</Label>
          <Input
            id="disembarkation.towingStart"
            name="disembarkation.towingStart"
            type="time"
            value={formData.disembarkation.towingStart}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="disembarkation.towingEnd">Reb. Fim</Label>
          <Input
            id="disembarkation.towingEnd"
            name="disembarkation.towingEnd"
            type="time"
            value={formData.disembarkation.towingEnd}
            onChange={handleChange}
          />
        </div>
      </CardContent>
    </Card>
  )
}