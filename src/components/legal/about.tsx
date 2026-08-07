'use client'

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

const PILLARS = [
  'Atendimento personalizado e próximo',
  'Análise individual de cada caso',
  'Transparência em todas as etapas',
  'Ética e compromisso profissional',
  'Soluções jurídicas estratégicas',
]

export function About() {
  return (
    <section
      id="quem-somos"
      className="relative overflow-hidden bg-background py-24 md:py-32"
    >
      <div className="mx-auto grid max-w-7xl gap-16 px-6 md:px-10 lg:grid-cols-2 lg:items-center lg:gap-24">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="relative aspect-[4/5] w-full overflow-hidden bg-muted lg:order-2"
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="font-serif text-2xl text-muted-foreground/40">
              Oliveira & Vasconcelos
            </p>
          </div>
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
            Estratégia, Proximidade e Compromisso
          </h2>

          <p className="mt-6 text-pretty text-base font-light leading-relaxed text-muted-foreground">
            O Oliveira & Vasconcelos Advogados nasceu com o propósito de oferecer
            uma advocacia próxima, estratégica e comprometida com as necessidades
            de cada cliente.
          </p>

          <p className="mt-4 text-pretty text-base font-light leading-relaxed text-muted-foreground">
            Atuamos de forma personalizada, buscando compreender cada situação
            de maneira individual para construir soluções jurídicas claras,
            seguras e alinhadas aos objetivos de nossos clientes.
          </p>

          <ul className="mt-9 flex flex-col gap-4">
            {PILLARS.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <Check
                  className="mt-0.5 size-4 shrink-0 text-primary"
                  strokeWidth={1.5}
                />

                <span className="text-sm font-light text-foreground/90">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  )
}