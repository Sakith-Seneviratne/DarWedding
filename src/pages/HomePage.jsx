import { useCallback, useEffect, useState } from 'react'
import { SiteLayout } from '../components/SiteLayout'
import { SplashScreen } from '../components/SplashScreen'
import { DetailsSection } from '../components/sections/DetailsSection'
import { HeroSection } from '../components/sections/HeroSection'
import { RsvpSection } from '../components/sections/RsvpSection'

export function HomePage() {
  const [splashMounted, setSplashMounted] = useState(true)
  const [contentVisible, setContentVisible] = useState(false)

  const handleSplashReveal = useCallback(() => setContentVisible(true), [])
  const handleSplashComplete = useCallback(() => setSplashMounted(false), [])

  useEffect(() => {
    if (!contentVisible) return

    const hash = window.location.hash
    if (!hash) return

    const scrollToHash = () => {
      document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' })
    }

    const frame = window.requestAnimationFrame(scrollToHash)
    return () => window.cancelAnimationFrame(frame)
  }, [contentVisible])

  return (
    <>
      {splashMounted && (
        <SplashScreen
          onReveal={handleSplashReveal}
          onComplete={handleSplashComplete}
        />
      )}
      <SiteLayout contentVisible={contentVisible}>
        <HeroSection key={String(contentVisible)} />
        <DetailsSection />
        <RsvpSection />
      </SiteLayout>
    </>
  )
}
