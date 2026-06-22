import useInView from '../hooks/useInView'
import styles from './Testimonial.module.css'

export default function Testimonial() {
  const [ref, inView] = useInView()

  return (
    <section className={styles.section} aria-label="Client testimonial">
      <div className={styles.inner}>
        <div
          ref={ref}
          className={`${styles.content} ${inView ? styles.visible : ''}`}
        >
          <div className={styles.ornament} aria-hidden="true">✦</div>

          <blockquote className={styles.quote}>
            "The most precise cut I've ever had. They treat every appointment
            like a ceremony — nothing is rushed, nothing is accidental."
          </blockquote>

          <footer className={styles.attribution}>
            <span className={styles.rule} aria-hidden="true" />
            <cite className={styles.cite}>Rafael M. — Regular since 2019</cite>
            <span className={styles.rule} aria-hidden="true" />
          </footer>
        </div>
      </div>
    </section>
  )
}
