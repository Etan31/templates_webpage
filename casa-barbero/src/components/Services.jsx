import useInView from '../hooks/useInView'
import styles from './Services.module.css'

const SERVICES = [
  {
    num: '01',
    title: 'The Classic Cut',
    desc: 'Consultation, precision scissor work, and a hot-towel finish tailored to your features.',
    price: 'from $45',
  },
  {
    num: '02',
    title: 'Beard & Shave',
    desc: 'Traditional straight-razor shave or sculpted beard trim, finished with warm oils and balm.',
    price: 'from $35',
  },
  {
    num: '03',
    title: 'The Full Ritual',
    desc: 'Cut, shave, scalp massage and styling — the complete Casa Barbero experience, unhurried.',
    price: 'from $85',
  },
]

export default function Services() {
  const [ref, inView] = useInView()

  return (
    <section id="services" className={styles.section} aria-labelledby="services-heading">
      <div className={styles.glow} aria-hidden="true" />
      <div className={styles.inner}>
        <div
          ref={ref}
          className={`${styles.content} ${inView ? styles.visible : ''}`}
        >
          <div className={styles.header}>
            <div>
              <span className={styles.eyebrow}>What We Provide</span>
              <h2 id="services-heading" className={styles.heading}>
                Craft for the<br />modern <em className={styles.headingAccent}>customer.</em>
              </h2>
            </div>
            <p className={styles.lead}>
              Every service is a ritual — unhurried, precise, finished to a standard set generations ago.
            </p>
          </div>

          <div className={styles.grid} role="list">
            {SERVICES.map(({ num, title, desc, price }) => (
              <article key={num} className={styles.card} role="listitem">
                <div className={styles.cardNum} aria-hidden="true">{num}</div>
                <h3 className={styles.cardTitle}>{title}</h3>
                <p className={styles.cardDesc}>{desc}</p>
                <span className={styles.cardPrice}>{price}</span>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
