import { useEffect, useState } from 'react'

const SHOW_MS = 2200
const REDUCED_SHOW_MS = 350
const REDUCED_FADE_MS = 150

export function SplashScreen({ onReveal, onComplete }) {
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const showMs = reduced ? REDUCED_SHOW_MS : SHOW_MS
    const fadeMs = reduced ? REDUCED_FADE_MS : 700

    const hideTimer = window.setTimeout(() => {
      setExiting(true)
      onReveal?.()
    }, showMs)
    const doneTimer = window.setTimeout(() => {
      onComplete?.()
    }, showMs + fadeMs)

    return () => {
      window.clearTimeout(hideTimer)
      window.clearTimeout(doneTimer)
    }
  }, [onComplete, onReveal])

  return (
    <div
      className={`invite-backdrop fixed inset-0 z-[100] flex flex-col items-center justify-center px-6 transition-opacity ease-out motion-reduce:transition-none ${
        exiting
          ? 'pointer-events-none opacity-0 duration-[700ms] motion-reduce:duration-150'
          : 'opacity-100 duration-[700ms]'
      }`}
      aria-hidden={exiting}
    >
      <div className="flex max-w-lg flex-col items-center text-center">
        <p className="text-boho-earth font-body mb-5 text-xs font-medium uppercase tracking-[0.42em] sm:text-sm">
          Together with their families
        </p>
        <h1
          aria-label="Darshanika and Kashyapa"
          className="relative flex flex-col items-center font-script text-boho-charcoal text-[clamp(2.5rem,10vw,4.5rem)] font-normal leading-[1.12]"
        >
          <span className="block origin-center -rotate-4 [text-shadow:0_1px_18px_rgb(253_252_249/0.95)]">
            Darshanika
          </span>
          <span className="block origin-center -rotate-4 [text-shadow:0_1px_18px_rgb(253_252_249/0.95)]">
            Kashyapa
          </span>
          <span
            className="font-ampersand text-boho-gold pointer-events-none absolute top-1/2 left-1/2 z-0 -translate-x-1/2 -translate-y-1/2 text-[clamp(1.85rem,7vw,3.5rem)] font-normal leading-none"
            aria-hidden="true"
          >
            &amp;
          </span>
        </h1>
        <div
          className="border-boho-gold/55 mx-auto mt-8 max-w-[14rem] border-t border-dotted"
          aria-hidden="true"
        />
        <p className="text-boho-charcoal font-body mt-2 text-lg tracking-[0.28em] sm:text-xl">
          11 · 06 · 2026
        </p>
      </div>
    </div>
  )
}
