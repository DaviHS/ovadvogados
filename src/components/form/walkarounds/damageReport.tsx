import { useRef, useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { HandlingData } from "@/types/handling"

interface DamageReportProps {
  formData: HandlingData
  setFormData: React.Dispatch<React.SetStateAction<HandlingData>>
}

export default function DamageReport({ formData, setFormData }: DamageReportProps) {
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDamageToggle = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      damageDetected: checked,
      damageDescription: checked ? prev.damageDescription : "",
      damagePhotos: checked ? prev.damagePhotos || [] : [],
    }))
    if (!checked) {
      setPreviewUrls([])
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      damageDescription: e.target.value,
    }))
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)

      setFormData((prev) => ({
        ...prev,
        damagePhotos: [...(prev.damagePhotos || []), ...newFiles],
      }))

      const newUrls = newFiles.map((file) => URL.createObjectURL(file))
      setPreviewUrls((prev) => [...prev, ...newUrls])
    }
  }

  const removePhoto = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      damagePhotos: prev.damagePhotos?.filter((_, i) => i !== index) || [],
    }))

    setPreviewUrls((prev) => {
      const updated = [...prev]
      const [removed] = updated.splice(index, 1)
      URL.revokeObjectURL(removed!)
      return updated
    })

    // Limpar o input para permitir reupload da mesma imagem
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [previewUrls])

  return (
    <Card>
      <CardHeader>
        <CardTitle>10. Avaria da Aeronave</CardTitle>
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
          <div className="space-y-4">
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

            <div>
              <Label htmlFor="damagePhotos">Fotos da Avaria:</Label>
              <Input
                id="damagePhotos"
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoUpload}
                ref={fileInputRef}
              />
              {previewUrls.length > 0 && (
                <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3">
                  {previewUrls.map((url, index) => (
                    <div key={index} className="relative group rounded overflow-hidden border">
                      <img
                        src={url}
                        alt={`Foto ${index + 1}`}
                        className="w-full h-32 object-cover"
                      />
                      <Button
                        type="button"
                        size="icon"
                        variant="destructive"
                        onClick={() => removePhoto(index)}
                        className="absolute top-1 right-1 opacity-80 hover:opacity-100 p-1 h-6 w-6"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
