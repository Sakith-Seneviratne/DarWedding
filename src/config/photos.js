/** Deploy `scripts/google-apps-script-photos/Code.gs`, then set the Web app URL in `.env`. */
export const PHOTOS_API_URL = import.meta.env.VITE_PHOTOS_API_URL ?? ''

/** How often the gallery checks Drive for new uploads (milliseconds). */
export const PHOTO_GALLERY_POLL_MS = 30_000
