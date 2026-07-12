import Reveal from '../ui/Reveal.jsx'
import styles from './StatsBar.module.css'

// Row of headline stats. `plain` drops the black background (used inside a dark section).
export default function StatsBar({ stats, plain = false }) {
  return (
    <Reveal className={[styles.statsbar, plain && styles.plain].filter(Boolean).join(' ')}>
      {stats.map((s) => (
        <div key={s.label} className={styles.stat}>
          <div className={styles.num}>{s.num}</div>
          <div className={styles.lbl}>{s.label}</div>
        </div>
      ))}
    </Reveal>
  )
}
