"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  Building2,
  UserCheck,
  Activity,
  TrendingUp,
  AlertTriangle,
  Plus,
  Eye,
  Edit,
  MoreHorizontal,
} from "lucide-react"
import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function AdminDashboard() {
  const stats = [
    {
      title: "Total de Usuários",
      value: "248",
      description: "+12% desde o mês passado",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Empresas Ativas",
      value: "32",
      description: "4 novas este mês",
      icon: Building2,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Usuários Ativos",
      value: "186",
      description: "75% do total",
      icon: UserCheck,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Walkarounds Hoje",
      value: "45",
      description: "23 concluídos",
      icon: Activity,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ]

  const recentUsers = [
    {
      id: 1,
      name: "João Silva",
      email: "joao@tam.com.br",
      company: "TAM",
      role: "Operador",
      status: "Ativo",
      createdAt: "2024-01-15",
    },
    {
      id: 2,
      name: "Maria Santos",
      email: "maria@gol.com.br",
      company: "GOL",
      role: "Admin",
      status: "Ativo",
      createdAt: "2024-01-14",
    },
    {
      id: 3,
      name: "Pedro Costa",
      email: "pedro@azul.com.br",
      company: "Azul",
      role: "Operador",
      status: "Pendente",
      createdAt: "2024-01-13",
    },
    {
      id: 4,
      name: "Ana Oliveira",
      email: "ana@latam.com",
      company: "LATAM",
      role: "Supervisor",
      status: "Ativo",
      createdAt: "2024-01-12",
    },
  ]

  const recentCompanies = [
    {
      id: 1,
      name: "TAM Linhas Aéreas",
      cnpj: "12.345.678/0001-90",
      users: 45,
      status: "Ativa",
      createdAt: "2024-01-10",
    },
    {
      id: 2,
      name: "GOL Linhas Aéreas",
      cnpj: "98.765.432/0001-10",
      users: 32,
      status: "Ativa",
      createdAt: "2024-01-08",
    },
    {
      id: 3,
      name: "Azul Linhas Aéreas",
      cnpj: "11.222.333/0001-44",
      users: 28,
      status: "Ativa",
      createdAt: "2024-01-05",
    },
  ]

  const systemAlerts = [
    { id: 1, type: "warning", message: "5 usuários com senhas expiradas", action: "Ver usuários" },
    { id: 2, type: "info", message: "Backup automático concluído", action: "Ver logs" },
    { id: 3, type: "error", message: "Falha na sincronização com 2 empresas", action: "Resolver" },
  ]

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "ativo":
      case "ativa":
        return "bg-green-100 text-green-800"
      case "inativo":
      case "inativa":
        return "bg-red-100 text-red-800"
      case "pendente":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getAlertColor = (type: string) => {
    switch (type) {
      case "error":
        return "border-l-red-500 bg-red-50"
      case "warning":
        return "border-l-yellow-500 bg-yellow-50"
      case "info":
        return "border-l-blue-500 bg-blue-50"
      default:
        return "border-l-gray-500 bg-gray-50"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Painel Administrativo</h1>
              <p className="text-gray-600">Visão geral do sistema RampSync</p>
            </div>
            <div className="flex gap-3">
              <Link href="/admin/users/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Usuário
                </Button>
              </Link>
              <Link href="/admin/companies/new">
                <Button variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Empresa
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* System Alerts */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                Alertas do Sistema
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {systemAlerts.map((alert) => (
                  <div key={alert.id} className={`p-3 border-l-4 rounded-r-lg ${getAlertColor(alert.type)}`}>
                    <p className="text-sm font-medium">{alert.message}</p>
                    <Button variant="link" size="sm" className="p-0 h-auto text-xs">
                      {alert.action}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
              <CardDescription>Acesso rápido às principais funcionalidades</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <Link href="/admin/users">
                  <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                    <Users className="h-6 w-6" />
                    <span className="text-sm">Gerenciar Usuários</span>
                  </Button>
                </Link>
                <Link href="/admin/companies">
                  <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                    <Building2 className="h-6 w-6" />
                    <span className="text-sm">Gerenciar Empresas</span>
                  </Button>
                </Link>
                <Link href="/admin/user-company">
                  <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                    <UserCheck className="h-6 w-6" />
                    <span className="text-sm">Vínculos</span>
                  </Button>
                </Link>
                <Link href="/app/walkarounds">
                  <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                    <Activity className="h-6 w-6" />
                    <span className="text-sm">Walkarounds</span>
                  </Button>
                </Link>
                <Link href="/admin/reports">
                  <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                    <TrendingUp className="h-6 w-6" />
                    <span className="text-sm">Relatórios</span>
                  </Button>
                </Link>
                <Link href="/admin/settings">
                  <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                    <AlertTriangle className="h-6 w-6" />
                    <span className="text-sm">Configurações</span>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Users */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Usuários Recentes</CardTitle>
                <Link href="/admin/users">
                  <Button variant="outline" size="sm">
                    Ver Todos
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <p className="font-medium">{user.name}</p>
                        <Badge className={getStatusColor(user.status)}>{user.status}</Badge>
                      </div>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <p className="text-xs text-gray-500">
                        {user.company} • {user.role}
                      </p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          Ver Detalhes
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Companies */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Empresas Recentes</CardTitle>
                <Link href="/admin/companies">
                  <Button variant="outline" size="sm">
                    Ver Todas
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentCompanies.map((company) => (
                  <div key={company.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <p className="font-medium">{company.name}</p>
                        <Badge className={getStatusColor(company.status)}>{company.status}</Badge>
                      </div>
                      <p className="text-sm text-gray-600">{company.cnpj}</p>
                      <p className="text-xs text-gray-500">{company.users} usuários</p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          Ver Detalhes
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
