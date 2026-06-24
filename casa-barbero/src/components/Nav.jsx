import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
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
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <nav
      className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}
      aria-label="Main navigation"
    >
      <Link to="/" className={styles.logo}>
        Casa <span className={styles.logoAccent}>Barbero</span>
      </Link>

      <ul className={styles.links} role="list">
        {NAV_LINKS.map(({ href, label }) => (
          <li key={href}>
            <a href={href} className={styles.link}>{label}</a>
          </li>
        ))}
      </ul>

      <Link to="/booking" className={styles.cta}>Book Now</Link>

      <button
        className={`${styles.hamburger} ${open ? styles.hamburgerOpen : ''}`}
        onClick={() => setOpen(v => !v)}
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
      >
        <span /><span /><span />
      </button>

      <div className={`${styles.mobileMenu} ${open ? styles.mobileMenuOpen : ''}`} aria-hidden={!open}>
        <ul className={styles.mobileLinks} role="list">
          {NAV_LINKS.map(({ href, label }) => (
            <li key={href}>
              <a href={href} className={styles.mobileLink} onClick={() => setOpen(false)}>{label}</a>
            </li>
          ))}
        </ul>
        <Link to="/booking" className={styles.mobileCta} onClick={() => setOpen(false)}>
          Book Now
        </Link>
      </div>
    </nav>
  )
}
