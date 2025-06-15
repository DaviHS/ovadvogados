import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plane, ClipboardCheck, Users, AlertTriangle } from "lucide-react"
import Link from "next/link"

export default function Dashboard() {
  const stats = [
    {
      title: "Atendimentos Hoje",
      value: "12",
      description: "3 em andamento",
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Atendimentos Concluídos",
      value: "28",
      description: "Este mês",
      icon: ClipboardCheck,
      color: "text-green-600",
    },
    {
      title: "Aeronaves Ativas",
      value: "8",
      description: "No pátio",
      icon: Plane,
      color: "text-green-600",
    },
    {
      title: "Alertas",
      value: "2",
      description: "Requer atenção",
      icon: AlertTriangle,
      color: "text-red-600",
    },
  ]

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-end mb-6">
          <Link href="/app/atendimentos/novo">
            <Button>Novo Atendimento/Inspeção</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Atendimentos Recentes</CardTitle>
              <CardDescription>Últimos atendimentos registrados</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[ 
                  { id: "001", aircraft: "PR-ABC", type: "Abastecimento", status: "Em andamento", time: "14:30" },
                  { id: "002", aircraft: "PR-DEF", type: "Limpeza", status: "Concluído", time: "13:45" },
                  { id: "003", aircraft: "PR-GHI", type: "Catering", status: "Pendente", time: "15:00" },
                ].map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{item.aircraft}</p>
                      <p className="text-sm text-gray-600">{item.type}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{item.time}</p>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          item.status === "Concluído"
                            ? "bg-green-100 text-green-800"
                            : item.status === "Em andamento"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <Link href="/app/atendimentos">
                  <Button variant="outline" className="w-full">
                    Ver Todos os Atendimentos
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

