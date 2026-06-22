import useInView from '../hooks/useInView'
import styles from './Pricing.module.css'

const LEFT = [
  { label: 'Classic Cut',   price: '$45' },
  { label: 'Skin Fade',     price: '$50' },
  { label: 'Buzz & Tidy',   price: '$30' },
]

const RIGHT = [
  { label: 'Straight-Razor Shave', price: '$35' },
  { label: 'Beard Sculpt',         price: '$28' },
  { label: 'The Full Ritual',      price: '$85' },
]

function PriceRow({ label, price }) {
  return (
    <div className={styles.row}>
      <span className={styles.rowLabel}>{label}</span>
      <span className={styles.rowDots} aria-hidden="true" />
      <span className={styles.rowPrice}>{price}</span>
    </div>
  )
}

export default function Pricing() {
  const [ref, inView] = useInView()

  return (
    <section id="pricing" className={styles.section} aria-labelledby="pricing-heading">
      <div className={styles.glow} aria-hidden="true" />
      <div className={styles.inner}>
        <div
          ref={ref}
          className={`${styles.content} ${inView ? styles.visible : ''}`}
        >
          <div className={styles.header}>
            <span className={styles.eyebrow}>The Price List</span>
            <h2 id="pricing-heading" className={styles.heading}>
              Honest <em className={styles.headingAccent}>rates.</em>
            </h2>
          </div>

          <div className={styles.grid}>
            <div>{LEFT.map(item => <PriceRow key={item.label} {...item} />)}</div>
            <div>{RIGHT.map(item => <PriceRow key={item.label} {...item} />)}</div>
          </div>

          <div className={styles.cta}>
            <a href="#contact" className={styles.ctaBtn}>Book an Appointment</a>
          </div>
        </div>
      </div>
    </section>
  )
}
