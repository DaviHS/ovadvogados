import { MapPin, Phone, Mail, Camera, Link2 } from 'lucide-react'
import Image from 'next/image'

export function Footer() {
  return (
    <footer className="bg-background pt-16">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="grid gap-12 border-b border-border pb-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <a href="#inicio" className="flex items-center gap-3">
              <Image
                src="/ov-logo.png"
                alt="Oliveira e Vasconcelos Advogados"
                width={32}
                height={32}
                className="size-8 object-contain"
              />
              <span className="font-serif text-xl text-foreground">
                Oliveira <span className="text-primary">&</span> Vasconcelos
              </span>
            </a>
            <p className="mt-4 text-sm font-light leading-relaxed text-muted-foreground">
              Excelência jurídica para empresas e pessoas, com atuação estratégica e
              consultiva.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-medium uppercase tracking-[0.25em] text-primary">
              Contato
            </h3>
            <ul className="mt-4 flex flex-col gap-3 text-sm font-light text-muted-foreground">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 size-4 shrink-0 text-primary" strokeWidth={1.5} />
                <span>
                  Edifício Fórum Business Center
                  <br />
                  Av. André Araújo, nº 97, sala 216
                  <br />
                  Adrianópolis &ndash; Manaus/AM
                  <br />
                  CEP: 69057-025
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="size-4 shrink-0 text-primary" strokeWidth={1.5} />
                (92) 00000-0000
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="size-4 shrink-0 text-primary" strokeWidth={1.5} />
                contato@ovadvogados.com.br
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-medium uppercase tracking-[0.25em] text-primary">
              Navegação
            </h3>
            <ul className="mt-4 flex flex-col gap-3 text-sm font-light text-muted-foreground">
              <li><a href="#quem-somos" className="hover:text-primary">Quem Somos</a></li>
              <li><a href="#areas-de-atuacao" className="hover:text-primary">Áreas de Atuação</a></li>
              <li><a href="#equipe" className="hover:text-primary">Equipe</a></li>
              <li><a href="#contato" className="hover:text-primary">Contato</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-medium uppercase tracking-[0.25em] text-primary">
              Redes Sociais
            </h3>
            <div className="mt-4 flex gap-4">
              <a
                href="https://instagram.com/ov.advogados"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex size-10 items-center justify-center border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              >
                <Camera className="size-4" strokeWidth={1.5} />
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                className="flex size-10 items-center justify-center border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              >
                <Link2 className="size-4" strokeWidth={1.5} />
              </a>
            </div>
          </div>
        </div>

        <p className="py-8 text-center text-xs font-light text-muted-foreground">
          &copy; {new Date().getFullYear()} Oliveira e Vasconcelos Advogados. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  )
}
