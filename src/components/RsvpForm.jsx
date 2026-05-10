import { useState } from 'react'

const inputUnderline =
  'w-full border-0 border-b border-boho-parchment bg-transparent px-0 py-3 font-heading text-base text-boho-ink placeholder:text-boho-earth/45 outline-none transition focus:border-boho-gold'

const labelStyle =
  'text-boho-ink font-heading text-sm font-medium tracking-wide'

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

export function RsvpForm({ submitUrl }) {
  const [status, setStatus] = useState('idle')
  const [errorMessage, setErrorMessage] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('submitting')
    setErrorMessage('')

    if (!submitUrl?.trim()) {
      setStatus('idle')
      setErrorMessage(
        'RSVP URL is not configured. Add VITE_GOOGLE_APPS_SCRIPT_URL to your .env file.',
      )
      return
    }

    const form = e.currentTarget
    const formData = new FormData(form)

    const body = new URLSearchParams({
      full_name: String(formData.get('full_name') ?? '').trim(),
      guest_count: String(Number(formData.get('guest_count'))),
    })

    try {
      const res = await fetch(submitUrl.trim(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
        body: body.toString(),
      })

      const data = await res.json().catch(() => null)

      if (!res.ok || !data?.ok) {
        const msg =
          (typeof data?.error === 'string' && data.error) ||
          (typeof data?.message === 'string' && data.message) ||
          'Something went wrong. Please try again.'
        throw new Error(msg)
      }

      form.reset()
      setStatus('success')
    } catch (err) {
      setStatus('idle')
      setErrorMessage(err instanceof Error ? err.message : 'Submission failed.')
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
          <p className="text-boho-earth font-body mt-7 text-xs font-medium uppercase tracking-[0.28em]">
            RSVP sent
          </p>
          <p className="font-script text-boho-sage-deep mt-3 text-3xl font-normal sm:text-[2.65rem]">
            Thank you!
          </p>
          <p className="text-boho-ink-soft mt-5 max-w-md font-body text-base leading-relaxed">
            Your reply is saved. We&apos;re so happy you might join us among the
            flowers and fairy lights.
          </p>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10 pt-2">
      <div className="space-y-9">
        <div className="space-y-2">
          <label htmlFor="full_name" className={labelStyle}>
            Full name
          </label>
          <input
            id="full_name"
            name="full_name"
            type="text"
            required
            autoComplete="name"
            className={inputUnderline}
            placeholder="Your name as you'd like it on our guest list"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="guest_count" className={labelStyle}>
            Guest count
          </label>
          <input
            id="guest_count"
            name="guest_count"
            type="number"
            required
            min={1}
            max={6}
            defaultValue={1}
            className={inputUnderline}
          />
          <p className="text-boho-earth/90 font-body text-xs leading-relaxed">
            Including you; maximum guest count is 6.
          </p>
        </div>
      </div>

      {errorMessage ? (
        <p className="text-boho-rose-deep font-body text-sm" role="alert">
          {errorMessage}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="from-boho-gold-light via-boho-gold to-boho-gold-foil text-white hover:via-boho-gold-foil mt-4 w-full rounded-full bg-gradient-to-br px-6 py-4 font-body text-sm font-semibold tracking-[0.2em] shadow-md transition enabled:hover:brightness-105 disabled:cursor-wait disabled:opacity-75"
      >
        {status === 'submitting' ? 'Sending…' : 'Send RSVP'}
      </button>
    </form>
  )
}
