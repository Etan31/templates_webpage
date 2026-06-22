import styles from './Footer.module.css'

const NAV_LINKS = [
  { href: '#services', label: 'Services' },
  { href: '#team',     label: 'The Team' },
  { href: '#gallery',  label: 'Gallery' },
  { href: '#contact',  label: 'Book Now' },
]

const LEGAL_LINKS = [
  { href: '#', label: 'Privacy Policy' },
  { href: '#', label: 'Terms of Service' },
  { href: '#', label: 'FAQ' },
]

const SOCIALS = [
  { href: '#', label: 'IG' },
  { href: '#', label: 'FB' },
  { href: '#', label: 'X' },
]

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.grid}>
          <div className={styles.brand}>
            <h2 className={styles.logo}>
              Casa <em className={styles.logoAccent}>Barbero</em>
            </h2>
            <p className={styles.tagline}>
              Defining the modern gentleman's aesthetic since 1910.
              Tradition, craft, and character.
            </p>
            <ul className={styles.socials} aria-label="Social links">
              {SOCIALS.map(({ href, label }) => (
                <li key={label}>
                  <a href={href} className={styles.social} aria-label={label}>{label}</a>
                </li>
              ))}
            </ul>
          </div>

          <nav aria-label="Footer navigation">
            <span className={styles.colLabel}>Navigation</span>
            <ul className={styles.colLinks}>
              {NAV_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <a href={href} className={styles.colLink}>{label}</a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Legal links">
            <span className={styles.colLabel}>Legal</span>
            <ul className={styles.colLinks}>
              {LEGAL_LINKS.map(({ href, label }) => (
                <li key={label}>
                  <a href={href} className={styles.colLink}>{label}</a>
                </li>
              ))}
            </ul>
          </nav>

          <address className={styles.location}>
            <span className={styles.colLabel}>Location</span>
            <p className={styles.locationText}>
              128 Artisan Way, Heritage Quarter<br />London, UK
            </p>
            <p className={styles.locationText} style={{ marginTop: '16px' }}>
              Mon–Sat: 9:00 — 20:00<br />Sun: Closed
            </p>
          </address>
        </div>

        <div className={styles.bottom}>
          <span className={styles.copy}>© 2026 Casa Barbero · CUMPIT · AMIS · ESTILO</span>
          <span className={styles.copy}>Crafted with care</span>
        </div>
      </div>
    </footer>
  )
}
