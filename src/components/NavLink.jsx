export function NavLink({ href, label, svg }) {
  const markup = svg
    .replace(/<\?xml[^>]*>/, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .trim()

  return (
    <a
      href={href}
      aria-label={label}
      className="text-boho-ink-soft hover:text-boho-gold focus-visible:ring-boho-gold inline-flex size-11 items-center justify-center rounded-full transition-colors focus-visible:ring-2 focus-visible:outline-none"
    >
      <span
        className="pointer-events-none inline-flex size-6 shrink-0 [&_svg]:block [&_svg]:size-full"
        dangerouslySetInnerHTML={{ __html: markup }}
        aria-hidden="true"
      />
    </a>
  )
}
