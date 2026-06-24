import styles from './Marquee.module.css'

const ITEMS = [
  'Casa Barbero', 'Manila', 'Expert Cuts', 'Skin Fades',
  'Since 2020', 'Clean Lines', 'Walk-ins Welcome', 'Honest Prices',
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
