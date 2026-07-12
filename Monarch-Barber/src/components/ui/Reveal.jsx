import { useEffect, useRef, useState } from 'react'

// Fades/slides children in when scrolled into view (ports the design's IntersectionObserver reveal).
// `d` (1-5) applies the staggered delay defined in global.css.
export default function Reveal({ as: Tag = 'div', d, className = '', children, ...props }) {
  const ref = useRef(null)
  // Start visible when IntersectionObserver is unavailable (avoids a sync setState in the effect).
  const [shown, setShown] = useState(() => typeof IntersectionObserver === 'undefined')

  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShown(true)
            io.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const cls = ['reveal', shown && 'in', className].filter(Boolean).join(' ')

  return (
    <Tag ref={ref} className={cls} data-d={d} {...props}>
      {children}
    </Tag>
  )
}
