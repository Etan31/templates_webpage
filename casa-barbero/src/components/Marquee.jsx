import styles from './Marquee.module.css'

const ITEMS = [
  'Casa Barbero', 'Cumpit', 'Amis', 'Estilo',
  'Established 1910', "The Gentleman's Cut", 'Precision Craft',
]

const DOT = <span className={styles.dot} aria-hidden="true">✦</span>

export default function Marquee() {
  const track = [...ITEMS, ...ITEMS]

  return (
    <div className={styles.strip} aria-hidden="true">
      <div className={styles.track}>
        {track.map((text, i) => (
          <span key={i} className={styles.item}>
            <span className={styles.word}>{text}</span>
            {DOT}
          </span>
        ))}
      </div>
    </div>
  )
}
