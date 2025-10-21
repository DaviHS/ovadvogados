"use client"

// import { usePermissions } from "@/hooks/use-permissions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Users, Building2 } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

export function UserPermissionsInfo() {
  // const { permissions, roles, companies, isAdmin, isLoading } = usePermissions()

  // if (isLoading) {
  //   return (
  //     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  //       {[...Array(3)].map((_, i) => (
  //         <Card key={i}>
  //           <CardHeader>
  //             <Skeleton className="h-6 w-24" />
  //             <Skeleton className="h-4 w-32" />
  //           </CardHeader>
  //           <CardContent>
  //             <div className="space-y-2">
  //               <Skeleton className="h-6 w-20" />
  //               <Skeleton className="h-6 w-16" />
  //             </div>
  //           </CardContent>
  //         </Card>
  //       ))}
  //     </div>
  //   )
  // }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Funções
          </CardTitle>
          <CardDescription>Suas funções no sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">

          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Empresas
          </CardTitle>
          <CardDescription>Empresas que você tem acesso</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">

          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Permissões
          </CardTitle>
          <CardDescription>Suas permissões detalhadas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-40 overflow-y-auto">
           </div>
        </CardContent>
      </Card>
    </div>
  )
}
