"use client"

import { useState } from "react"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function Header() {
  const [menuAberto, setMenuAberto] = useState(false)
  const { data: session } = useSession()

  const links = [
    { href: "#inicio", label: "Início" },
    { href: "#solucoes", label: "Soluções" },
    { href: "#beneficios", label: "Benefícios" },
    { href: "#validacoes", label: "Validações" },
    { href: "#contato", label: "Contato" },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b shadow-sm">
      <div className="mx-auto max-w-7xl px-4 flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Image
            src="/logo-aviao.png"
            alt="RampSync"
            width={40}
            height={20}
            className="object-contain"
            priority
          />
          <span className="text-lg font-bold text-primary">RampSync</span>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-sm font-medium text-gray-700 hover:text-primary transition-colors"
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          {session ? (
            <>
              <Button asChild variant="outline">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <Button variant="ghost" onClick={() => signOut()}>
                Sair
              </Button>
            </>
          ) : (
            <Button asChild variant="default">
              <Link href="/sign-in">Área do Cliente</Link>
            </Button>
          )}
        </div>

        <button
          className="block md:hidden p-2"
          onClick={() => setMenuAberto(!menuAberto)}
          aria-label="Menu"
        >
          {menuAberto ? <X className="text-primary" /> : <Menu className="text-primary" />}
        </button>
      </div>

      {menuAberto && (
        <div className="md:hidden bg-white shadow-md border-t">
          <nav className="flex flex-col px-4 py-4 space-y-2">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-sm font-medium text-gray-700 hover:text-primary transition-colors"
                onClick={() => setMenuAberto(false)}
              >
                {label}
              </Link>
            ))}
            <div className="pt-4 flex flex-col gap-2">
              {session ? (
                <>
                  <Button asChild variant="outline">
                    <Link href="/atendimentos" onClick={() => setMenuAberto(false)}>
                      Dashboard
                    </Link>
                  </Button>
                  <Button variant="ghost" onClick={() => signOut()}>
                    Sair
                  </Button>
                </>
              ) : (
                <Button asChild variant="default">
                  <Link href="/sign-in" onClick={() => setMenuAberto(false)}>
                    Área do Cliente
                  </Link>
                </Button>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
