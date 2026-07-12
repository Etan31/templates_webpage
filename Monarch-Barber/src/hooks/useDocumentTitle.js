import { useEffect } from 'react'
import { brand } from '../data/site.js'

// Sets a per-page document title in the design's "Page — Monarch Barber Shop" format.
export function useDocumentTitle(page) {
  useEffect(() => {
    document.title = `${page} — ${brand.name} ${brand.sub}`
  }, [page])
}
