import useInView from '../hooks/useInView'
import styles from './Stats.module.css'

const STATS = [
  { value: '110+', label: 'Years of Craft' },
  { value: '3',    label: 'Master Barbers' },
  { value: '500+', label: 'Regulars' },
  { value: '1',    label: 'Standard — Excellence' },
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
          <li
            key={label}
            className={styles.stat}
            style={{ '--i': i }}
          >
            <span className={styles.value}>{value}</span>
            <span className={styles.label}>{label}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
