// src/components/Hero.tsx
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function Hero() {
  return (
    <section className="bg-gradient-to-br from-blue-50 to-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <Badge className="mb-4 bg-blue-100 text-blue-800">
              Inovação em Automação Aeroportuária
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              Construindo o futuro da <span className="text-blue-600">automação aeroportuária</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Estamos desenvolvendo uma plataforma inteligente para transformar a operação de aeroportos com
              automação, IoT e inteligência de dados. Em fase de testes, já demonstramos ganhos expressivos de
              eficiência.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Quero Testar
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline">
                Falar com Especialista
              </Button>
            </div>
          </div>
          <div className="relative">
            {/* Espaço reservado para imagem ou gráfico ilustrativo futuro */}
            <div className="w-full h-64 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 font-semibold">
              Visual de Sistema em Construção
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
