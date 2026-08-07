'use client'

import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { label: 'Início', href: '#inicio' },
  { label: 'Quem Somos', href: '#quem-somos' },
  { label: 'Áreas de Atuação', href: '#areas-de-atuacao' },
  { label: 'Equipe', href: '#equipe' },
  { label: 'Contato', href: '#contato' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)

    onScroll()

    window.addEventListener('scroll', onScroll)

    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-500',
        scrolled
          ? 'border-b border-border bg-background/90 backdrop-blur-md'
          : 'border-b border-transparent bg-transparent',
      )}
    >
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
        {/* Logo */}
        <a
          href="#inicio"
          className="text-lg font-medium tracking-wide text-foreground"
        >
          Oliveira & Vasconcelos
        </a>

        {/* Menu desktop */}
        <ul className="hidden items-center gap-9 lg:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm font-light tracking-wide text-muted-foreground transition-colors hover:text-primary"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Botão desktop */}
        <div className="hidden lg:block">
          <a
            href="#contato"
            className="inline-flex h-10 items-center justify-center rounded-none border border-primary bg-transparent px-6 text-sm font-normal tracking-wide text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            Agendar Consulta
          </a>
        </div>

        {/* Menu mobile */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="text-foreground lg:hidden"
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={open}
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </nav>

      {/* Menu mobile aberto */}
      {open && (
        <div className="border-t border-border bg-background px-6 py-6 lg:hidden">
          <ul className="flex flex-col gap-5">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="text-base font-light text-muted-foreground transition-colors hover:text-primary"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <a
            href="#contato"
            onClick={() => setOpen(false)}
            className="mt-6 inline-flex h-10 w-full items-center justify-center rounded-none border border-primary bg-transparent text-sm font-normal tracking-wide text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            Agendar Consulta
          </a>
        </div>
      )}
    </header>
  )
}