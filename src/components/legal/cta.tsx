'use client'

import { motion } from 'framer-motion'
import { ArrowRight, MessageCircle } from 'lucide-react'

export function Cta() {
  return (
    <section
      id="contato"
      className="relative overflow-hidden bg-card py-24 md:py-32"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <div className="mx-auto max-w-4xl px-6 text-center md:px-10">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-balance font-serif text-4xl leading-tight text-foreground md:text-5xl"
        >
          Precisa de Orientação Jurídica Especializada?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mx-auto mt-6 max-w-xl text-pretty text-base font-light leading-relaxed text-muted-foreground"
        >
          Nossa equipe está pronta para oferecer soluções jurídicas seguras e estratégicas
          para você ou sua empresa.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-10 flex flex-col justify-center gap-4 sm:flex-row"
        >
          <a
            href="mailto:contato@ovadvogados.com.br"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-none bg-primary px-8 text-sm font-normal tracking-wide text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Solicitar Atendimento
            <ArrowRight className="size-4" strokeWidth={1.5} />
          </a>

          <a
            href="https://wa.me/5592000000000"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-none border border-border bg-transparent px-8 text-sm font-normal tracking-wide text-foreground transition-colors hover:border-primary hover:text-primary"
          >
            <MessageCircle className="size-4" strokeWidth={1.5} />
            WhatsApp
          </a>
        </motion.div>
      </div>
    </section>
  )
}