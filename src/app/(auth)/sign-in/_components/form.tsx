"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Fields from "./fields"
import { Scale } from "lucide-react"
import { toast } from "sonner"

export default function Form() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setIsLoading(true)

    const toastId = toast.loading("Acesso à plataforma")

    // Simula uma pequena validação para manter a experiência do formulário
    setTimeout(() => {
      setIsLoading(false)

      toast.info("Plataforma em desenvolvimento", {
        id: toastId,
        description:
          "O acesso ao sistema estará disponível em breve.",
        duration: 5000,
      })
    }, 700)
  }

  const handleSupportClick = () => {
    const phoneNumber = "5511967701575"
    const message =
      "Olá! Preciso de ajuda com o acesso ao Oliveira e Vasconcelos Advogados."
    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`

    window.open(whatsappUrl, "_blank")
  }

  return (
    <Card className="w-full max-w-md border-border shadow-sm">
      <CardHeader className="space-y-4 text-center">
        <div className="mx-auto flex size-12 items-center justify-center border border-border">
          <Scale
            className="size-5 text-primary"
            strokeWidth={1.5}
          />
        </div>

        <div>
          <CardTitle className="font-serif text-2xl font-normal">
            Área do Membro
          </CardTitle>

          <CardDescription className="mt-2 text-sm font-light">
            Entre com suas credenciais para acessar sua conta
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <Fields
            email={email}
            password={password}
            onEmailChange={setEmail}
            onPasswordChange={setPassword}
            showPassword={showPassword}
            onToggleShowPassword={() =>
              setShowPassword(!showPassword)
            }
          />

          <Button
            type="submit"
            disabled={isLoading}
            className="h-11 w-full rounded-none font-normal tracking-wide"
          >
            {isLoading ? "Verificando..." : "Entrar"}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col gap-3 border-t border-border pt-6">
        <p className="text-center text-xs font-light text-muted-foreground">
          Perdeu o acesso?
        </p>

        <button
          type="button"
          onClick={handleSupportClick}
          className="text-xs font-medium tracking-wide text-primary transition-colors hover:text-primary/80"
        >
          Fale com o suporte
        </button>

        <Link
          href="/"
          className="mt-2 text-xs font-light text-muted-foreground transition-colors hover:text-primary"
        >
          Voltar para o site
        </Link>
      </CardFooter>
    </Card>
  )
}