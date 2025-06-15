import { BadgeCheck } from "lucide-react"

export default function Validations() {
  const validations = [
    {
      title: "Aeroporto X",
      description:
        "Redução de 32% no tempo médio de atendimento após automação de tarefas com o módulo de Agendamento Inteligente."
    },
    {
      title: "Operador Y",
      description:
        "Eliminação de checklists em papel e aumento de 45% na agilidade de inspeções em campo."
    },
    {
      title: "Parceiro Z",
      description:
        "Relatórios automatizados reduziram em 70% o tempo de consolidação de dados para auditorias."
    }
  ]

  return (
    <section id="validacoes" className="py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Validações em Andamento</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Alguns dos resultados preliminares obtidos com nossos parceiros durante a fase de testes:
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {validations.map((val, idx) => (
            <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-center gap-3 mb-4">
                <BadgeCheck className="h-6 w-6 text-blue-600" />
                <h3 className="text-xl font-semibold text-gray-800">{val.title}</h3>
              </div>
              <p className="text-gray-600">{val.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}