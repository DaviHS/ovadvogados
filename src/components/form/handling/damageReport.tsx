import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { HandlingData } from "@/types/handling" 

interface DamageReportProps {
  formData: HandlingData
  setFormData: React.Dispatch<React.SetStateAction<HandlingData>>
}

export default function DamageReport({ formData, setFormData }: DamageReportProps) {
  const handleDamageToggle = (checked: boolean) => {
    setFormData((prev: HandlingData) => ({ 
      ...prev, 
      damageDetected: checked 
    }))
  }

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData((prev: HandlingData) => ({ 
      ...prev, 
      damageDescription: e.target.value 
    }))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>8. Avaria da Aeronave</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="damageDetected"
            checked={formData.damageDetected}
            onCheckedChange={(checked) => handleDamageToggle(checked as boolean)}
          />
          <Label htmlFor="damageDetected">Detectada alguma avaria na aeronave?</Label>
        </div>
        {formData.damageDetected && (
          <div>
            <Label htmlFor="damageDescription">Descrição da Avaria:</Label>
            <Textarea
              id="damageDescription"
              name="damageDescription"
              value={formData.damageDescription}
              onChange={handleDescriptionChange}
              placeholder="Descreva detalhadamente a avaria encontrada..."
              rows={3}
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}