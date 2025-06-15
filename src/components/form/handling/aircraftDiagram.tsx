import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { InspectionPoint } from "@/types/handling"

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
          {/* Simplified aircraft drawing */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[60%] h-[80%]">
            {/* Fuselage */}
            <div className="absolute top-[10%] left-[20%] w-[60%] h-[80%] bg-gray-200 rounded-full"></div>
            {/* Wings */}
            <div className="absolute top-[40%] left-0 w-[100%] h-[20%] bg-gray-300"></div>
            {/* Tail */}
            <div className="absolute top-[70%] left-[45%] w-[10%] h-[30%] bg-gray-300"></div>
            {/* Horizontal stabilizers */}
            <div className="absolute top-[80%] left-[35%] w-[30%] h-[5%] bg-gray-300"></div>
          </div>

          {/* Inspection points */}
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