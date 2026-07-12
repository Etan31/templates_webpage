import { useState } from 'react'
import { FALLBACK_IMAGE } from '../../utils/fallbackImage.js'

// Image that swaps to an on-brand placeholder if the source fails to load.
export default function Img({ src, alt = '', loading = 'lazy', ...props }) {
  const [current, setCurrent] = useState(src)
  return (
    <img
      src={current}
      alt={alt}
      loading={loading}
      onError={() => setCurrent((prev) => (prev === FALLBACK_IMAGE ? prev : FALLBACK_IMAGE))}
      {...props}
    />
  )
}
