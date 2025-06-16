import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { InspectionPoint } from "@/types/handling"

import Image from "next/image" 

interface AircraftDiagramProps {
  inspectionPoints: InspectionPoint[]
  setInspectionPoints: React.Dispatch<React.SetStateAction<InspectionPoint[]>>
}
export default function AircraftDiagram({ 
  inspectionPoints, 
  setInspectionPoints 
}: AircraftDiagramProps) {
  const handleCheckpointChange = (id: string, checked: boolean) => {
    setInspectionPoints(prev => 
      prev.map(item => item.id === id ? { ...item, checked } : item))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>✈️ Diagrama da Aeronave (vista superior)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative w-full h-[400px] border-2 border-gray-300 rounded-lg bg-gray-50 mb-6">
          <Image
            src="/aircraftTopView.png"
            alt="Diagrama da aeronave"
            fill
            objectFit="contain"
            className="rounded-lg"
          />

          {inspectionPoints.map((checkpoint) => (
            <div
              key={checkpoint.id}
              className="absolute flex items-center justify-center"
              style={{
                top: checkpoint.position.top,
                left: checkpoint.position.left,
              }}
            >
              <div className="flex items-center space-x-1">
                <Checkbox
                  id={`checkpoint-${checkpoint.id}`}
                  checked={checkpoint.checked}
                  onCheckedChange={(checked) => 
                    handleCheckpointChange(checkpoint.id, checked as boolean)}
                />
                <span className="text-xs font-medium bg-white px-1 rounded border">
                  {checkpoint.name.split(" ")[0]}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {inspectionPoints.map((checkpoint) => (
            <div key={checkpoint.id} className="flex items-center space-x-2">
              <Checkbox
                id={`list-${checkpoint.id}`}
                checked={checkpoint.checked}
                onCheckedChange={(checked) => 
                  handleCheckpointChange(checkpoint.id, checked as boolean)}
              />
              <Label htmlFor={`list-${checkpoint.id}`}>{checkpoint.name}</Label>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
