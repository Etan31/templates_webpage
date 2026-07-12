import Icon from '../ui/Icon.jsx'
import Button from '../ui/Button.jsx'
import styles from './PackageCard.module.css'

export default function PackageCard({ pkg }) {
  const { name, price, duration, featured, ribbon, items } = pkg
  return (
    <article className={[styles.pcard, featured && styles.featured].filter(Boolean).join(' ')}>
      {ribbon && <span className={styles.ribbon}>{ribbon}</span>}
      <div className={styles.name}>{name}</div>
      <div className={styles.price}>
        <span className={styles.cur}>$</span>
        <b>{price}</b>
        <span className={styles.per}>/ visit</span>
      </div>
      <div className={styles.dur}>{duration}</div>
      <ul className={styles.list}>
        {items.map((item) => (
          <li key={item.label} className={item.included ? undefined : styles.off}>
            <Icon name="check" />
            <span>{item.label}</span>
          </li>
        ))}
      </ul>
      <Button to="/contact" variant={featured ? 'gold' : 'dark'} fullWidth>
        Book Now
      </Button>
    </article>
  )
}
