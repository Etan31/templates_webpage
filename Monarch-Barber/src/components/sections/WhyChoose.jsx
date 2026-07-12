import SectionHead from '../ui/SectionHead.jsx'
import Reveal from '../ui/Reveal.jsx'
import FeatureCard from '../cards/FeatureCard.jsx'
import { whyChoose } from '../../data/features.js'

// Dark "why choose us" block, shared by Home and About.
export default function WhyChoose() {
  return (
    <section className="pad dark">
      <div className="container">
        <SectionHead
          eyebrow="Why Choose Us"
          title={
            <>
              Quality You Can See,
              <br />
              Experience You Can Feel
            </>
          }
        />
        <div className="grid-4">
          {whyChoose.map((feature, i) => (
            <Reveal key={feature.title} d={i + 1}>
              <FeatureCard feature={feature} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
