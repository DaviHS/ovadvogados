'use client'

import { motion } from 'framer-motion'
import { ArrowRight, MessageCircle } from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

export function Hero() {
  return (
    <section id="inicio" className="relative flex min-h-[100vh] items-center overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/images/hero-bg.png"
          alt=""
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/40" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pt-28 md:px-10">
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
          Atuação estratégica, consultiva e contenciosa com foco na proteção dos seus
          interesses e na construção de soluções jurídicas seguras.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-11 flex flex-col gap-4 sm:flex-row"
        >
          <Button
            render={<a href="#contato" />}
            nativeButton={false}
            size="lg"
            className="rounded-none bg-primary px-8 text-sm font-normal tracking-wide text-primary-foreground hover:bg-primary/90"
          >
            Agendar Consulta
            <ArrowRight className="size-4" strokeWidth={1.5} />
          </Button>
          <Button
            render={
              <a href="https://wa.me/5592000000000" target="_blank" rel="noopener noreferrer" />
            }
            nativeButton={false}
            size="lg"
            variant="outline"
            className="rounded-none border-border bg-transparent px-8 text-sm font-normal tracking-wide text-foreground hover:border-primary hover:text-primary"
          >
            <MessageCircle className="size-4" strokeWidth={1.5} />
            Falar pelo WhatsApp
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="mt-20 grid max-w-xl grid-cols-3 gap-8 border-t border-border pt-8"
        >
          {[
            { value: '15+', label: 'Anos de atuação' },
            { value: '400+', label: 'Causas conduzidas' },
            { value: '3', label: 'Áreas de excelência' },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="font-serif text-3xl text-primary">{stat.value}</p>
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
