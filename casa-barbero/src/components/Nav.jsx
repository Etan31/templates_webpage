import { useEffect, useState } from 'react'
import styles from './Nav.module.css'

const NAV_LINKS = [
  { href: '#services', label: 'Services' },
  { href: '#team',     label: 'Team' },
  { href: '#gallery',  label: 'Gallery' },
  { href: '#pricing',  label: 'Pricing' },
  { href: '#contact',  label: 'Location' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}
      aria-label="Main navigation"
    >
      <a href="#top" className={styles.logo}>
        Casa <span className={styles.logoAccent}>Barbero</span>
      </a>

      <ul className={styles.links} role="list">
        {NAV_LINKS.map(({ href, label }) => (
          <li key={href}>
            <a href={href} className={styles.link}>{label}</a>
          </li>
        ))}
      </ul>

      <a href="#contact" className={styles.cta}>Book Now</a>
    </nav>
  )
}
