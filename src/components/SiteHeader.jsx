import homeNav from '../assets/homenav.svg?raw'
import calendarNav from '../assets/calendernav.svg?raw'
import photosNav from '../assets/photosnav.svg?raw'
import rsvpNav from '../assets/rsvpnav.svg?raw'
import { NavLink } from './NavLink'

export function SiteHeader() {
  return (
    <header className="border-boho-parchment/50 fixed left-0 right-0 top-0 z-50 border-b bg-boho-lace/90 backdrop-blur-md">
      <nav
        className="mx-auto flex max-w-4xl items-center justify-center px-5 py-3"
        aria-label="Page"
      >
        <ul className="flex items-center gap-2 sm:gap-4">
          <li>
            <NavLink to="/" label="Home" svg={homeNav} />
          </li>
          <li>
            <NavLink to="/#details" label="Event details" svg={calendarNav} />
          </li>
          <li>
            <NavLink to="/#rsvp" label="RSVP" svg={rsvpNav} />
          </li>
          <li>
            <NavLink to="/photos" label="Guest photos" svg={photosNav} />
          </li>
        </ul>
      </nav>
    </header>
  )
}
