import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { HandlingData } from "@/types/handling"

interface BoardingProps {
  formData: HandlingData
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void
}

export default function Boarding({ formData, handleChange }: BoardingProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>5. Embarque / Carregamento</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <Label htmlFor="boarding.cargoDoorOpen">Abertura Porão</Label>
          <Input
            id="boarding.cargoDoorOpen"
            name="boarding.cargoDoorOpen"
            type="time"
            value={formData.boarding.cargoDoorOpen}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="boarding.cargoDoorClose">Fechº Porão</Label>
          <Input
            id="boarding.cargoDoorClose"
            name="boarding.cargoDoorClose"
            type="time"
            value={formData.boarding.cargoDoorClose}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="boarding.firstBaggage">1ª Bagagem</Label>
          <Input
            id="boarding.firstBaggage"
            name="boarding.firstBaggage"
            type="time"
            value={formData.boarding.firstBaggage}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="boarding.lastBaggage">Última Bagagem</Label>
          <Input
            id="boarding.lastBaggage"
            name="boarding.lastBaggage"
            type="time"
            value={formData.boarding.lastBaggage}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="boarding.firstCargo">1ª Carga</Label>
          <Input
            id="boarding.firstCargo"
            name="boarding.firstCargo"
            type="time"
            value={formData.boarding.firstCargo}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="boarding.lastCargo">Última Carga</Label>
          <Input
            id="boarding.lastCargo"
            name="boarding.lastCargo"
            type="time"
            value={formData.boarding.lastCargo}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="boarding.towingStart">Reb. Início</Label>
          <Input
            id="boarding.towingStart"
            name="boarding.towingStart"
            type="time"
            value={formData.boarding.towingStart}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="boarding.towingEnd">Reb. Fim</Label>
          <Input
            id="boarding.towingEnd"
            name="boarding.towingEnd"
            type="time"
            value={formData.boarding.towingEnd}
            onChange={handleChange}
          />
        </div>
      </CardContent>
    </Card>
  )
}