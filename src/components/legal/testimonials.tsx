'use client'

import { motion } from 'framer-motion'
import { Star } from 'lucide-react'

const TESTIMONIALS = [
  {
    name: 'Ricardo Almeida',
    company: 'CEO, Grupo Almeida Log\u00edstica',
    quote:
      'A condução do nosso caso empresarial foi impecável. Clareza, agilidade e um resultado muito acima do esperado.',
  },
  {
    name: 'Fernanda Costa',
    company: 'Diretora Financeira, Nortex Ind\u00fastria',
    quote:
      'O planejamento tributário estruturado pelo escritório reduziu significativamente nossos riscos fiscais. Excelência técnica do início ao fim.',
  },
  {
    name: 'Carlos Menezes',
    company: 'Empresário',
    quote:
      'Fui muito bem orientado em um processo delicado. Profissionalismo, ética e um acompanhamento próximo em cada etapa.',
  },
]

export function Testimonials() {
  return (
    <section className="bg-background py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-primary">
            Depoimentos
          </p>
          <h2 className="mt-5 text-balance font-serif text-4xl leading-tight text-foreground md:text-5xl">
            A Confiança de Quem Já Foi Atendido
          </h2>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <motion.figure
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              className="flex flex-col border border-border bg-card p-8"
            >
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star key={idx} className="size-4 fill-primary text-primary" strokeWidth={0} />
                ))}
              </div>
              <blockquote className="mt-6 flex-1 text-pretty text-sm font-light leading-relaxed text-foreground/90">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-6 border-t border-border pt-5">
                <p className="text-sm text-foreground">{t.name}</p>
                <p className="mt-0.5 text-xs font-light text-muted-foreground">{t.company}</p>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  )
}
