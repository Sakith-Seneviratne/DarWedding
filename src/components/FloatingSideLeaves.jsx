import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import leftLeaf from '../assets/leftleaf.png'
import rightLeaf from '../assets/rightlead.png'

const SLIDE_OFF_LEFT =
  'motion-safe:max-sm:-translate-x-[min(95vw,320px)] motion-reduce:max-sm:opacity-35'
const SLIDE_OFF_RIGHT =
  'motion-safe:max-sm:translate-x-[min(95vw,320px)] motion-reduce:max-sm:opacity-35'

const LEAF_BASE =
  'absolute max-h-[min(55vh,480px)] w-[min(72vw,260px)] max-w-[75%] -translate-y-1/2 object-contain transition-[translate,opacity] duration-500 ease-out will-change-auto max-sm:motion-reduce:duration-[3.5s] max-sm:motion-reduce:ease-in-out max-sm:motion-safe:transform-gpu max-sm:motion-safe:duration-[4000ms] max-sm:motion-safe:ease-in-out max-sm:motion-safe:will-change-transform max-sm:motion-safe:delay-0 sm:max-h-[min(85vh,1000px)] sm:w-[min(52vw,620px)] sm:max-w-[58%] lg:max-h-[min(96vh,1200px)]'

/**
 * Fixed watercolor foliage on both sides of the viewport (does not scroll).
 * pointer-events-none so links and forms stay usable.
 *
 * Home: on small screens, leaves slide off-canvas while RSVP is in view.
 * Photos: on small screens, leaves stay off-canvas until the gallery section
 * scrolls into view, then slide in from the sides.
 */
export function FloatingSideLeaves() {
  const { pathname } = useLocation()
  const isPhotosPage = pathname === '/photos'
  const [sectionInView, setSectionInView] = useState(false)

  const sectionId = isPhotosPage ? 'photos-gallery' : 'rsvp'

  useEffect(() => {
    const el = document.getElementById(sectionId)
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setSectionInView(!!entry?.isIntersecting)
      },
      {
        root: null,
        threshold: isPhotosPage ? 0.12 : 0.1,
        rootMargin: isPhotosPage ? '0px 0px -12% 0px' : '0px 0px -6% 0px',
      },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [isPhotosPage, sectionId])

  const slideOffScreen = isPhotosPage ? !sectionInView : sectionInView

  const asideLeft = slideOffScreen ? SLIDE_OFF_LEFT : ''
  const asideRight = slideOffScreen ? SLIDE_OFF_RIGHT : ''

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
        className={`${LEAF_BASE} top-2/3 left-[-28%] object-left sm:left-[-180px] lg:left-[-250px] ${asideLeft}`}
      />
      <img
        src={rightLeaf}
        alt=""
        width={560}
        height={1200}
        decoding="async"
        className={`${LEAF_BASE} top-1/2 right-[-46%] object-right sm:right-[-220px] lg:right-[-300px] ${asideRight}`}
      />
    </div>
  )
}
