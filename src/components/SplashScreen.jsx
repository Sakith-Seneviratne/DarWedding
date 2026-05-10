import { useEffect, useState } from 'react'
import weddingRings from '../assets/weddingrings.png'

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
      <img
        src={weddingRings}
        alt=""
        decoding="async"
        className="splash-rings-wiggle h-auto w-full max-w-[min(22rem,72vw)] select-none object-contain"
        draggable={false}
      />
    </div>
  )
}
