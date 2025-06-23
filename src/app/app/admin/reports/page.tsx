"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart3, Download, Users, Building2, Activity, TrendingUp, FileText } from "lucide-react"

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  })

  const [selectedReport, setSelectedReport] = useState("")

  const reportTypes = [
    { value: "users", label: "Relatório de Usuários", icon: Users },
    { value: "companies", label: "Relatório de Empresas", icon: Building2 },
    { value: "walkarounds", label: "Relatório de Walkarounds", icon: Activity },
    { value: "performance", label: "Relatório de Performance", icon: TrendingUp },
  ]

  const quickStats = [
    { title: "Usuários Ativos", value: "186", change: "+12%", color: "text-green-600" },
    { title: "Empresas Cadastradas", value: "32", change: "+4", color: "text-blue-600" },
    { title: "Walkarounds Concluídos", value: "1,247", change: "+23%", color: "text-purple-600" },
    { title: "Taxa de Conformidade", value: "98.5%", change: "+2.1%", color: "text-green-600" },
  ]

  const handleGenerateReport = () => {
    console.log("Generating report:", { selectedReport, dateRange })
    // Implement report generation logic
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Relatórios</h1>
        <p className="text-gray-600">Gere relatórios detalhados sobre o sistema</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {quickStats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className={`text-xs ${stat.color}`}>{stat.change} desde o mês passado</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Report Generator */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Gerador de Relatórios
            </CardTitle>
            <CardDescription>Selecione o tipo de relatório e período para gerar</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="reportType">Tipo de Relatório</Label>
              <Select value={selectedReport} onValueChange={setSelectedReport}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo de relatório" />
                </SelectTrigger>
                <SelectContent>
                  {reportTypes.map((report) => (
                    <SelectItem key={report.value} value={report.value}>
                      <div className="flex items-center gap-2">
                        <report.icon className="h-4 w-4" />
                        {report.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Data Inicial</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={dateRange.startDate}
                  onChange={(e) => setDateRange((prev) => ({ ...prev, startDate: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="endDate">Data Final</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) => setDateRange((prev) => ({ ...prev, endDate: e.target.value }))}
                />
              </div>
            </div>

            <Button onClick={handleGenerateReport} className="w-full" disabled={!selectedReport}>
              <Download className="mr-2 h-4 w-4" />
              Gerar Relatório
            </Button>
          </CardContent>
        </Card>

        {/* Recent Reports */}
        <Card>
          <CardHeader>
            <CardTitle>Relatórios Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Relatório de Usuários", date: "2024-01-15", size: "2.3 MB" },
                { name: "Performance Mensal", date: "2024-01-10", size: "1.8 MB" },
                { name: "Walkarounds Janeiro", date: "2024-01-08", size: "4.1 MB" },
                { name: "Empresas Ativas", date: "2024-01-05", size: "856 KB" },
              ].map((report, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{report.name}</p>
                    <p className="text-xs text-gray-500">
                      {report.date} • {report.size}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
