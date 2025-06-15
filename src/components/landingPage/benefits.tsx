import { CheckCircle } from "lucide-react"

export default function Benefits() {
  const items = [
    "Redução de falhas operacionais",
    "Mais visibilidade e rastreabilidade",
    "Alertas proativos e ações preventivas",
    "Relatórios automatizados em tempo real",
    "Melhoria na tomada de decisão",
    "Menos papel, mais sustentabilidade"
  ]

  return (
    <section id="beneficios" className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Benefícios Esperados</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Estamos em fase de validação com parceiros do setor. Estes são os principais benefícios já identificados:
          </p>
        </div>
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, index) => (
            <li key={index} className="flex items-start gap-3 bg-white p-6 rounded-xl shadow-sm">
              <CheckCircle className="h-6 w-6 text-green-600 mt-1" />
              <span className="text-lg text-gray-700">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
