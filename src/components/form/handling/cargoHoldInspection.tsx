import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { CargoHoldItem } from "@/types/handling"

interface CargoHoldInspectionProps {
  cargoHoldItems: CargoHoldItem[]
  setCargoHoldItems: React.Dispatch<React.SetStateAction<CargoHoldItem[]>>
}

export default function CargoHoldInspection({ 
  cargoHoldItems, 
  setCargoHoldItems 
}: CargoHoldInspectionProps) {
  const handleCargoHoldChange = (id: string, field: "checked" | "notes", value: boolean | string) => {
    setCargoHoldItems(prev => 
      prev.map(item => item.id === id ? { ...item, [field]: value } : item))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>🔍 Inspeção interna do porão</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {cargoHoldItems.map((item) => (
            <div key={item.id} className="border rounded-lg p-4 bg-gray-50">
              <div className="flex items-start gap-3">
                <Checkbox
                  id={`cargo-${item.id}`}
                  checked={item.checked}
                  onCheckedChange={(checked) => 
                    handleCargoHoldChange(item.id, "checked", checked as boolean)}
                />
                <div className="flex-1">
                  <Label htmlFor={`cargo-${item.id}`} className="font-medium">
                    {item.name}
                  </Label>
                  <div className="mt-2">
                    <Textarea
                      placeholder={`Observações sobre ${item.name.toLowerCase()}...`}
                      value={item.notes}
                      onChange={(e) => 
                        handleCargoHoldChange(item.id, "notes", e.target.value)}
                      rows={2}
                      className="text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}