import { cloneElement } from 'react'

// Line-style icon defaults; individual icons override stroke width where the design differs.
const STROKE = { fill: 'none', stroke: 'currentColor' }

// Named 24x24 SVGs reused across the site. Sizing is controlled by the parent's CSS.
const ICONS = {
  arrowRight: (
    <svg viewBox="0 0 24 24" {...STROKE} strokeWidth={1.6}>
      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  arrowUpRight: (
    <svg viewBox="0 0 24 24" {...STROKE} strokeWidth={1.6}>
      <path d="M7 17L17 7M7 7h10v10" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  scissors: (
    <svg viewBox="0 0 24 24" {...STROKE} strokeWidth={1.5}>
      <circle cx="6" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <path d="M8.1 8.1 20 20M8.1 15.9 20 4" strokeLinecap="round" />
    </svg>
  ),
  beard: (
    <svg viewBox="0 0 24 24" {...STROKE} strokeWidth={1.5}>
      <path d="M6 4v5a6 6 0 0 0 12 0V4" strokeLinecap="round" />
      <path d="M8 12c0 3 1.5 6 4 6s4-3 4-6" strokeLinecap="round" />
      <path d="M9 8h.01M15 8h.01" strokeLinecap="round" />
    </svg>
  ),
  razor: (
    <svg viewBox="0 0 24 24" {...STROKE} strokeWidth={1.5}>
      <path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3H4V6z" />
      <path d="M4 9v9a2 2 0 0 0 2 2h9V9M18 9v6a2 2 0 0 0 2-2V9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  styling: (
    <svg viewBox="0 0 24 24" {...STROKE} strokeWidth={1.5}>
      <path d="M9 3h6l-1 8H10L9 3z" />
      <path d="M10 11v3a2 2 0 0 0 4 0v-3" />
      <path d="M12 16v5" strokeLinecap="round" />
    </svg>
  ),
  grooming: (
    <svg viewBox="0 0 24 24" {...STROKE} strokeWidth={1.5}>
      <path d="M10 2h4v3l1 2v13a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2V7l1-2V2z" />
      <path d="M9 12h6" />
    </svg>
  ),
  star: (
    <svg viewBox="0 0 24 24" {...STROKE} strokeWidth={1.5}>
      <path d="M12 3l2.6 5.6L21 9.5l-4.5 4.3 1.1 6.2L12 17l-5.6 3 1.1-6.2L3 9.5l6.4-.9L12 3z" strokeLinejoin="round" />
    </svg>
  ),
  users: (
    <svg viewBox="0 0 24 24" {...STROKE} strokeWidth={1.5}>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3.5 20c0-3 2.5-5 5.5-5s5.5 2 5.5 5" strokeLinecap="round" />
      <path d="M16 5.2A3.2 3.2 0 0 1 16 11M17.5 15c2.2.5 4 2.4 4 5" strokeLinecap="round" />
    </svg>
  ),
  shield: (
    <svg viewBox="0 0 24 24" {...STROKE} strokeWidth={1.5}>
      <path d="M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6l7-3z" strokeLinejoin="round" />
      <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  medal: (
    <svg viewBox="0 0 24 24" {...STROKE} strokeWidth={1.5}>
      <circle cx="12" cy="9" r="6" />
      <path d="M8.5 14L7 22l5-3 5 3-1.5-8" strokeLinejoin="round" />
    </svg>
  ),
  clock: (
    <svg viewBox="0 0 24 24" {...STROKE} strokeWidth={1.5}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  lineFade: (
    <svg viewBox="0 0 24 24" {...STROKE} strokeWidth={1.5}>
      <path d="M14 3l7 7M4 21l9.5-9.5M11 8l5 5" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="12.5" y="1.5" width="4" height="8" rx="1" transform="rotate(45 14.5 5.5)" />
    </svg>
  ),
  mapPin: (
    <svg viewBox="0 0 24 24" {...STROKE} strokeWidth={1.5}>
      <path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11z" strokeLinejoin="round" />
      <circle cx="12" cy="10" r="2.6" />
    </svg>
  ),
  phone: (
    <svg viewBox="0 0 24 24" {...STROKE} strokeWidth={1.5}>
      <path d="M5 3h4l2 5-3 2a12 12 0 0 0 5 5l2-3 5 2v4a2 2 0 0 1-2 2A17 17 0 0 1 3 5a2 2 0 0 1 2-2z" strokeLinejoin="round" />
    </svg>
  ),
  check: (
    <svg viewBox="0 0 24 24" {...STROKE} strokeWidth={2}>
      <path d="M5 12l4.5 4.5L19 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  instagram: (
    <svg viewBox="0 0 24 24" {...STROKE} strokeWidth={1.6}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17" cy="7" r="1" fill="currentColor" stroke="none" />
    </svg>
  ),
  facebook: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M13 22v-8h2.7l.4-3H13V9c0-.9.3-1.5 1.6-1.5H16V4.9c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.4-4 4V11H7v3h2.6v8H13z" />
    </svg>
  ),
  x: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.5 3h3l-6.5 7.5L21.7 21h-5.9l-4.3-5.6L6.4 21H3.3l7-8L2.6 3h6l3.9 5.1L17.5 3zm-1 16h1.7L7.6 4.8H5.8L16.5 19z" />
    </svg>
  ),
  tiktok: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 3c.3 2.2 1.5 3.6 3.6 3.9v2.6c-1.3.1-2.5-.2-3.6-.9v5.9c0 3.4-2.6 5.7-5.6 5.4-2.7-.3-4.6-2.6-4.4-5.3.2-2.5 2.3-4.4 4.9-4.2v2.7c-.4-.1-.8-.1-1.2 0-1 .2-1.7 1.1-1.6 2.1.1 1 1 1.8 2 1.7 1.1-.1 1.8-.9 1.8-2V3H16z" />
    </svg>
  ),
}

// Renders a named icon; extra props (className, aria-hidden) pass through to the svg.
export default function Icon({ name, ...props }) {
  const svg = ICONS[name]
  if (!svg) return null
  return cloneElement(svg, { 'aria-hidden': true, focusable: false, ...props })
}
