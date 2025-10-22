// src/components/Solutions.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Plane, Shield, BarChart3, Zap } from "lucide-react"

export default function Solutions() {
  return (
    <section id="solucoes" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">O que estamos desenvolvendo</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Soluções modulares em fase de validação com foco em automação, rastreabilidade e inteligência de dados
            aplicadas à operação aeroportuária.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <Card className="p-8">
            <CardHeader>
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Plane className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Gestão Inteligente de Atendimentos</CardTitle>
                  <CardDescription>Ground handling com menos erro e mais rastreabilidade</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Agendamento automatizado</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Rastreamento em tempo real</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Relatórios de conformidade</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="p-8">
            <CardHeader>
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <Shield className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Inspeções Digitais Automatizadas</CardTitle>
                  <CardDescription>Checklists com IA e rastreabilidade total</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Checklists digitais inteligentes</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Detecção de anomalias</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Alertas preventivos</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="p-8">
            <CardHeader>
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <BarChart3 className="h-8 w-8 text-purple-600" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Analytics Operacional</CardTitle>
                  <CardDescription>Dados para tomada de decisão em tempo real</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Dashboards em tempo real</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Métricas de desempenho operacional</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Geração de relatórios automatizada</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="p-8">
            <CardHeader>
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-orange-100 p-3 rounded-lg">
                  <Zap className="h-8 w-8 text-orange-600" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Integração com Equipamentos</CardTitle>
                  <CardDescription>Coleta de dados via IoT</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Monitoramento contínuo</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Alertas de manutenção</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Controle remoto opcional</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
