"use client"

import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Edit } from "lucide-react"
import Link from "next/link"
import { usePageInfo } from "@/hooks/use-page-info"
import { api } from "@/lib/api"
import { Loader2 } from "lucide-react"

export default function ViewWalkaroundPage() {
  const params = useParams()
  const id = params.id as string

  const { data: handling, isLoading } = api.handling.getById.useQuery(
    { handlingId: Number(id) }
  )

  usePageInfo({
    title: `Atendimento #${id}`,
    breadcrumbs: [
      { label: "RampSync", href: "/app" },
      { label: "Walkaround", href: "/walkarounds" },
      { label: `Atendimento #${id}` }
    ]
  })

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!handling) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Atendimento não encontrado</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link href="/walkarounds">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Atendimento #{id}</h1>
          </div>
          <Link href={`/walkarounds/${id}/edit`}>
            <Button>
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
          </Link>
        </div>

        <div className="grid gap-6">
          {/* Informações do Voo */}
          <Card>
            <CardHeader>
              <CardTitle>Informações do Voo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="font-medium">Número do Voo</p>
                  <p>{handling.flightNumber}</p>
                </div>
                <div>
                  <p className="font-medium">Registro da Aeronave</p>
                  <p>{handling.aircraftRegistration}</p>
                </div>
                <div>
                  <p className="font-medium">Data</p>
                  <p>{new Date(handling.date).toLocaleDateString('pt-BR')}</p>
                </div>
                <div>
                  <p className="font-medium">Hora de Conclusão</p>
                  <p>{handling.timeCompleted}</p>
                </div>
                <div>
                  <p className="font-medium">Líder da Equipe</p>
                  <p>{handling.teamLeader}</p>
                </div>
                <div>
                  <p className="font-medium">Cliente</p>
                  <p>{handling.client}</p>
                </div>
                <div>
                  <p className="font-medium">Tipo de Voo</p>
                  <p className="capitalize">{handling.flightType}</p>
                </div>
                <div>
                  <p className="font-medium">Base</p>
                  <p>{handling.base}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informações Adicionais */}
          {(handling.origin || handling.destination || handling.generalNotes) && (
            <Card>
              <CardHeader>
                <CardTitle>Informações Adicionais</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {handling.origin && (
                    <div>
                      <p className="font-medium">Origem</p>
                      <p>{handling.origin}</p>
                    </div>
                  )}
                  {handling.destination && (
                    <div>
                      <p className="font-medium">Destino</p>
                      <p>{handling.destination}</p>
                    </div>
                  )}
                  {handling.generalNotes && (
                    <div className="md:col-span-2">
                      <p className="font-medium">Observações Gerais</p>
                      <p>{handling.generalNotes}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}