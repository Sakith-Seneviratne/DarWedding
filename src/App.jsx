import { FloatingSideLeaves } from './components/FloatingSideLeaves'
import { SiteFooter } from './components/SiteFooter'
import { SiteHeader } from './components/SiteHeader'
import { DetailsSection } from './components/sections/DetailsSection'
import { HeroSection } from './components/sections/HeroSection'
import { RsvpSection } from './components/sections/RsvpSection'

export default function App() {
  return (
    <div className="invite-backdrop relative text-boho-ink min-h-svh">
      <FloatingSideLeaves />
      <SiteHeader />
      <main>
        <HeroSection />
        <DetailsSection />
        <RsvpSection />
      </main>
      <SiteFooter />
    </div>
  )
}
