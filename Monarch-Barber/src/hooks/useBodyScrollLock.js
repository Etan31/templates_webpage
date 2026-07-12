import { useEffect } from 'react'

// Locks body scroll while `locked` is true (used by the full-screen mobile menu).
export function useBodyScrollLock(locked) {
  useEffect(() => {
    if (!locked) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [locked])
}
