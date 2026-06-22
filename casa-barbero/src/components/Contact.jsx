import { useState } from 'react'
import useInView from '../hooks/useInView'
import styles from './Contact.module.css'

export default function Contact() {
  const [ref, inView] = useInView()
  const [sent, setSent] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    setSent(true)
    setTimeout(() => setSent(false), 2600)
  }

  return (
    <section id="contact" className={styles.section} aria-labelledby="contact-heading">
      <div className={styles.inner}>
        <div
          ref={ref}
          className={`${styles.content} ${inView ? styles.visible : ''}`}
        >
          <div className={styles.grid}>
            <div className={styles.formSide}>
              <span className={styles.eyebrow}>Get in Touch</span>
              <h2 id="contact-heading" className={styles.heading}>
                Drop us a <em className={styles.headingAccent}>line.</em>
              </h2>

              <form onSubmit={handleSubmit} className={styles.form} noValidate>
                <div className={styles.row2}>
                  <div className={styles.field}>
                    <label htmlFor="contact-name" className={styles.srOnly}>Your name</label>
                    <input
                      id="contact-name"
                      type="text"
                      placeholder="Your name"
                      className={styles.input}
                      autoComplete="name"
                    />
                  </div>
                  <div className={styles.field}>
                    <label htmlFor="contact-phone" className={styles.srOnly}>Phone</label>
                    <input
                      id="contact-phone"
                      type="tel"
                      placeholder="Phone"
                      className={styles.input}
                      autoComplete="tel"
                    />
                  </div>
                </div>

                <div className={styles.field}>
                  <label htmlFor="contact-email" className={styles.srOnly}>Email address</label>
                  <input
                    id="contact-email"
                    type="email"
                    placeholder="Email address"
                    className={styles.input}
                    autoComplete="email"
                  />
                </div>

                <div className={styles.field}>
                  <label htmlFor="contact-message" className={styles.srOnly}>Message</label>
                  <textarea
                    id="contact-message"
                    placeholder="How can we help?"
                    rows={3}
                    className={styles.textarea}
                  />
                </div>

                <button
                  type="submit"
                  className={`${styles.submit} ${sent ? styles.submitSent : ''}`}
                >
                  {sent ? 'Message Sent ✓' : 'Send Message'}
                </button>
              </form>
            </div>

            <div className={styles.mapWrap}>
              <iframe
                src="https://www.openstreetmap.org/export/embed.html?bbox=-0.1420,51.5040,-0.1220,51.5160&layer=mapnik&marker=51.5100,-0.1320"
                className={styles.map}
                title="Casa Barbero location map"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
