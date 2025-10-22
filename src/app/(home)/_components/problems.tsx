import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Problems() {
  const problemas = [
    {
      titulo: "❌ Processos Manuais",
      descricao: "Planilhas desatualizadas, formulários em papel e processos lentos que geram erros e retrabalho.",
    },
    {
      titulo: "❌ Falta de Visibilidade",
      descricao: "Impossibilidade de rastrear operações em tempo real e tomar decisões baseadas em dados.",
    },
    {
      titulo: "❌ Custos Elevados",
      descricao: "Desperdício de recursos, horas extras desnecessárias e multas por não conformidade.",
    },
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Acabamos com os Principais Desafios Aeroportuários
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Identificamos e solucionamos os gargalos que impedem seu aeroporto de operar com máxima eficiência
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {problemas.map((item, idx) => (
            <Card key={idx} className="border-l-4 border-l-red-500">
              <CardHeader>
                <CardTitle className="text-red-600">{item.titulo}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{item.descricao}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
