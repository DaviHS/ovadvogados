'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

const TEAM = [
  {
    name: 'Dra. Maria Rita Vasconcelos',
    role: 'Sócia-Fundadora',
    oab: 'OAB/AM 21.052',
    specialties: 'Direito Penal e Processo Penal, Direito Empresarial Trabalhista e Previdenciário',
    image: '/images/adv-maria-rita.png',
  },
  {
    name: 'Dr. Adriano Oliveira Girão',
    role: 'Sócio-Fundador',
    oab: 'OAB/AM 20.901',
    specialties: 'Direito Tributário, Direito Cível e Direito do Consumidor',
    image: '/images/adv-adriano-girao.png',
  },
]

export function Team() {
  return (
    <section id="equipe" className="bg-background py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-primary">Equipe</p>
          <h2 className="mt-5 text-balance font-serif text-4xl leading-tight text-foreground md:text-5xl">
            Advogados à Frente das Suas Causas
          </h2>
        </div>

        <div className="mt-16 grid gap-10 sm:grid-cols-2 lg:mx-auto lg:max-w-4xl">
          {TEAM.map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              className="group overflow-hidden border border-border bg-card"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src={member.image}
                  alt={`Foto de ${member.name}`}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
              </div>
              <div className="p-7">
                <h3 className="font-serif text-2xl text-foreground">{member.name}</h3>
                <p className="mt-1 text-sm font-light tracking-wide text-primary">{member.oab}</p>
                <p className="mt-1 text-xs font-light uppercase tracking-[0.2em] text-muted-foreground">
                  {member.role}
                </p>
                <p className="mt-4 text-sm font-light leading-relaxed text-muted-foreground">
                  {member.specialties}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
