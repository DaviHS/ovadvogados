'use client'

import { motion } from 'framer-motion'
import { ArrowRight, MessageCircle, LogIn } from 'lucide-react'

export function Hero() {
  return (
    <section>
      <div>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-6 text-xs font-medium uppercase tracking-[0.3em] text-primary"
        >
          Advocacia Corporativa & Consultiva
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="max-w-3xl text-balance font-serif text-5xl leading-[1.08] text-foreground md:text-6xl lg:text-7xl"
        >
          Excelência Jurídica para Empresas e Pessoas
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="mt-7 max-w-xl text-pretty text-base font-light leading-relaxed text-muted-foreground md:text-lg"
        >
          Atuação estratégica, consultiva e contenciosa com foco na proteção dos
          seus interesses e na construção de soluções jurídicas seguras.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-11 flex flex-col gap-4 sm:flex-row"
        >
          <a
            href="#contato"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-none bg-primary px-8 text-sm font-normal tracking-wide text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Agendar Consulta
            <ArrowRight className="size-4" strokeWidth={1.5} />
          </a>

          <a
            href="https://wa.me/5592000000000"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-none border border-border bg-transparent px-8 text-sm font-normal tracking-wide text-foreground transition-colors hover:border-primary hover:text-primary"
          >
            <MessageCircle className="size-4" strokeWidth={1.5} />
            Falar pelo WhatsApp
          </a>
        </motion.div>

        {/* Área do cliente */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55 }}
          className="mt-6"
        >
          <a
            href="/sign-in"
            className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-primary"
          >
            <LogIn className="size-4" strokeWidth={1.5} />
            Acessar plataforma
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="mt-16 grid max-w-xl grid-cols-3 gap-8 border-t border-border pt-8"
        >
          {[
            { value: '100%', label: 'Atendimento personalizado' },
            { value: 'Estratégia', label: 'Foco em soluções jurídicas' },
            { value: '3', label: 'Áreas de atuação' },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="font-serif text-xl text-primary md:text-2xl">
                {stat.value}
              </p>

              <p className="mt-1 text-xs font-light leading-snug text-muted-foreground">
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}