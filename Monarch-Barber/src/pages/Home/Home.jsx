import { useDocumentTitle } from '../../hooks/useDocumentTitle.js'
import Reveal from '../../components/ui/Reveal.jsx'
import Button from '../../components/ui/Button.jsx'
import Img from '../../components/ui/Img.jsx'
import Chip from '../../components/ui/Chip.jsx'
import Icon from '../../components/ui/Icon.jsx'
import SectionHead from '../../components/ui/SectionHead.jsx'
import CtaBand from '../../components/ui/CtaBand.jsx'
import WhyChoose from '../../components/sections/WhyChoose.jsx'
import StatsBar from '../../components/cards/StatsBar.jsx'
import ServiceCard from '../../components/cards/ServiceCard.jsx'
import TeamCard from '../../components/cards/TeamCard.jsx'
import { services } from '../../data/services.js'
import { team } from '../../data/team.js'
import { iconStrip } from '../../data/features.js'
import { homeStats, heroStats } from '../../data/stats.js'
import styles from './Home.module.css'

const AVATARS = [
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=120&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=120&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=120&auto=format&fit=crop',
]

function Hero() {
  return (
    <section className={styles.hero}>
      <div className={`container ${styles.grid}`}>
        <Reveal className={styles.copy}>
          <div className={styles.eyebrow}>
            <Chip icon="arrowUpRight" />
            <span className="script">Welcome To</span>
          </div>
          <h1>
            A New Standard
            <br />
            Of Grooming
          </h1>
          <p className="lead">
            Classic cuts. Modern style. Premium experience. Redefining confidence, one cut at a
            time.
          </p>
          <div className={styles.actions}>
            <Button to="/contact" variant="dark">
              Book Appointment
            </Button>
            <Button to="/services" variant="ghost">
              Explore Services
            </Button>
          </div>
          <div className={styles.trust}>
            <div className={styles.avatars}>
              {AVATARS.map((src) => (
                <Img key={src} src={src} alt="" loading="eager" />
              ))}
              <span className={styles.rating}>4.9</span>
            </div>
            <div className={styles.trustTxt}>
              <strong>2K+ Happy Clients</strong>
              <span>Trusted by our community</span>
            </div>
          </div>
        </Reveal>

        <Reveal className={styles.visual} d="2">
          <div className={styles.photo}>
            <Img
              src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=1100&auto=format&fit=crop"
              alt="A Monarch client with a fresh cut and styled beard"
              loading="eager"
            />
          </div>
          <div className={styles.stats}>
            {heroStats.map((row) => (
              <div key={row.label} className={styles.row}>
                <Chip icon={row.icon} />
                <div>
                  <div className={styles.num}>{row.num}</div>
                  <div className={styles.lbl}>{row.label}</div>
                </div>
              </div>
            ))}
          </div>
          <div className={styles.badge}>
            <Img src={team[0].img} alt={team[0].name} />
            <div>
              <div className={styles.nm}>{team[0].name}</div>
              <div className={styles.rl}>{team[0].role}</div>
            </div>
            <span className={styles.sig}>{'Alex T.'}</span>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function IconStrip() {
  return (
    <section className="pad-sm paper-2">
      <div className="container">
        <SectionHead eyebrow="Premium Grooming" title="Where Style Meets Precision" />
        <div className={styles.iconstrip}>
          {iconStrip.map((item, i) => (
            <Reveal key={item.title} className={styles.item} d={i + 1}>
              <div className={styles.ic}>
                <Icon name={item.icon} />
              </div>
              <h4>{item.title}</h4>
              <p>{item.desc}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  useDocumentTitle('Home')
  return (
    <>
      <Hero />
      <IconStrip />
      <WhyChoose />

      <section className="pad">
        <div className="container">
          <SectionHead
            eyebrow="Our Craft"
            title="Crafted Cuts. Confident You."
            lead="From timeless classics to modern trends, we tailor every cut to match your style and personality."
          />
          <div className="grid-3">
            {services.slice(0, 3).map((service, i) => (
              <Reveal key={service.id} d={i + 1}>
                <ServiceCard service={service} />
              </Reveal>
            ))}
          </div>
          <Reveal className="center-cta">
            <Button to="/services" variant="dark">
              View All Services
            </Button>
          </Reveal>
        </div>
      </section>

      <section className="pad-sm paper-2">
        <div className="container">
          <SectionHead eyebrow="Our Team" title="Meet The Masters" />
          <div className="grid-3">
            {team.slice(0, 3).map((member, i) => (
              <Reveal key={member.name} d={i + 1}>
                <TeamCard member={member} />
              </Reveal>
            ))}
          </div>
          <Reveal className="center-cta">
            <Button to="/about" variant="ghost">
              Meet The Full Team
            </Button>
          </Reveal>
        </div>
      </section>

      <section className="pad-sm">
        <div className="container">
          <StatsBar stats={homeStats} />
        </div>
      </section>

      <CtaBand />
    </>
  )
}
