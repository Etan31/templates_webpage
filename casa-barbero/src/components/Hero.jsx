import { useEffect, useState } from 'react'
import styles from './Hero.module.css'

export default function Hero() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true))
    return () => cancelAnimationFrame(id)
  }, [])

  function anim(delay) {
    return {
      className: `${styles.item} ${ready ? styles.animate : ''}`,
      style: { '--delay': delay },
    }
  }

  return (
    <header id="top" className={styles.hero}>
      <img
        src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=1920&q=85"
        alt="Casa Barbero interior"
        className={`${styles.bg} ${ready ? styles.bgZoom : ''}`}
      />
      <div className={styles.overlayH}    aria-hidden="true" />
      <div className={styles.overlayFade} aria-hidden="true" />
      <div className={styles.overlayGlow} aria-hidden="true" />

      <div className={styles.content}>
        <div {...anim('0.15s')} aria-label="Established 1910 · 2020">
          <div className={styles.badge}>
            <span className={styles.badgeDot} aria-hidden="true" />
            <span className={styles.badgeText}>Established 1910 · 2020</span>
          </div>
        </div>

        <h1 className={styles.headline}>
          <span {...anim('0.35s')} className={`${styles.item} ${ready ? styles.animate : ''} ${styles.block}`}>
            The Gentleman's
          </span>
          <em {...anim('0.55s')} className={`${styles.item} ${ready ? styles.animate : ''} ${styles.headlineAccent}`}>
            Ritual.
          </em>
        </h1>

        <p {...anim('0.75s')} className={`${styles.item} ${ready ? styles.animate : ''} ${styles.sub}`}>
          Where heritage craft meets the modern cut. A curated house of barbering
          built for the discerning — precision, ritual, and character in every detail.
        </p>

        <div {...anim('0.95s')} className={`${styles.item} ${ready ? styles.animate : ''} ${styles.actions}`}>
          <a href="#contact"  className={styles.btnPrimary}>Reserve Your Seat</a>
          <a href="#services" className={styles.btnGhost}>View Services →</a>
        </div>
      </div>

      <div className={styles.scrollHint} {...anim('1.2s')} aria-hidden="true">
        <span className={styles.scrollLine} />
        <span className={styles.scrollLabel}>Scroll</span>
      </div>
    </header>
  )
}
