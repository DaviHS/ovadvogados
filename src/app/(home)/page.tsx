import { Navbar } from '@/components/legal/navbar'
import { Hero } from '@/components/legal/hero'
import { About } from '@/components/legal/about'
import { PracticeAreas } from '@/components/legal/practice-areas'
import { Team } from '@/components/legal/team'
import { Differentials } from '@/components/legal/differentials'
import { Testimonials } from '@/components/legal/testimonials'
import { Cta } from '@/components/legal/cta'
import { Footer } from '@/components/legal/footer'

export default function Page() {
  return (
    <main className="relative">
      <Navbar />
      <Hero />
      <About />
      <PracticeAreas />
      <Team />
      <Differentials />
      <Testimonials />
      <Cta />
      <Footer />
    </main>
  )
}
