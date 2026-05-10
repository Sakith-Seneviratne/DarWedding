/** Deploy `scripts/google-apps-script-rsvp/Code.gs`, then set the Web app URL in `.env`. */
export const RSVP_ENDPOINT =
  import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL ?? ''
