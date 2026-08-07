'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Check } from 'lucide-react'

const PILLARS = [
  'Experiência jurídica consolidada',
  'Atendimento personalizado e próximo',
  'Transparência em cada etapa do processo',
  'Ética e compromisso profissional',
  'Soluções jurídicas eficientes e estratégicas',
]

export function About() {
  return (
    <section id="quem-somos" className="bg-background py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
            className="relative aspect-[4/5] w-full overflow-hidden lg:order-2"
          >
            <Image
              src="/images/about-office.png"
              alt="Sala de reuniões do escritório Oliveira e Vasconcelos Advogados"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 border border-primary/20" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
            className="flex flex-col justify-center lg:order-1"
          >
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-primary">
              Quem Somos
            </p>
            <h2 className="mt-5 text-balance font-serif text-4xl leading-tight text-foreground md:text-5xl">
              Tradição, Estratégia e Compromisso
            </h2>
            <p className="mt-6 text-pretty text-base font-light leading-relaxed text-muted-foreground">
              Somos um escritório dedicado a oferecer assessoria jurídica de excelência para
              empresas e pessoas físicas. Combinamos profundo conhecimento técnico com uma
              atuação próxima e estratégica, construindo soluções que protegem os interesses
              dos nossos clientes em cada etapa &mdash; da consultoria preventiva à defesa em
              processos complexos.
            </p>

            <ul className="mt-9 flex flex-col gap-4">
              {PILLARS.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Check className="mt-0.5 size-4 shrink-0 text-primary" strokeWidth={1.5} />
                  <span className="text-sm font-light text-foreground/90">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
