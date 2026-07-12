import Reveal from './Reveal.jsx'

// Centered section heading: eyebrow + serif title (+ optional lead paragraph).
// `title` and `lead` accept nodes so callers can include line breaks.
export default function SectionHead({ eyebrow, title, lead, center = true }) {
  return (
    <Reveal className="head-c">
      <span className={center ? 'eyebrow center' : 'eyebrow'}>{eyebrow}</span>
      <h2 className="h-sec">{title}</h2>
      {lead && <p className="lead">{lead}</p>}
    </Reveal>
  )
}
