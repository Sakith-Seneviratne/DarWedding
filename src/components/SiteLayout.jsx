import { FloatingSideLeaves } from './FloatingSideLeaves'
import { PhotoFab } from './PhotoFab'
import { SiteFooter } from './SiteFooter'
import { SiteHeader } from './SiteHeader'

export function SiteLayout({ children, contentVisible = true }) {
  return (
    <div
      className={`invite-backdrop relative min-h-svh text-boho-ink transition-opacity duration-700 ease-out motion-reduce:transition-none ${
        contentVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <FloatingSideLeaves />
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
      <PhotoFab />
    </div>
  )
}
