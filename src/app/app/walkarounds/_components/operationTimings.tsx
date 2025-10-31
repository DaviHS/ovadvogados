import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { HandlingData } from "@/types/handling"

interface OperationTimingsProps {
  formData: HandlingData
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void
}

export default function OperationTimings({ formData, handleChange }: OperationTimingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>3. Horário de Operação</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <Label htmlFor="chocksOn">Calço</Label>
          <Input 
            id="chocksOn" 
            name="chocksOn" 
            type="time" 
            value={formData.chocksOn} 
            onChange={handleChange} 
          />
        </div>
        <div>
          <Label htmlFor="releaseTime">Liberação</Label>
          <Input 
            id="releaseTime" 
            name="releaseTime" 
            type="time" 
            value={formData.releaseTime} 
            onChange={handleChange} 
          />
        </div>
        <div>
          <Label htmlFor="arrivalFlight">Voo Chegada</Label>
          <Input
            id="arrivalFlight"
            name="arrivalFlight"
            value={formData.arrivalFlight}
            onChange={handleChange}
            placeholder="Ex: JJ3001"
          />
        </div>
        <div>
          <Label htmlFor="departureFlight">Voo Saída</Label>
          <Input
            id="departureFlight"
            name="departureFlight"
            value={formData.departureFlight}
            onChange={handleChange}
            placeholder="Ex: JJ3002"
          />
        </div>
      </CardContent>
    </Card>
  )
}