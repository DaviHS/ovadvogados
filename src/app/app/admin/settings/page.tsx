"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Settings, Save, Mail, Shield, Database, Bell } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    // General Settings
    systemName: "RampSync",
    systemDescription: "Sistema de Atendimentos Aeroportuários",
    timezone: "America/Sao_Paulo",
    language: "pt-BR",

    // Email Settings
    smtpHost: "",
    smtpPort: "587",
    smtpUser: "",
    smtpPassword: "",
    emailFrom: "",

    // Security Settings
    passwordMinLength: 8,
    passwordRequireSpecialChars: true,
    sessionTimeout: 30,
    maxLoginAttempts: 5,

    // Notifications
    emailNotifications: true,
    systemAlerts: true,
    maintenanceMode: false,

    // Backup Settings
    autoBackup: true,
    backupFrequency: "daily",
    backupRetention: 30,
  })

  const handleSave = (section: string) => {
    console.log(`Saving ${section} settings:`, settings)
    // Implement save logic
  }

  const handleChange = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Configurações do Sistema</h1>
        <p className="text-gray-600">Gerencie as configurações globais do RampSync</p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">Geral</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="security">Segurança</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
          <TabsTrigger value="backup">Backup</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Configurações Gerais
              </CardTitle>
              <CardDescription>Configurações básicas do sistema</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="systemName">Nome do Sistema</Label>
                  <Input
                    id="systemName"
                    value={settings.systemName}
                    onChange={(e) => handleChange("systemName", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="timezone">Fuso Horário</Label>
                  <Select value={settings.timezone} onValueChange={(value) => handleChange("timezone", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/Sao_Paulo">São Paulo (GMT-3)</SelectItem>
                      <SelectItem value="America/New_York">New York (GMT-5)</SelectItem>
                      <SelectItem value="Europe/London">London (GMT+0)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="systemDescription">Descrição do Sistema</Label>
                <Textarea
                  id="systemDescription"
                  value={settings.systemDescription}
                  onChange={(e) => handleChange("systemDescription", e.target.value)}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="language">Idioma</Label>
                <Select value={settings.language} onValueChange={(value) => handleChange("language", value)}>
                  <SelectTrigger className="w-full md:w-1/2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                    <SelectItem value="en-US">English (US)</SelectItem>
                    <SelectItem value="es-ES">Español</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={() => handleSave("general")}>
                <Save className="mr-2 h-4 w-4" />
                Salvar Configurações Gerais
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Configurações de Email
              </CardTitle>
              <CardDescription>Configure o servidor SMTP para envio de emails</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="smtpHost">Servidor SMTP</Label>
                  <Input
                    id="smtpHost"
                    value={settings.smtpHost}
                    onChange={(e) => handleChange("smtpHost", e.target.value)}
                    placeholder="smtp.gmail.com"
                  />
                </div>
                <div>
                  <Label htmlFor="smtpPort">Porta SMTP</Label>
                  <Input
                    id="smtpPort"
                    value={settings.smtpPort}
                    onChange={(e) => handleChange("smtpPort", e.target.value)}
                    placeholder="587"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="smtpUser">Usuário SMTP</Label>
                  <Input
                    id="smtpUser"
                    value={settings.smtpUser}
                    onChange={(e) => handleChange("smtpUser", e.target.value)}
                    placeholder="usuario@exemplo.com"
                  />
                </div>
                <div>
                  <Label htmlFor="smtpPassword">Senha SMTP</Label>
                  <Input
                    id="smtpPassword"
                    type="password"
                    value={settings.smtpPassword}
                    onChange={(e) => handleChange("smtpPassword", e.target.value)}
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="emailFrom">Email Remetente</Label>
                <Input
                  id="emailFrom"
                  value={settings.emailFrom}
                  onChange={(e) => handleChange("emailFrom", e.target.value)}
                  placeholder="noreply@rampsync.com"
                />
              </div>

              <Button onClick={() => handleSave("email")}>
                <Save className="mr-2 h-4 w-4" />
                Salvar Configurações de Email
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Configurações de Segurança
              </CardTitle>
              <CardDescription>Configure as políticas de segurança do sistema</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="passwordMinLength">Tamanho Mínimo da Senha</Label>
                  <Input
                    id="passwordMinLength"
                    type="number"
                    value={settings.passwordMinLength}
                    onChange={(e) => handleChange("passwordMinLength", Number.parseInt(e.target.value))}
                    min="6"
                    max="20"
                  />
                </div>
                <div>
                  <Label htmlFor="sessionTimeout">Timeout da Sessão (minutos)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={settings.sessionTimeout}
                    onChange={(e) => handleChange("sessionTimeout", Number.parseInt(e.target.value))}
                    min="5"
                    max="120"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="maxLoginAttempts">Máximo de Tentativas de Login</Label>
                <Input
                  id="maxLoginAttempts"
                  type="number"
                  value={settings.maxLoginAttempts}
                  onChange={(e) => handleChange("maxLoginAttempts", Number.parseInt(e.target.value))}
                  min="3"
                  max="10"
                  className="w-full md:w-1/2"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="passwordRequireSpecialChars"
                  checked={settings.passwordRequireSpecialChars}
                  onCheckedChange={(checked) => handleChange("passwordRequireSpecialChars", checked)}
                />
                <Label htmlFor="passwordRequireSpecialChars">Exigir caracteres especiais na senha</Label>
              </div>

              <Button onClick={() => handleSave("security")}>
                <Save className="mr-2 h-4 w-4" />
                Salvar Configurações de Segurança
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Configurações de Notificações
              </CardTitle>
              <CardDescription>Configure as notificações do sistema</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="emailNotifications"
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => handleChange("emailNotifications", checked)}
                  />
                  <Label htmlFor="emailNotifications">Notificações por Email</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="systemAlerts"
                    checked={settings.systemAlerts}
                    onCheckedChange={(checked) => handleChange("systemAlerts", checked)}
                  />
                  <Label htmlFor="systemAlerts">Alertas do Sistema</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="maintenanceMode"
                    checked={settings.maintenanceMode}
                    onCheckedChange={(checked) => handleChange("maintenanceMode", checked)}
                  />
                  <Label htmlFor="maintenanceMode">Modo de Manutenção</Label>
                </div>
              </div>

              <Button onClick={() => handleSave("notifications")}>
                <Save className="mr-2 h-4 w-4" />
                Salvar Configurações de Notificações
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backup">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Configurações de Backup
              </CardTitle>
              <CardDescription>Configure os backups automáticos do sistema</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-2">
                <Switch
                  id="autoBackup"
                  checked={settings.autoBackup}
                  onCheckedChange={(checked) => handleChange("autoBackup", checked)}
                />
                <Label htmlFor="autoBackup">Backup Automático</Label>
              </div>

              {settings.autoBackup && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="backupFrequency">Frequência do Backup</Label>
                    <Select
                      value={settings.backupFrequency}
                      onValueChange={(value) => handleChange("backupFrequency", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">A cada hora</SelectItem>
                        <SelectItem value="daily">Diário</SelectItem>
                        <SelectItem value="weekly">Semanal</SelectItem>
                        <SelectItem value="monthly">Mensal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="backupRetention">Retenção (dias)</Label>
                    <Input
                      id="backupRetention"
                      type="number"
                      value={settings.backupRetention}
                      onChange={(e) => handleChange("backupRetention", Number.parseInt(e.target.value))}
                      min="1"
                      max="365"
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                <Button onClick={() => handleSave("backup")}>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Configurações de Backup
                </Button>
                <Button variant="outline">
                  <Database className="mr-2 h-4 w-4" />
                  Executar Backup Agora
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
