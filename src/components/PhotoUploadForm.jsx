import { useRef, useState } from 'react'
import { uploadPhotoToDrive } from '../lib/imageUpload'

const labelStyle =
  'text-boho-ink font-heading text-base font-medium tracking-wide'

function SuccessCheckIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}

export function PhotoUploadForm({ apiUrl, onUploaded }) {
  const [status, setStatus] = useState('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [progress, setProgress] = useState({ current: 0, total: 0 })
  const [uploadedCount, setUploadedCount] = useState(0)
  const [selectedFiles, setSelectedFiles] = useState([])
  const fileInputRef = useRef(null)

  function handleFileChange() {
    setSelectedFiles(Array.from(fileInputRef.current?.files ?? []))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setErrorMessage('')

    if (!apiUrl?.trim()) {
      setErrorMessage(
        'Photo upload is not configured. Add VITE_PHOTOS_API_URL to your .env file.',
      )
      return
    }

    const form = e.currentTarget
    const formData = new FormData(form)
    const guestName = String(formData.get('guest_name') ?? '').trim()
    const messageToCouple = String(formData.get('message_to_couple') ?? '').trim()
    const files = Array.from(fileInputRef.current?.files ?? [])

    if (files.length === 0) {
      setErrorMessage('Please choose at least one photo.')
      return
    }

    setStatus('uploading')
    setProgress({ current: 0, total: files.length })

    let succeeded = 0

    try {
      for (let i = 0; i < files.length; i++) {
        setProgress({ current: i + 1, total: files.length })
        await uploadPhotoToDrive({
          apiUrl,
          file: files[i],
          guestName,
          messageToCouple,
        })
        succeeded += 1
      }

      form.reset()
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      setSelectedFiles([])
      setUploadedCount(succeeded)
      setStatus('success')
      onUploaded?.()
    } catch (err) {
      setStatus('idle')
      const base =
        err instanceof Error ? err.message : 'Upload failed. Please try again.'
      if (succeeded > 0) {
        setErrorMessage(`${base} (${succeeded} of ${files.length} uploaded.)`)
        onUploaded?.()
      } else {
        setErrorMessage(base)
      }
    }
  }

  if (status === 'success') {
    return (
      <div
        className="border-boho-parchment/70 relative overflow-hidden rounded-sm border bg-gradient-to-b from-boho-lace via-boho-cream/90 to-boho-lavender-wash/30 px-6 py-12 text-center shadow-boho-soft sm:px-10 sm:py-14"
        role="status"
      >
        <div
          className="pointer-events-none absolute inset-x-0 -top-px h-20 bg-gradient-to-b from-boho-gold-light/30 to-transparent"
          aria-hidden="true"
        />
        <div className="relative flex flex-col items-center">
          <div className="border-boho-gold/70 bg-boho-lace text-boho-gold-foil ring-boho-parchment/50 mx-auto flex h-[4.25rem] w-[4.25rem] items-center justify-center rounded-full border-2 shadow-boho-soft ring-4">
            <SuccessCheckIcon className="h-9 w-9" />
          </div>
          <p className="text-boho-earth font-body mt-7 text-sm font-medium uppercase tracking-[0.28em]">
            {uploadedCount === 1 ? 'Photo shared' : 'Photos shared'}
          </p>
          <p className="font-script text-boho-sage-deep mt-3 text-3xl font-normal sm:text-[2.65rem]">
            Thank you!
          </p>
          <p className="text-boho-ink-soft mt-5 max-w-md font-body text-lg leading-relaxed">
            {uploadedCount === 1
              ? 'Your moment is on its way to our album. It should appear in the gallery shortly.'
              : `Your ${uploadedCount} photos are on their way to our album. They should appear in the gallery shortly.`}
          </p>
          <button
            type="button"
            onClick={() => setStatus('idle')}
            className="text-boho-gold hover:text-boho-gold-foil mt-8 font-body text-sm font-medium tracking-wide underline-offset-4 hover:underline"
          >
            Share more photos
          </button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10 pt-2">
      <div className="space-y-9">
        <div className="space-y-2">
          <label htmlFor="guest_name" className={labelStyle}>
            Your name <span className="text-boho-earth/70 font-normal">(optional)</span>
          </label>
          <input
            id="guest_name"
            name="guest_name"
            type="text"
            autoComplete="name"
            className="border-boho-parchment text-boho-ink placeholder:text-boho-earth/45 focus:border-boho-gold w-full border-0 border-b bg-transparent px-0 py-3 font-heading text-lg outline-none transition"
            placeholder="So we know who caught the moment"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="message_to_couple" className={labelStyle}>
            Your thoughts for the couple{' '}
            <span className="text-boho-earth/70 font-normal">(optional)</span>
          </label>
          <textarea
            id="message_to_couple"
            name="message_to_couple"
            rows={3}
            maxLength={500}
            className="border-boho-parchment text-boho-ink placeholder:text-boho-earth/45 focus:border-boho-gold w-full resize-none border-0 border-b bg-transparent px-0 py-3 font-body text-base leading-relaxed outline-none transition"
            placeholder="A wish, a memory, or a little note for Darshanika & Kashyapa"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="photos" className={labelStyle}>
            Photos
          </label>
          <input
            ref={fileInputRef}
            id="photos"
            name="photos"
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="text-boho-ink-soft file:bg-boho-cream file:text-boho-sage-deep hover:file:bg-boho-cream-deep w-full font-body text-sm file:mr-4 file:rounded-full file:border-0 file:px-4 file:py-2 file:text-sm file:font-medium"
          />
          {selectedFiles.length > 0 ? (
            <ul className="mt-3 space-y-1.5" aria-label="Selected photos">
              {selectedFiles.map((file) => (
                <li
                  key={`${file.name}-${file.lastModified}`}
                  className="bg-boho-sage/15 text-boho-sage-deep ring-boho-sage/30 truncate rounded-full px-3 py-1 font-body text-sm ring-1"
                  title={file.name}
                >
                  {file.name}
                </li>
              ))}
            </ul>
          ) : null}
          <p className="text-boho-earth font-body text-sm">
            Choose one or more images from your camera roll. Large photos are resized
            automatically.
          </p>
        </div>
      </div>

      {errorMessage ? (
        <p className="text-boho-rose-deep font-body text-base" role="alert">
          {errorMessage}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status === 'uploading'}
        className="from-boho-gold-light via-boho-gold to-boho-gold-foil text-white hover:via-boho-gold-foil mt-4 w-full rounded-full bg-gradient-to-br px-6 py-4 font-body text-base font-semibold tracking-[0.2em] shadow-md transition enabled:hover:brightness-105 disabled:cursor-wait disabled:opacity-75"
      >
        {status === 'uploading'
          ? `Uploading${progress.total > 1 ? ` (${progress.current}/${progress.total})` : '…'}`
          : 'Share photos'}
      </button>
    </form>
  )
}
