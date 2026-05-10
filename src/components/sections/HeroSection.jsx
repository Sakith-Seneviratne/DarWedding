import heroCouplePhoto from '../../assets/dar.webp'

export function HeroSection() {
  return (
    <section
      id="home"
      className="border-boho-parchment/40 scroll-mt-24 relative flex min-h-svh flex-col items-center justify-start overflow-x-hidden border-b px-5 pb-24 pt-32 sm:scroll-mt-28 sm:pt-36 md:pt-40"
    >
      <div className="relative z-0 mx-auto w-full max-w-3xl">
        <p className="hero-fade-in relative z-10 text-boho-earth font-body mb-6 text-center text-xs font-medium uppercase tracking-[0.42em] sm:text-sm">
          Together with their families
        </p>
        <h1
          aria-label="Darshanika and Kashyapa"
          className="hero-fade-in-delayed relative z-10 flex flex-col items-center text-center font-script text-boho-charcoal text-[clamp(3rem,11vw,5.75rem)] font-normal leading-[1.12]"
        >
          <span className="relative z-10 block origin-center -rotate-4 [text-shadow:0_1px_18px_rgb(253_252_249/0.95)]">
            Darshanika
          </span>
          <span className="relative z-10 block origin-center -rotate-4 [text-shadow:0_1px_18px_rgb(253_252_249/0.95)]">
            Kashyapa
          </span>
          <span
            className="font-ampersand text-boho-gold pointer-events-none absolute top-1/2 left-1/2 z-0 -translate-x-1/2 -translate-y-1/2 text-[clamp(2.25rem,8vw,4.5rem)] font-normal leading-none"
            aria-hidden="true"
          >
            &amp;
          </span>
        </h1>

        <div className="relative z-10 mx-auto mt-10 flex max-w-3xl flex-col items-center text-center sm:mt-12">
          <div
            className="hero-fade-in-delayed-2 border-boho-gold/55 mx-auto max-w-[14rem] border-t border-dotted"
            aria-hidden="true"
          />
          <p className="hero-fade-in-delayed-2 text-boho-charcoal font-body mt-2 text-xl font-normal tracking-[0.28em] sm:text-2xl">
            11 · 06 · 2026
          </p>
        </div>
        <div className="relative z-20 mx-auto  flex w-full max-w-[450px] justify-center sm:-mt-[4.5rem] sm:max-w-[320px] md:mt-0 md:max-w-[400px]">
          <div className="hero-fade-in-delayed-3 w-full sm:rotate-1">
            <img
              src={heroCouplePhoto}
              alt="Darshanika and Kashyapa"
              width={800}
              height={1200}
              decoding="async"
              className="mx-auto block h-auto w-full max-h-[min(40vh,400px)] opacity-90 object-contain sm:max-h-[min(44vh,440px)]"
              loading="eager"
            />
          </div>
        </div>
        <div className="hero-fade-in-delayed-3 relative z-20 mx-auto mt-10 flex justify-center sm:mt-20">
          <a
            href="#rsvp"
            className="text-boho-earth hover:text-boho-gold group inline-flex flex-col items-center gap-2 font-body text-xs font-medium uppercase tracking-[0.32em] transition-colors"
            aria-label="Scroll to RSVP section"
          >
            <span>Scroll to RSVP</span>
            <svg
              className="text-boho-gold h-5 w-5 motion-safe:transition-transform motion-safe:group-hover:translate-y-1"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="m7 10 5 5 5-5" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}
