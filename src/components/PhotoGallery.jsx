import { useEffect, useRef, useState } from 'react'
import weddingRings from '../assets/weddingrings.png'
import { PHOTO_GALLERY_POLL_MS } from '../config/photos'

function GalleryLoadingState() {
  return (
    <div
      className="flex flex-col items-center justify-center py-14 sm:py-16"
      role="status"
      aria-live="polite"
    >
      <span className="sr-only">Loading gallery</span>
      <img
        src={weddingRings}
        alt=""
        decoding="async"
        draggable={false}
        className="splash-rings-wiggle h-auto w-full max-w-[min(14rem,48vw)] select-none object-contain sm:max-w-[min(16rem,40vw)]"
      />
    </div>
  )
}

async function loadPhotos(apiUrl) {
  const url = new URL(apiUrl.trim())
  url.searchParams.set('action', 'list')

  const res = await fetch(url.toString())
  const data = await res.json().catch(() => null)

  if (!res.ok || !data?.ok) {
    const msg =
      (typeof data?.error === 'string' && data.error) ||
      'Could not load the gallery.'
    throw new Error(msg)
  }

  return Array.isArray(data.photos) ? data.photos : []
}

const POLAROID_TILTS = [
  '-rotate-1 sm:-rotate-1',
  'rotate-1 sm:rotate-1',
  '-rotate-[1.5deg] sm:-rotate-2',
  'rotate-[0.5deg]',
  '-rotate-[0.5deg]',
  'rotate-[1.5deg] sm:rotate-2',
]

/** Width % within the grid cell — wider for landscape, narrower for tall portraits (sm+). */
function getPolaroidWidthPercent(width, height) {
  if (!width || !height) return 100

  const isMobile = window.matchMedia('(max-width: 639px)').matches
  if (isMobile) return 100

  const ratio = width / height
  if (ratio >= 1.45) return 100
  if (ratio >= 1.1) return 96
  if (ratio <= 0.62) return 78
  if (ratio <= 0.82) return 86
  return 92
}

function PolaroidCard({ photo, index }) {
  const [size, setSize] = useState({ widthPercent: 100, loaded: false })

  const guestName =
    typeof photo.guestName === 'string' ? photo.guestName.trim() : ''
  const message = typeof photo.message === 'string' ? photo.message.trim() : ''
  const alt = guestName
    ? `Photo shared by ${guestName}`
    : message
      ? `Photo with message: ${message}`
      : photo.name || 'Guest photo'
  const tilt = POLAROID_TILTS[index % POLAROID_TILTS.length]

  function handleImageLoad(event) {
    const { naturalWidth, naturalHeight } = event.currentTarget
    setSize({
      widthPercent: getPolaroidWidthPercent(naturalWidth, naturalHeight),
      loaded: true,
    })
  }

  const floatDelay = `${(index % 6) * 0.45}s`
  const floatDuration = `${5 + (index % 4) * 0.6}s`

  return (
    <li
      className="polaroid-float flex w-full justify-center"
      style={{ animationDelay: floatDelay, animationDuration: floatDuration }}
    >
      <a
        href={photo.thumbnailUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{ width: size.loaded ? `${size.widthPercent}%` : '100%' }}
        className={`bg-boho-lace block w-full max-w-full p-2 shadow-[0_6px_20px_-4px_rgb(42_42_42/0.18),0_2px_6px_-2px_rgb(42_42_42/0.08)] transition duration-300 hover:z-10 hover:scale-[1.03] hover:shadow-[0_14px_32px_-8px_rgb(42_42_42/0.22),0_4px_10px_-4px_rgb(42_42_42/0.1)] sm:max-w-none sm:p-3 ${message ? 'pb-4 sm:pb-6' : 'pb-5 sm:pb-8'} ${tilt} hover:rotate-0 ${size.loaded ? 'opacity-100' : 'opacity-95'}`}
      >
        <div className="bg-boho-cream-deep/40 overflow-hidden">
          <img
            src={photo.thumbnailUrl}
            alt={alt}
            loading="lazy"
            decoding="async"
            onLoad={handleImageLoad}
            className="h-auto w-full transition duration-500 group-hover:brightness-[1.02]"
          />
        </div>
        {(guestName || message) && (
          <div className="mt-2 px-0.5 text-center sm:mt-3.5 sm:px-1">
            {guestName ? (
              <p
                className="font-polaroid text-boho-ink truncate text-base leading-tight sm:text-2xl"
                title={guestName}
              >
                {guestName}
              </p>
            ) : null}
            {message ? (
              <p
                className="text-boho-ink-soft font-body mt-1 line-clamp-3 text-xs leading-snug sm:text-sm"
                title={message}
              >
                {message}
              </p>
            ) : null}
          </div>
        )}
      </a>
    </li>
  )
}

export function PhotoGallery({ apiUrl, refreshKey = 0 }) {
  const [photos, setPhotos] = useState([])
  const [status, setStatus] = useState('loading')
  const photosRef = useRef(photos)
  const isConfigured = Boolean(apiUrl?.trim())

  useEffect(() => {
    photosRef.current = photos
  }, [photos])

  useEffect(() => {
    if (!isConfigured) {
      return
    }

    let cancelled = false

    async function refresh() {
      try {
        const nextPhotos = await loadPhotos(apiUrl)
        if (cancelled) {
          return
        }
        setPhotos(nextPhotos)
        setStatus('ready')
      } catch {
        if (cancelled) {
          return
        }
        if (photosRef.current.length === 0) {
          setStatus('loading')
        }
      }
    }

    refresh()
    const interval = setInterval(refresh, PHOTO_GALLERY_POLL_MS)
    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [apiUrl, isConfigured, refreshKey])

  if (!isConfigured) {
    return null
  }

  if (status === 'loading') {
    return <GalleryLoadingState />
  }

  if (photos.length === 0) {
    return (
      <div className="hero-fade-in">
        <p className="text-boho-ink-soft text-center font-body text-base leading-relaxed">
          No photos yet — be the first to share a moment from the day.
        </p>
      </div>
    )
  }

  return (
    <div className="hero-fade-in space-y-4">
      <p className="text-boho-earth text-center font-body text-[0.65rem] uppercase tracking-[0.24em] sm:text-xs sm:tracking-[0.28em]">
        {photos.length} {photos.length === 1 ? 'photo' : 'photos'} · updates every 30s
      </p>
      <ul className="mx-auto grid w-full grid-cols-2 gap-x-2.5 gap-y-4 sm:grid-cols-3 sm:gap-x-5 sm:gap-y-7">
        {photos.map((photo, index) => (
          <PolaroidCard key={photo.id} photo={photo} index={index} />
        ))}
      </ul>
    </div>
  )
}
