import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Mail, MapPin, Calendar } from "lucide-react"
import { Company } from "@/types/company"

interface CompanyInfoCardProps {
  company: Company
}

export function CompanyInfoCard({ company }: CompanyInfoCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações da Empresa</CardTitle>
        <CardDescription>Dados cadastrais e informações de contato</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Dados Cadastrais
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-sm font-medium">Nome:</span>
                  <span className="text-sm text-gray-600">{company.companyName}</span>
                </div>
                {company.cnpj && (
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-sm font-medium">CNPJ:</span>
                    <span className="text-sm text-gray-600">{company.cnpj}</span>
                  </div>
                )}
                {company.companyType && (
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-sm font-medium">Tipo:</span>
                    <span className="text-sm text-gray-600 capitalize">{company.companyType}</span>
                  </div>
                )}
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-sm font-medium">Status:</span>
                  <Badge variant={company.status === 1 ? "default" : "secondary"}>
                    {company.status === 1 ? "Ativa" : "Inativa"}
                  </Badge>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Contato
              </h3>
              <div className="space-y-3">
                {company.email && (
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-sm font-medium">Email:</span>
                    <span className="text-sm text-gray-600">{company.email}</span>
                  </div>
                )}
                {company.phone && (
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-sm font-medium">Telefone:</span>
                    <span className="text-sm text-gray-600">{company.phone}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Localização
              </h3>
              <div className="space-y-3">
                {company.address && (
                  <div className="py-2 border-b">
                    <span className="text-sm font-medium block mb-1">Endereço:</span>
                    <span className="text-sm text-gray-600">{company.address}</span>
                  </div>
                )}
                {(company.city || company.state) && (
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-sm font-medium">Cidade/UF:</span>
                    <span className="text-sm text-gray-600">
                      {[company.city, company.state].filter(Boolean).join(" - ")}
                    </span>
                  </div>
                )}
                {company.zipCode && (
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-sm font-medium">CEP:</span>
                    <span className="text-sm text-gray-600">{company.zipCode}</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Datas
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-sm font-medium">Criada em:</span>
                  <span className="text-sm text-gray-600">
                    {new Date(company.createdAt!).toLocaleDateString('pt-BR')}
                  </span>
                </div>
                {company.updatedAt && (
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-sm font-medium">Atualizada em:</span>
                    <span className="text-sm text-gray-600">
                      {new Date(company.updatedAt).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}