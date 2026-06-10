import { useRevealOnScroll } from '../hooks/useRevealOnScroll'

export function RevealSection({ children, className = '', id }) {
  const { ref, visible } = useRevealOnScroll()
  return (
    <div
      ref={ref}
      id={id}
      className={`transform-gpu transition-all duration-700 ease-out motion-reduce:transition-none motion-reduce:opacity-100 ${
        visible
          ? 'translate-y-0 opacity-100'
          : 'translate-y-6 opacity-0 motion-reduce:translate-y-0'
      } ${className}`}
    >
      {children}
    </div>
  )
}
