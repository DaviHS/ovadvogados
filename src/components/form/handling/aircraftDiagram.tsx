import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
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

  const total = inspectionPoints.length
  const completed = inspectionPoints.filter(p => p.checked).length
  const progress = total === 0 ? 0 : Math.round((completed / total) * 100)

  return (
    <Card>
      <CardHeader>
        <CardTitle>✈️ Diagrama da Aeronave (vista superior)</CardTitle>
      </CardHeader>
      <CardContent>

        <div className="mb-6">
          <div className="flex justify-between mb-2 text-sm font-medium">
            <span>Progresso da Inspeção</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} />
        </div>

        <div className="relative w-full max-w-[400px] max-sm:max-w-[280px] aspect-[1/1] border-2 border-gray-300 rounded-lg bg-gray-50 mb-6 mx-auto">
          <Image
            src="/aircraft.svg"
            alt="Diagrama da aeronave"
            fill
            className="object-contain rounded-lg"
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
              <Checkbox
                className="scale-75 max-sm:scale-50"
                id={`checkpoint-${checkpoint.id}`}
                checked={checkpoint.checked}
                onCheckedChange={(checked) =>
                  handleCheckpointChange(checkpoint.id, checked as boolean)}
              />
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
