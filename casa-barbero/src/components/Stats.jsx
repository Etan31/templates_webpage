import useInView from '../hooks/useInView'
import styles from './Stats.module.css'

const STATS = [
  { value: '3',    label: 'Expert Barbers' },
  { value: '15+',  label: 'Years Combined Exp.' },
  { value: '500+', label: 'Happy Clients' },
  { value: '₱120', label: 'Starting Price' },
]

export default function Stats() {
  const [ref, inView] = useInView()

  return (
    <div className={styles.strip}>
      <ul
        ref={ref}
        className={`${styles.grid} ${inView ? styles.visible : ''}`}
        role="list"
      >
        {STATS.map(({ value, label }, i) => (
          <li key={label} className={styles.stat} style={{ '--i': i }}>
            <span className={styles.value}>{value}</span>
            <span className={styles.label}>{label}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
