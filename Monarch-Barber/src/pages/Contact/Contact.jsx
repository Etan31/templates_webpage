import { useDocumentTitle } from '../../hooks/useDocumentTitle.js'
import PageHeader from '../../components/ui/PageHeader.jsx'
import Reveal from '../../components/ui/Reveal.jsx'
import SectionHead from '../../components/ui/SectionHead.jsx'
import CtaBand from '../../components/ui/CtaBand.jsx'
import BranchCard from '../../components/cards/BranchCard.jsx'
import { branches } from '../../data/branches.js'
import { brand, contact } from '../../data/site.js'
import styles from './Contact.module.css'

export default function Contact() {
  useDocumentTitle('Contact')
  return (
    <>
      <PageHeader
        title="Visit Us"
        current="Contact"
        bg="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=1400&auto=format&fit=crop"
      />

      <section className="pad">
        <div className="container">
          <SectionHead
            eyebrow="Our Locations"
            title="Four Chairs Across The City"
            lead={`Drop in or call ahead — every branch delivers the same ${brand.name} standard.`}
          />
          <div className="grid-2">
            {branches.map((branch, i) => (
              <Reveal key={branch.name} d={(i % 2) + 1}>
                <BranchCard branch={branch} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="pad-sm paper-2">
        <div className="container">
          <SectionHead eyebrow="Find Us" title="Come Say Hello" />
          <Reveal className={styles.mapwrap}>
            <iframe
              title={`${brand.name} Downtown location map`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src="https://www.openstreetmap.org/export/embed.html?bbox=-74.012%2C40.706%2C-73.986%2C40.722&layer=mapnik&marker=40.714%2C-73.999"
            />
            <div className={styles.pin}>
              <svg width="42" height="52" viewBox="0 0 42 52" aria-hidden="true">
                <path d="M21 51S3 32 3 19a18 18 0 1 1 36 0c0 13-18 32-18 32z" fill="#b8935a" />
                <circle cx="21" cy="19" r="7" fill="#141210" />
              </svg>
            </div>
            <div className={styles.card}>
              <h4>{brand.name} Downtown</h4>
              <p>
                {contact.addressLines.join(', ')}
                <br />
                {contact.phone}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <CtaBand />
    </>
  )
}
