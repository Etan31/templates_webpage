import { useDocumentTitle } from '../../hooks/useDocumentTitle.js'
import PageHeader from '../../components/ui/PageHeader.jsx'
import Reveal from '../../components/ui/Reveal.jsx'
import Button from '../../components/ui/Button.jsx'
import Img from '../../components/ui/Img.jsx'
import Chip from '../../components/ui/Chip.jsx'
import SectionHead from '../../components/ui/SectionHead.jsx'
import CtaBand from '../../components/ui/CtaBand.jsx'
import WhyChoose from '../../components/sections/WhyChoose.jsx'
import TeamCard from '../../components/cards/TeamCard.jsx'
import ServiceCard from '../../components/cards/ServiceCard.jsx'
import { team } from '../../data/team.js'
import { services } from '../../data/services.js'
import { aboutHighlights } from '../../data/features.js'
import { brand } from '../../data/site.js'
import styles from './About.module.css'

export default function About() {
  useDocumentTitle('About')
  return (
    <>
      <PageHeader
        title="Our Story"
        current="About"
        bg="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=1400&auto=format&fit=crop"
      />

      <section className="pad">
        <div className={`container ${styles.split}`}>
          <Reveal className={styles.imgWrap}>
            <div className={styles.imgA}>
              <Img
                src="https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=1000&auto=format&fit=crop"
                alt={`A ${brand.name} barber at work`}
              />
            </div>
            <div className={styles.imgB}>
              <Img
                src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=800&auto=format&fit=crop"
                alt={`Inside the ${brand.name} shop`}
              />
            </div>
            <div className={styles.exp}>
              <div className={styles.expN}>12+</div>
              <div className={styles.expT}>Years of Craft</div>
            </div>
          </Reveal>

          <Reveal className={styles.copy} d="2">
            <span className="eyebrow">Our Story</span>
            <h2 className="h-sec">
              More Than A Barber Shop,
              <br />
              It&apos;s A Culture
            </h2>
            <p className="lead">
              Founded on passion and precision, {brand.name} is where classic technique meets modern
              style. We&apos;re here to elevate your everyday look and make every visit feel like a
              ritual.
            </p>
            <div className={styles.miniFeats}>
              {aboutHighlights.map((f) => (
                <div key={f.title} className={styles.miniFeat}>
                  <Chip icon={f.icon} />
                  <div>
                    <h4>{f.title}</h4>
                    <p>{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button to="/contact" variant="dark">
              Book Now
            </Button>
          </Reveal>
        </div>
      </section>

      <WhyChoose />

      <section className="pad">
        <div className="container">
          <SectionHead
            eyebrow="Our Barbers"
            title="Meet The Team"
            lead="The steady hands behind every sharp cut — each a specialist in their craft."
          />
          <div className="grid-4">
            {team.map((member, i) => (
              <Reveal key={member.name} d={i + 1}>
                <TeamCard member={member} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="pad-sm paper-2">
        <div className="container">
          <SectionHead eyebrow="What We Do" title="Services We Provide" />
          <div className="grid-3">
            {services.slice(0, 3).map((service, i) => (
              <Reveal key={service.id} d={i + 1}>
                <ServiceCard service={service} />
              </Reveal>
            ))}
          </div>
          <Reveal className="center-cta">
            <Button to="/services" variant="dark">
              Explore All Services
            </Button>
          </Reveal>
        </div>
      </section>

      <CtaBand />
    </>
  )
}
