import { useCallback, useState } from 'react'
import { FloatingSideLeaves } from './components/FloatingSideLeaves'
import { SiteFooter } from './components/SiteFooter'
import { SiteHeader } from './components/SiteHeader'
import { SplashScreen } from './components/SplashScreen'
import { DetailsSection } from './components/sections/DetailsSection'
import { HeroSection } from './components/sections/HeroSection'
import { RsvpSection } from './components/sections/RsvpSection'

export default function App() {
  const [splashMounted, setSplashMounted] = useState(true)
  const [contentVisible, setContentVisible] = useState(false)

  const handleSplashReveal = useCallback(() => setContentVisible(true), [])
  const handleSplashComplete = useCallback(() => setSplashMounted(false), [])

  return (
    <>
      {splashMounted && (
        <SplashScreen
          onReveal={handleSplashReveal}
          onComplete={handleSplashComplete}
        />
      )}
      <div
        className={`invite-backdrop relative min-h-svh text-boho-ink transition-opacity duration-700 ease-out motion-reduce:transition-none ${
          contentVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <FloatingSideLeaves />
        <SiteHeader />
        <main>
          <HeroSection key={String(contentVisible)} />
          <DetailsSection />
          <RsvpSection />
        </main>
        <SiteFooter />
      </div>
    </>
  )
}
