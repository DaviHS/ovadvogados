import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { HandlingData } from "@/types/handling"

interface GeneralNotesProps {
  formData: HandlingData
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void
}

export default function GeneralNotes({ formData, handleChange }: GeneralNotesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Observações Gerais</CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          name="generalNotes"
          value={formData.generalNotes}
          onChange={handleChange}
          placeholder="Observações gerais sobre o atendimento e inspeção..."
          rows={4}
        />
      </CardContent>
    </Card>
  )
}