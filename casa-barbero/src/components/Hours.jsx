import useInView from '../hooks/useInView'
import styles from './Hours.module.css'

const HOURS = [
  { day: 'Monday – Friday', time: '9:00 — 20:00',  closed: false },
  { day: 'Saturday',        time: '10:00 — 18:00', closed: false },
  { day: 'Sunday',          time: 'Closed',         closed: true  },
]

export default function Hours() {
  const [ref, inView] = useInView()

  return (
    <section className={styles.section} aria-label="Opening hours and contact">
      <div className={styles.inner}>
        <div
          ref={ref}
          className={`${styles.content} ${inView ? styles.visible : ''}`}
        >
          <div className={styles.grid}>
            <aside className={styles.card}>
              <span className={styles.eyebrow}>Open House</span>
              <h2 className={styles.cardHeading}>Working Hours</h2>

              <dl className={styles.schedule}>
                {HOURS.map(({ day, time, closed }) => (
                  <div key={day} className={styles.scheduleRow}>
                    <dt className={styles.scheduleDay}>{day}</dt>
                    <dd className={closed ? styles.scheduleClosed : styles.scheduleTime}>
                      {time}
                    </dd>
                  </div>
                ))}
              </dl>

              <h3 className={styles.visitHeading}>Book Your Visit</h3>
              <address className={styles.address}>
                <a href="mailto:hello@casabarbero.com">hello@casabarbero.com</a>
                <br />
                <a href="tel:+34914457366">+34 (91) 445-7366</a>
                <br />
                128 Artisan Way, Heritage Quarter
              </address>

              <a href="#contact" className={styles.bookBtn}>Book Now</a>
            </aside>

            <div className={styles.imgWrap} aria-hidden="true">
              <img
                src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=900&q=80"
                alt="Inside the barbershop"
                className={styles.img}
              />
              <div className={styles.imgOverlay} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
