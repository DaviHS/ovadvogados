"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface UnauthorizedProps {
  title?: string
  message?: string
  requiredPermission?: string
}

export function Unauthorized({ 
  title = "Acesso Não Autorizado",
  message = "Você não tem permissão para acessar este recurso",
  requiredPermission 
}: UnauthorizedProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <CardTitle className="text-xl">{title}</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">{message}</p>
          
          {requiredPermission && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm font-medium">Permissão necessária:</p>
              <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                {requiredPermission}
              </code>
            </div>
          )}

          <div className="flex gap-3 justify-center">
            <Button variant="outline" asChild>
              <Link href="/app">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar ao Início
              </Link>
            </Button>
            
            <Button asChild>
              <Link href="/app/support">
                Solicitar Acesso
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}