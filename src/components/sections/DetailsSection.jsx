import { RevealSection } from '../RevealSection'
import calendarArt from '../../assets/calender.png'
import locationArt from '../../assets/Location.png'
import timeArt from '../../assets/Time.png'

export function DetailsSection() {
  return (
    <section
      id="details"
      className="scroll-mt-[5.5rem] px-5 py-20 sm:scroll-mt-24 sm:py-28"
    >
      <div className="mx-auto max-w-5xl">
        <RevealSection>
          <p className="text-boho-earth text-center font-body text-xs font-medium uppercase tracking-[0.32em]">
            The day
          </p>
          <h2 className="font-heading text-boho-charcoal mt-4 text-center text-4xl font-normal sm:text-5xl">
            Celebration details
          </h2>
          <p className="text-boho-ink-soft mx-auto mt-5 max-w-xl text-center text-pretty font-body text-base font-light leading-relaxed">
            We cannot wait to share this chapter with you. Below are the key
            details of our celebration.
          </p>
        </RevealSection>

        <RevealSection className="mt-16">
          <div className="grid gap-10 sm:grid-cols-3">
            <article className="flex flex-col py-8 text-center sm:border-boho-parchment/80 sm:bg-white/45 sm:shadow-boho-card sm:rounded-sm sm:border sm:px-8 sm:py-10 sm:backdrop-blur-sm">
              <img
                src={locationArt}
                alt=""
                width={192}
                height={192}
                className="mx-auto mb-6 h-28 w-28 object-contain sm:h-32 sm:w-32"
                decoding="async"
              />
              <h3 className="font-heading text-boho-charcoal text-2xl font-medium tracking-wide">
                Venue
              </h3>
              <p className="text-boho-ink-soft mt-5 font-body text-sm leading-relaxed">
                The Grand Walawwa
                <br />
                No 190/8, Kandy Road, Kegalle
              </p>
              <a
                href="https://www.google.com/maps/search/?api=1&query=The+Grand+Walawwa+No+190/8+Kandy+Road+Kegalle"
                target="_blank"
                rel="noopener noreferrer"
                className="text-boho-gold hover:text-boho-forest font-body mx-auto mt-3 text-xs font-medium tracking-wide underline-offset-4 transition-colors hover:underline"
              >
                Open in Google Maps
              </a>
              <div className="mt-6 aspect-video w-full overflow-hidden sm:rounded-sm sm:border sm:border-boho-parchment/60">
                <iframe
                  title="Map of The Grand Walawwa, Kegalle"
                  className="h-full min-h-[180px] w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  src="https://maps.google.com/maps?q=The+Grand+Walawwa+No+190%2F8+Kandy+Road%2C+Kegalle&t=&z=16&ie=UTF8&iwloc=&output=embed"
                />
              </div>
            </article>

            <article className="py-8 text-center sm:border-boho-parchment/80 sm:bg-white/45 sm:shadow-boho-card sm:rounded-sm sm:border sm:px-8 sm:py-10 sm:backdrop-blur-sm">
              <img
                src={timeArt}
                alt=""
                width={192}
                height={192}
                className="mx-auto mb-6 h-28 w-28 object-contain sm:h-32 sm:w-32"
                decoding="async"
              />
              <h3 className="font-heading text-boho-charcoal text-2xl font-medium tracking-wide">
                Time
              </h3>
              <p className="text-boho-ink-soft mt-5 font-body text-sm leading-relaxed">
                Poruwa Ceremony at 10.14 am
              </p>
              <p className="text-boho-earth mt-4 font-body text-sm leading-relaxed opacity-90">
                We expect celebrations to wrap up around 3:30 p.m.
              </p>
            </article>

            <article className="py-8 text-center sm:border-boho-parchment/80 sm:bg-white/45 sm:shadow-boho-card sm:rounded-sm sm:border sm:px-8 sm:py-10 sm:backdrop-blur-sm">
              <img
                src={calendarArt}
                alt=""
                width={192}
                height={192}
                className="mx-auto mb-6 h-28 w-28 object-contain sm:h-32 sm:w-32"
                decoding="async"
              />
              <h3 className="font-heading text-boho-charcoal text-2xl font-medium tracking-wide">
                Date
              </h3>
              <p className="text-boho-ink-soft mt-5 font-body text-sm leading-relaxed">
                11 · 06 · 2026
              </p>
              <p className="text-boho-earth mt-4 font-body text-sm leading-relaxed opacity-90">
                Thursday, 11 June 2026 — our wedding day. Save the date and
                celebrate with us.
              </p>
            </article>
          </div>
        </RevealSection>
      </div>
    </section>
  )
}
