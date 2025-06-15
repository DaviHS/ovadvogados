import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { HandlingData } from "@/types/handling"

interface PersonnelProps {
  formData: HandlingData
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void
}

export default function Personnel({ formData, handleChange }: PersonnelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>6. Efetivos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-semibold">ASA</h4>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <Label htmlFor="personnel.wing.quantity">Qtd.</Label>
                <Input
                  id="personnel.wing.quantity"
                  name="personnel.wing.quantity"
                  type="number"
                  value={formData.personnel.wing.quantity}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="personnel.wing.startTime">Início</Label>
                <Input
                  id="personnel.wing.startTime"
                  name="personnel.wing.startTime"
                  type="time"
                  value={formData.personnel.wing.startTime}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="personnel.wing.endTime">Término</Label>
                <Input
                  id="personnel.wing.endTime"
                  name="personnel.wing.endTime"
                  type="time"
                  value={formData.personnel.wing.endTime}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="font-semibold">QEV</h4>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <Label htmlFor="personnel.qev.quantity">Qtd.</Label>
                <Input
                  id="personnel.qev.quantity"
                  name="personnel.qev.quantity"
                  type="number"
                  value={formData.personnel.qev.quantity}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="personnel.qev.startTime">Início</Label>
                <Input
                  id="personnel.qev.startTime"
                  name="personnel.qev.startTime"
                  type="time"
                  value={formData.personnel.qev.startTime}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="personnel.qev.endTime">Término</Label>
                <Input
                  id="personnel.qev.endTime"
                  name="personnel.qev.endTime"
                  type="time"
                  value={formData.personnel.qev.endTime}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}