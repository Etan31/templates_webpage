import { useDocumentTitle } from '../../hooks/useDocumentTitle.js'
import PageHeader from '../../components/ui/PageHeader.jsx'
import Reveal from '../../components/ui/Reveal.jsx'
import SectionHead from '../../components/ui/SectionHead.jsx'
import CtaBand from '../../components/ui/CtaBand.jsx'
import PackageCard from '../../components/cards/PackageCard.jsx'
import { packages } from '../../data/packages.js'
import styles from './Packages.module.css'

export default function Packages() {
  useDocumentTitle('Packages')
  return (
    <>
      <PageHeader
        title="Grooming Packages"
        current="Packages"
        bg="https://images.unsplash.com/photo-1621607512214-68297480165e?q=80&w=1200&auto=format&fit=crop"
      />

      <section className="pad">
        <div className="container">
          <SectionHead
            eyebrow="Curated Combinations"
            title="Pick Your Ritual"
            lead="Bundled services at a better value — from a quick refresh to the full executive treatment."
          />
          <div className="grid-3">
            {packages.map((pkg, i) => (
              <Reveal key={pkg.name} d={i + 1}>
                <PackageCard pkg={pkg} />
              </Reveal>
            ))}
          </div>
          <Reveal as="p" className={styles.note}>
            All packages include a personal consultation. Prices shown per visit · gratuity not
            included.
          </Reveal>
        </div>
      </section>

      <CtaBand />
    </>
  )
}
