import { PermissionGuard } from "@/components/auth/permission-guard"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { api } from "@/lib/api"
import { SYSTEM_PERMISSIONS } from "@/lib/permissions"
import { Users } from "lucide-react"

export function UsersCard({ companyId }: { companyId: number }) {
  const { data: users, isLoading } = api.admin.company.getUsers.useQuery({ companyId })

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Usuários Vinculados
        </CardTitle>
        <CardDescription>Usuários associados a esta empresa</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-4">
            <div className="animate-pulse">Carregando usuários...</div>
          </div>
        ) : users && users.length > 0 ? (
          <div className="space-y-3">
            {users.slice(0, 5).map((user) => (
              <div key={user.userId} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{user.fullName}</p>
                    <p className="text-xs text-gray-600 mt-1">{user.email}</p>
                    <div className="flex gap-1 mt-2">
                      <Badge variant="outline" className="text-xs">
                        {user.roles?.[0]?.name || 'Sem role'}
                      </Badge>
                      <Badge 
                        variant={user.status === 1 ? "default" : "secondary"} 
                        className="text-xs"
                      >
                        {user.status === 1 ? "Ativo" : "Inativo"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {users.length > 5 && (
              <div className="text-center pt-2">
                <Button variant="outline" size="sm">
                  Ver todos {users.length} usuários
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-sm">Nenhum usuário vinculado</p>
            <PermissionGuard permission={SYSTEM_PERMISSIONS.USER_CREATE}>
              <Button variant="outline" size="sm" className="mt-3">
                Vincular Usuário
              </Button>
            </PermissionGuard>
          </div>
        )}
      </CardContent>
    </Card>
  )
}