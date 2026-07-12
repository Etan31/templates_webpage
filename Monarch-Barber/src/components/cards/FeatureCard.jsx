import Chip from '../ui/Chip.jsx'
import styles from './FeatureCard.module.css'

// Dark "why choose us" feature card.
export default function FeatureCard({ feature }) {
  return (
    <article className={styles.fcard}>
      <Chip icon={feature.icon} className={styles.chip} />
      <h4>{feature.title}</h4>
      <p>{feature.desc}</p>
    </article>
  )
}
