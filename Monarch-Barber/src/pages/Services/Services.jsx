import { useDocumentTitle } from '../../hooks/useDocumentTitle.js'
import PageHeader from '../../components/ui/PageHeader.jsx'
import Reveal from '../../components/ui/Reveal.jsx'
import SectionHead from '../../components/ui/SectionHead.jsx'
import CtaBand from '../../components/ui/CtaBand.jsx'
import ServiceCard from '../../components/cards/ServiceCard.jsx'
import StatsBar from '../../components/cards/StatsBar.jsx'
import { services } from '../../data/services.js'
import { servicesStats } from '../../data/stats.js'

export default function Services() {
  useDocumentTitle('Services')
  return (
    <>
      <PageHeader
        title="Our Services"
        current="Services"
        bg="https://images.unsplash.com/photo-1493256338651-d82f7acb2b38?q=80&w=1200&auto=format&fit=crop"
      />

      <section className="pad">
        <div className="container">
          <SectionHead
            eyebrow="Premium Grooming"
            title="Crafted For Every Look"
            lead="Every service begins with a consultation and ends with you looking your sharpest. Pricing starts from the rates below."
          />
          <div className="grid-3">
            {services.map((service, i) => (
              <Reveal key={service.id} d={(i % 3) + 1}>
                <ServiceCard service={service} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="pad-sm dark">
        <div className="container">
          <StatsBar stats={servicesStats} plain />
        </div>
      </section>

      <CtaBand />
    </>
  )
}
