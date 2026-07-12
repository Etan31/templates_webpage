import { Link } from 'react-router-dom'
import Brand from './Brand.jsx'
import Icon from '../ui/Icon.jsx'
import { brand, tagline, contact, socials, footerLinks } from '../../data/site.js'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.top}>
          <div className={`${styles.col} ${styles.about}`}>
            <Brand light />
            <p>{tagline}</p>
            <div className={styles.socials}>
              {socials.map((s) => (
                <a key={s.label} href={s.href} aria-label={s.label}>
                  <Icon name={s.icon} />
                </a>
              ))}
            </div>
          </div>

          <div className={styles.col}>
            <h5>Quick Links</h5>
            <ul>
              {footerLinks.quick.map((l) => (
                <li key={l.to + l.label}>
                  <Link to={l.to}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.col}>
            <h5>Services</h5>
            <ul>
              {footerLinks.services.map((s) => (
                <li key={s}>
                  <Link to="/services">{s}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.col}>
            <h5>Visit Us</h5>
            <ul>
              {contact.addressLines.map((line) => (
                <li key={line}>{line}</li>
              ))}
              <li>
                <a href={contact.phoneHref}>{contact.phone}</a>
              </li>
              <li>
                <a href={contact.emailHref}>{contact.email}</a>
              </li>
              <li>{contact.hours}</li>
            </ul>
          </div>
        </div>

        <div className={styles.bottom}>
          <span>
            © 2026 {brand.name} {brand.sub}. All rights reserved.
          </span>
          <span>
            <a href="#">Privacy Policy</a> &nbsp;·&nbsp; <a href="#">Terms &amp; Conditions</a>
          </span>
        </div>
      </div>
    </footer>
  )
}
