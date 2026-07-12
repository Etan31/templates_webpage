import Reveal from './Reveal.jsx'
import Button from './Button.jsx'
import Img from './Img.jsx'
import styles from './CtaBand.module.css'
import { brand } from '../../data/site.js'

// Closing call-to-action band, identical across every page.
export default function CtaBand() {
  return (
    <section className={styles.ctaband}>
      <div className={styles.bg}>
        <Img
          src="https://images.unsplash.com/photo-1622286342621-4bd786c2447c?q=80&w=1600&auto=format&fit=crop"
          alt=""
        />
      </div>
      <Reveal className={`container ${styles.inner}`}>
        <span className="eyebrow soft">Your Chair Is Waiting</span>
        <h2>Ready For Your Next Cut?</h2>
        <p>
          Book your appointment today and experience the {brand.name} difference — precision,
          comfort and confidence.
        </p>
        <Button to="/contact" variant="gold">
          Book Appointment
        </Button>
      </Reveal>
    </section>
  )
}
