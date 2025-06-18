import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { HandlingData } from "@/types/handling"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"

interface FlightDataProps {
  formData: HandlingData
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void
}

export default function FlightData({ formData, handleChange }: FlightDataProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>2. Dados do Voo</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <Label htmlFor="origin">Rota - Origem</Label>
          <Input
            id="origin"
            name="origin"
            value={formData.origin}
            onChange={handleChange}
            placeholder="E.g., GRU"
          />
        </div>

        <div>
          <Label htmlFor="destination">Rota - Destino</Label>
          <Input
            id="destination"
            name="destination"
            value={formData.destination}
            onChange={handleChange}
            placeholder="E.g., CGH"
          />
        </div>

        <div>
          <Label htmlFor="parkingPosition">Posição *</Label>
          <Select
            value={formData.parkingPosition}
            onValueChange={(value) =>
              handleChange({
                target: {
                  name: "parkingPosition",
                  value,
                },
              } as React.ChangeEvent<HTMLInputElement>)
            }
          >
            <SelectTrigger id="parkingPosition" className="w-full">
              <SelectValue placeholder="Selecione a posição" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Finger">Finger</SelectItem>
              <SelectItem value="Remote">Remote</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="aircraftModel">Modelo da Aeronave</Label>
          <Input
            id="aircraftModel"
            name="aircraftModel"
            value={formData.aircraftModel}
            onChange={handleChange}
            placeholder="Ex: A320, B737"
          />
        </div>
      </CardContent>
    </Card>
  )
}
