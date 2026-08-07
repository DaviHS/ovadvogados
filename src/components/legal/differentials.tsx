'use client'

import { motion } from 'framer-motion'
import { UserCheck, Compass, GraduationCap, Lock, Zap, Headset } from 'lucide-react'

const ITEMS = [
  { icon: UserCheck, title: 'Atendimento Personalizado', description: 'Cada cliente é acompanhado de perto, com dedicação e escuta ativa.' },
  { icon: Compass, title: 'Estratégia Jurídica Preventiva', description: 'Antecipamos riscos antes que se tornem problemas.' },
  { icon: GraduationCap, title: 'Equipe Altamente Qualificada', description: 'Profissionais especializados nas mais diversas áreas do direito.' },
  { icon: Lock, title: 'Transparência e Segurança', description: 'Clareza em honorários, prazos e andamento processual.' },
  { icon: Zap, title: 'Soluções Rápidas e Eficientes', description: 'Respostas ágeis sem comprometer o rigor técnico.' },
  { icon: Headset, title: 'Suporte Consultivo Permanente', description: 'Disponibilidade contínua para orientação jurídica.' },
]

export function Differentials() {
  return (
    <section className="relative bg-card py-24 md:py-32">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-primary">Diferenciais</p>
          <h2 className="mt-5 text-balance font-serif text-4xl leading-tight text-foreground md:text-5xl">
            Por Que Escolher Nosso Escritório
          </h2>
        </div>

        <div className="mt-16 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {ITEMS.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
              className="flex gap-5"
            >
              <item.icon className="mt-1 size-6 shrink-0 text-primary" strokeWidth={1.25} />
              <div>
                <h3 className="font-serif text-lg text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm font-light leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
