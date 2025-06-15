import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Plus, Trash2 } from "lucide-react"
import { EquipmentUsed } from "@/types/handling"

interface EquipmentProps {
  equipmentList: EquipmentUsed[]
  setEquipmentList: React.Dispatch<React.SetStateAction<EquipmentUsed[]>>
}

const availableEquipment = [
  "Ar Condicionado (Finger)",
  "Ar Condicionado (Remota)",
  "ASU/LPU",
  "Barra de Reboque",
  "Carreta",
  "Dolly",
  "Escada Motorizada",
  "Escada Rebocável",
  "Esteira Motorizada",
  "GPU (Finger)",
  "GPU (Remota)",
  "Loader Lower Deck",
  "Loader Main Deck",
  "QTA - Água Potável",
  "QTU - Degetos",
  "Rebocador (Reboque)",
  "Rebocador (Liberação)",
  "Trator",
  "Viatura - Van",
  "Empilhadeira",
  "Extintor"
]

export default function Equipment({ equipmentList, setEquipmentList }: EquipmentProps) {
  const addEquipment = () => {
    const newEquipment: EquipmentUsed = {
      id: Date.now().toString(),
      equipment: "",
      quantity: 0,
      startTime: "",
      endTime: "",
      ptm: "",
      operator: "",
      registration: ""
    }
    setEquipmentList([...equipmentList, newEquipment])
  }

  const removeEquipment = (id: string) => {
    setEquipmentList(equipmentList.filter(eq => eq.id !== id))
  }

  const updateEquipment = (id: string, field: keyof EquipmentUsed, value: string | number) => {
    setEquipmentList(equipmentList.map(eq => 
      eq.id === id ? { ...eq, [field]: value } : eq
    ))
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>7. Equipamento</CardTitle>
          <Button type="button" onClick={addEquipment} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Adicionar
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {equipmentList.length === 0 ? (
          <p className="text-gray-500 text-center py-4">Nenhum equipamento adicionado</p>
        ) : (
          <div className="space-y-4">
            {equipmentList.map((eq) => (
              <div key={eq.id} className="border rounded-lg p-4 bg-gray-50">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                  <div>
                    <Label>Equipamento</Label>
                    <select
                      value={eq.equipment}
                      onChange={(e) => updateEquipment(eq.id, "equipment", e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    >
                      <option value="">Selecione...</option>
                      {availableEquipment.map((equipment) => (
                        <option key={equipment} value={equipment}>
                          {equipment}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label>Qtd.</Label>
                    <Input
                      type="number"
                      value={eq.quantity}
                      onChange={(e) => updateEquipment(eq.id, "quantity", parseInt(e.target.value) || 0)}
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <Label>Ínicio</Label>
                    <Input
                      type="time"
                      value={eq.startTime}
                      onChange={(e) => updateEquipment(eq.id, "startTime", e.target.value)}
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <Label>Término</Label>
                    <Input
                      type="time"
                      value={eq.endTime}
                      onChange={(e) => updateEquipment(eq.id, "endTime", e.target.value)}
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <Label>PTM</Label>
                    <Input
                      value={eq.ptm}
                      onChange={(e) => updateEquipment(eq.id, "ptm", e.target.value)}
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <Label>Operador</Label>
                    <Input
                      value={eq.operator}
                      onChange={(e) => updateEquipment(eq.id, "operator", e.target.value)}
                      className="text-sm"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeEquipment(eq.id)}
                      className="text-red-600 hover:text-white hover:bg-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="mt-2">
                  <Label>Mátricula (ORB)</Label>
                  <Input
                    value={eq.registration}
                    onChange={(e) => updateEquipment(eq.id, "registration", e.target.value)}
                    className="text-sm"
                    placeholder="Mátricula do equipamento"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}