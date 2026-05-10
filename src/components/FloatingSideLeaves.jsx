import { useEffect, useState } from 'react'
import leftLeaf from '../assets/leftleaf.png'
import rightLeaf from '../assets/rightlead.png'

/**
 * Fixed watercolor foliage on both sides of the viewport (does not scroll).
 * pointer-events-none so links and forms stay usable.
 * On small screens, leaves slide further off-canvas while RSVP is in view.
 */
export function FloatingSideLeaves() {
  const [rsvpInView, setRsvpInView] = useState(false)

  useEffect(() => {
    const el = document.getElementById('rsvp')
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setRsvpInView(!!entry?.isIntersecting)
      },
      {
        root: null,
        threshold: 0.1,
        rootMargin: '0px 0px -6% 0px',
      },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const asideLeft = rsvpInView
    ? 'motion-safe:max-sm:-translate-x-[min(95vw,320px)] motion-reduce:max-sm:opacity-35'
    : ''
  const asideRight = rsvpInView
    ? 'motion-safe:max-sm:translate-x-[min(95vw,320px)] motion-reduce:max-sm:opacity-35'
    : ''

  return (
    <div
      className="pointer-events-none fixed inset-0 z-40 overflow-visible"
      aria-hidden="true"
    >
      <img
        src={leftLeaf}
        alt=""
        width={560}
        height={1200}
        decoding="async"
        className={`absolute top-2/3 left-[-28%] max-h-[min(55vh,480px)] w-[min(72vw,260px)] max-w-[75%] -translate-y-1/2 object-contain object-left transition-[translate,opacity] duration-500 ease-out will-change-auto max-sm:motion-reduce:duration-[3.5s] max-sm:motion-reduce:ease-in-out max-sm:motion-safe:transform-gpu max-sm:motion-safe:duration-[4000ms] max-sm:motion-safe:ease-in-out max-sm:motion-safe:will-change-transform max-sm:motion-safe:delay-0 sm:left-[-180px] sm:max-h-[min(85vh,1000px)] sm:w-[min(52vw,620px)] sm:max-w-[58%] lg:left-[-250px] lg:max-h-[min(96vh,1200px)] ${asideLeft}`}
      />
      <img
        src={rightLeaf}
        alt=""
        width={560}
        height={1200}
        decoding="async"
        className={`absolute top-1/2 right-[-46%] max-h-[min(55vh,480px)] w-[min(72vw,260px)] max-w-[75%] -translate-y-1/2 object-contain object-right transition-[translate,opacity] duration-500 ease-out will-change-auto max-sm:motion-reduce:duration-[3.5s] max-sm:motion-reduce:ease-in-out max-sm:motion-safe:transform-gpu max-sm:motion-safe:duration-[4000ms] max-sm:motion-safe:ease-in-out max-sm:motion-safe:will-change-transform max-sm:motion-safe:delay-0 sm:right-[-220px] sm:max-h-[min(85vh,1000px)] sm:w-[min(52vw,620px)] sm:max-w-[58%] lg:right-[-300px] lg:max-h-[min(96vh,1200px)] ${asideRight}`}
      />
    </div>
  )
}
