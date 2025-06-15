import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function CtaFinal() {
  return (
    <section id="contato" className="py-24 bg-gradient-to-br from-blue-600 to-blue-800 text-white text-center">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-4xl font-bold mb-6">
          Pronto para elevar a eficiência do seu aeroporto?
        </h2>
        <p className="text-xl text-blue-100 mb-8">
          Agende uma demonstração personalizada e veja na prática como podemos transformar sua operação.
        </p>
        <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-100 font-semibold">
          Solicitar Demonstração <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </section>
  )
}
