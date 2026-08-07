'use client'

import { motion } from 'framer-motion'
import {
  Building2,
  Receipt,
  Briefcase,
  Scale,
  ShieldCheck,
  HeartHandshake,
  Gavel,
  FileSearch,
} from 'lucide-react'

const AREAS = [
  {
    icon: Building2,
    title: 'Direito Empresarial',
    description:
      'Estruturação societária, contratos e consultoria estratégica para empresas de todos os portes.',
  },
  {
    icon: Receipt,
    title: 'Direito Tributário',
    description:
      'Planejamento tributário e defesa em processos administrativos e judiciais fiscais.',
  },
  {
    icon: Briefcase,
    title: 'Direito Trabalhista',
    description:
      'Consultoria preventiva e representação em litígios nas esferas individual e coletiva.',
  },
  {
    icon: Scale,
    title: 'Direito Civil',
    description:
      'Atuação em contratos, responsabilidade civil, família e sucessões com precisão técnica.',
  },
  {
    icon: HeartHandshake,
    title: 'Direito do Consumidor',
    description: 'Defesa dos direitos do consumidor em relações de consumo complexas.',
  },
  {
    icon: FileSearch,
    title: 'Direito Previdenciário',
    description: 'Assessoria em benefícios, revisões e ações junto ao INSS.',
  },
  {
    icon: Gavel,
    title: 'Direito Penal Empresarial',
    description: 'Defesa técnica em investigações e processos penais de natureza econômica.',
  },
  {
    icon: ShieldCheck,
    title: 'Compliance e Gestão de Riscos',
    description: 'Programas de conformidade e mitigação de riscos jurídicos corporativos.',
  },
]

export function PracticeAreas() {
  return (
    <section id="areas-de-atuacao" className="bg-card py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-primary">
            Áreas de Atuação
          </p>
          <h2 className="mt-5 text-balance font-serif text-4xl leading-tight text-foreground md:text-5xl">
            Especialização em Cada Frente
          </h2>
        </div>

        <div className="mt-16 grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {AREAS.map((area, i) => (
            <motion.div
              key={area.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: (i % 4) * 0.08 }}
              className="group flex flex-col gap-4 bg-card p-8 transition-colors duration-300 hover:bg-background"
            >
              <area.icon
                className="size-7 text-primary transition-transform duration-300 group-hover:scale-110"
                strokeWidth={1.25}
              />
              <h3 className="font-serif text-lg leading-snug text-foreground">{area.title}</h3>
              <p className="text-sm font-light leading-relaxed text-muted-foreground">
                {area.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
