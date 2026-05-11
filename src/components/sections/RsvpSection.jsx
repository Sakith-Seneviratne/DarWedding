import { RSVP_ENDPOINT } from '../../config/rsvp'
import { RevealSection } from '../RevealSection'
import { RsvpForm } from '../RsvpForm'

export function RsvpSection() {
  return (
    <section
      id="rsvp"
      className="scroll-mt-[5.5rem] px-5 pt-8 pb-20 sm:scroll-mt-24 sm:pt-10 sm:pb-28"
    >
      <div className="from-boho-lavender-wash/55 via-boho-lace/90 to-boho-lavender-soft/35 mx-auto max-w-xl rounded-sm border border-boho-parchment/60 bg-gradient-to-b px-5 py-12 shadow-boho-soft backdrop-blur-sm sm:px-10 sm:py-14">
        <RevealSection>
          <p className="text-boho-earth text-center font-body text-xs font-medium uppercase tracking-[0.32em]">
            Kindly reply
          </p>
          <h2 className="font-heading text-boho-charcoal mt-4 text-center text-4xl font-normal sm:text-5xl">
            RSVP
          </h2>
          <p className="text-boho-ink-soft mx-auto mt-5 max-w-xl text-center text-pretty font-body text-base font-light leading-relaxed">
            Please let us know if you&apos;ll join us by early May 2026.
          </p>
        </RevealSection>

        <RevealSection className="mt-12">
          <RsvpForm submitUrl={RSVP_ENDPOINT} />
        </RevealSection>
      </div>
    </section>
  )
}
