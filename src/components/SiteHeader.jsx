import homeNav from '../assets/homenav.svg?raw'
import calendarNav from '../assets/calendernav.svg?raw'
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
            <NavLink href="#home" label="Home" svg={homeNav} />
          </li>
          <li>
            <NavLink href="#details" label="Event details" svg={calendarNav} />
          </li>
          <li>
            <NavLink href="#rsvp" label="RSVP" svg={rsvpNav} />
          </li>
        </ul>
      </nav>
    </header>
  )
}
