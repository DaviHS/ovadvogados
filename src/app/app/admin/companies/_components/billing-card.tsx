// import { PermissionGuard } from "@/components/auth/permission-guard"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
// import { api } from "@/lib/api"
// import { SYSTEM_PERMISSIONS } from "@/lib/permissions"
// import { Shield } from "lucide-react"

// export function BillingCard({ companyId }: { companyId: number }) {
//   const { data: billingInfo, isLoading } = api.admin.billing.getCompanyBilling.useQuery({ companyId })

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle className="flex items-center gap-2">
//           <Shield className="h-5 w-5" />
//           Informações de Cobrança
//         </CardTitle>
//         <CardDescription>Dados financeiros e faturas</CardDescription>
//       </CardHeader>
//       <CardContent>
//         {isLoading ? (
//           <div className="text-center py-4">
//             <div className="animate-pulse">Carregando...</div>
//           </div>
//         ) : billingInfo ? (
//           <div className="space-y-3">
//             <div className="flex justify-between items-center py-2 border-b">
//               <span className="text-sm font-medium">Plano:</span>
//               <Badge variant="outline">{billingInfo.plan || 'Básico'}</Badge>
//             </div>
//             <div className="flex justify-between items-center py-2 border-b">
//               <span className="text-sm font-medium">Status:</span>
//               <Badge variant={billingInfo.status === 'active' ? 'default' : 'secondary'}>
//                 {billingInfo.status === 'active' ? 'Ativo' : 'Inativo'}
//               </Badge>
//             </div>
//             {billingInfo.nextBillingDate && (
//               <div className="flex justify-between items-center py-2 border-b">
//                 <span className="text-sm font-medium">Próxima cobrança:</span>
//                 <span className="text-sm text-gray-600">
//                   {new Date(billingInfo.nextBillingDate).toLocaleDateString('pt-BR')}
//                 </span>
//               </div>
//             )}
//             <div className="pt-2">
//               <Button variant="outline" size="sm" className="w-full">
//                 Ver Detalhes de Cobrança
//               </Button>
//             </div>
//           </div>
//         ) : (
//           <div className="text-center py-8">
//             <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//             <p className="text-gray-500 text-sm">Nenhuma informação de cobrança</p>
//             <PermissionGuard permission={SYSTEM_PERMISSIONS.BILLING_MANAGE}>
//               <Button variant="outline" size="sm" className="mt-3">
//                 Configurar Cobrança
//               </Button>
//             </PermissionGuard>
//           </div>
//         )}
//       </CardContent>
//     </Card>
//   )
// }