import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useScrolled } from '../../hooks/useScrolled.js'
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock.js'
import Button from '../ui/Button.jsx'
import Brand from './Brand.jsx'
import { navItems } from '../../data/site.js'
import styles from './Navbar.module.css'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const scrolled = useScrolled(12)
  useBodyScrollLock(open)
  const close = () => setOpen(false)

  const linkClass = (base) => ({ isActive }) =>
    [base, isActive && styles.active].filter(Boolean).join(' ')

  return (
    <>
      <header className={[styles.nav, scrolled && styles.scrolled].filter(Boolean).join(' ')}>
        <div className={`container ${styles.inner}`}>
          <Brand />
          <nav aria-label="Primary">
            <ul className={styles.links}>
              {navItems.map((item) => (
                <li key={item.to}>
                  <NavLink to={item.to} end={item.to === '/'} className={linkClass()}>
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
          <div className={styles.right}>
            <Button to="/contact" variant="dark" className={styles.bookBtn}>
              Book Now
            </Button>
            <button
              className={[styles.burger, open && styles.burgerOpen].filter(Boolean).join(' ')}
              aria-label="Open menu"
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      <div
        className={[styles.panel, open && styles.panelOpen].filter(Boolean).join(' ')}
        role="dialog"
        aria-label="Menu"
      >
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={linkClass(styles.panelLink)}
            onClick={close}
          >
            {item.label}
          </NavLink>
        ))}
        <Button to="/contact" variant="gold" className={styles.panelBtn} onClick={close}>
          Book Now
        </Button>
      </div>
    </>
  )
}
