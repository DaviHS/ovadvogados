import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { HandlingData } from "@/types/handling"

interface FlightIdentificationProps {
  formData: HandlingData
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void
}

export default function FlightIdentification({ formData, handleChange }: FlightIdentificationProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>🛫 Indetificação de Voo</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="flightNumber">Nº Voo *</Label>
          <Input
            id="flightNumber"
            name="flightNumber"
            value={formData.flightNumber}
            onChange={handleChange}
            placeholder="Ex: JJ3001"
            required
          />
        </div>
        <div>
          <Label htmlFor="aircraftRegistration">Prefixo da Aeronave *</Label>
          <Input
            id="aircraftRegistration"
            name="aircraftRegistration"
            value={formData.aircraftRegistration}
            onChange={handleChange}
            placeholder="Ex: PR-ABC"
            required
          />
        </div>
        <div>
          <Label htmlFor="timeCompleted">Hora Realizada *</Label>
          <Input
            id="timeCompleted"
            name="timeCompleted"
            type="time"
            value={formData.timeCompleted}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="date">Data *</Label>
          <Input 
            id="date" 
            name="date" 
            type="date" 
            value={formData.date} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div>
          <Label htmlFor="teamLeader">Nome do Líder *</Label>
          <Input
            id="teamLeader"
            name="teamLeader"
            value={formData.teamLeader}
            onChange={handleChange}
            placeholder="Nome Completo"
            required
          />
        </div>
        <div>
          <Label htmlFor="collectionInfo">Coleta</Label>
          <Input
            id="collectionInfo"
            name="collectionInfo"
            value={formData.collectionInfo}
            onChange={handleChange}
            placeholder="Informações de coleta"
          />
        </div>
        <div>
          <Label htmlFor="client">Cliente *</Label>
          <Input
            id="client"
            name="client"
            value={formData.client}
            onChange={handleChange}
            placeholder="Nome da empresa"
            required
          />
        </div>
        <div>
          <Label htmlFor="base">Base *</Label>
          <Input
            id="base"
            name="base"
            value={formData.base}
            onChange={handleChange}
            placeholder="Ex: GRU, CGH, BSB"
            required
          />
        </div>
        <div>
          <Label>Marcação de:</Label>
          <RadioGroup
            value={formData.flightType}
            onValueChange={(value) => handleChange({
              target: { name: 'flightType', value }
            } as React.ChangeEvent<HTMLInputElement>)}
            className="flex space-x-4 mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="arrival" id="arrival" />
              <Label htmlFor="arrival">Chegada</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="departure" id="departure" />
              <Label htmlFor="departure">Partida</Label>
            </div>
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  )
}