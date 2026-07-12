import { Link } from 'react-router-dom'
import { brand } from '../../data/site.js'
import styles from './Brand.module.css'

// Wordmark with the pure-CSS barber-pole glyph. `light` renders the name in white (footer).
export default function Brand({ light = false, onClick }) {
  return (
    <Link className={styles.brand} to="/" aria-label={`${brand.name} home`} onClick={onClick}>
      <span className={styles.mark} />
      <span className={styles.txt}>
        <span className={[styles.name, light && styles.light].filter(Boolean).join(' ')}>
          {brand.name}
        </span>
        <span className={styles.sub}>{brand.sub}</span>
      </span>
    </Link>
  )
}
