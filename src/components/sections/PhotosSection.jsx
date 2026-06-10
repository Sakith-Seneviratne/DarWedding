import { useState } from 'react'
import { PHOTOS_API_URL } from '../../config/photos'
import { PhotoGallery } from '../PhotoGallery'
import { PhotoUploadForm } from '../PhotoUploadForm'
import { RevealSection } from '../RevealSection'

export function PhotosSection() {
  const [galleryRefreshKey, setGalleryRefreshKey] = useState(0)

  function handleUploaded() {
    setGalleryRefreshKey((key) => key + 1)
  }

  return (
    <section className="scroll-mt-[5.5rem] px-5 py-20 sm:scroll-mt-24 sm:py-28">
      <div className="from-boho-lavender-wash/55 via-boho-lace/90 to-boho-lavender-soft/35 mx-auto max-w-3xl rounded-sm border border-boho-parchment/60 bg-gradient-to-b px-5 py-12 shadow-boho-soft backdrop-blur-sm sm:px-10 sm:py-14">
        <RevealSection>
          <p className="text-boho-earth text-center font-body text-xs font-medium uppercase tracking-[0.32em]">
            Capture the day
          </p>
          <h2 className="font-heading text-boho-charcoal mt-4 text-center text-4xl font-normal sm:text-5xl">
            Guest photos
          </h2>
          <p className="text-boho-ink-soft mx-auto mt-5 max-w-xl text-center text-pretty font-body text-base font-light leading-relaxed">
            Share your favourite moments from the celebration. New uploads appear in
            the gallery below as guests add them.
          </p>
        </RevealSection>

        <RevealSection id="photo-upload" className="mt-12 scroll-mt-28">
          <PhotoUploadForm apiUrl={PHOTOS_API_URL} onUploaded={handleUploaded} />
        </RevealSection>

        <RevealSection
          id="photos-gallery"
          className="mt-14 scroll-mt-28 border-t border-boho-parchment/50 pt-12"
        >
          <h3 className="font-heading text-boho-charcoal text-center text-2xl font-normal sm:text-3xl">
            Live gallery
          </h3>
          <div className="mt-8">
            <PhotoGallery apiUrl={PHOTOS_API_URL} refreshKey={galleryRefreshKey} />
          </div>
        </RevealSection>
      </div>
    </section>
  )
}
