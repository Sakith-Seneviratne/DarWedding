import { useEffect, useState } from 'react'
import { PHOTO_GALLERY_POLL_MS } from '../config/photos'

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
  '-rotate-1',
  'rotate-1',
  '-rotate-2',
  'rotate-[0.5deg]',
  '-rotate-[0.5deg]',
  'rotate-2',
]

/** Width % within the column — wider for landscape, narrower for tall portraits. */
function getPolaroidWidthPercent(width, height) {
  if (!width || !height) return 100

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
      className="polaroid-float mb-5 break-inside-avoid sm:mb-7"
      style={{ animationDelay: floatDelay, animationDuration: floatDuration }}
    >
      <a
        href={photo.thumbnailUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{ width: `${size.widthPercent}%` }}
        className={`bg-boho-lace mx-auto block p-2.5 shadow-[0_6px_20px_-4px_rgb(42_42_42/0.18),0_2px_6px_-2px_rgb(42_42_42/0.08)] transition duration-300 hover:z-10 hover:scale-[1.03] hover:shadow-[0_14px_32px_-8px_rgb(42_42_42/0.22),0_4px_10px_-4px_rgb(42_42_42/0.1)] sm:p-3 ${message ? 'pb-5 sm:pb-6' : 'pb-7 sm:pb-8'} ${tilt} hover:rotate-0 ${size.loaded ? 'opacity-100' : 'opacity-95'}`}
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
          <div className="mt-3 px-1 text-center sm:mt-3.5">
            {guestName ? (
              <p
                className="font-polaroid text-boho-ink truncate text-xl leading-tight sm:text-2xl"
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
  const [errorMessage, setErrorMessage] = useState('')
  const isConfigured = Boolean(apiUrl?.trim())

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
        setErrorMessage('')
      } catch (err) {
        if (cancelled) {
          return
        }
        setStatus('error')
        setErrorMessage(
          err instanceof Error ? err.message : 'Could not load the gallery.',
        )
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
    return (
      <p className="text-boho-earth text-center font-body text-sm">
        Loading gallery…
      </p>
    )
  }

  if (status === 'error') {
    return (
      <p className="text-boho-rose-deep text-center font-body text-sm" role="alert">
        {errorMessage}
      </p>
    )
  }

  if (photos.length === 0) {
    return (
      <p className="text-boho-ink-soft text-center font-body text-base leading-relaxed">
        No photos yet — be the first to share a moment from the day.
      </p>
    )
  }

  return (
    <div className="space-y-4">
      <p className="text-boho-earth text-center font-body text-xs uppercase tracking-[0.28em]">
        {photos.length} {photos.length === 1 ? 'photo' : 'photos'} · updates every 30s
      </p>
      <ul className="columns-2 gap-x-5 px-1 sm:columns-3 sm:gap-x-7 sm:px-2">
        {photos.map((photo, index) => (
          <PolaroidCard key={photo.id} photo={photo} index={index} />
        ))}
      </ul>
    </div>
  )
}
