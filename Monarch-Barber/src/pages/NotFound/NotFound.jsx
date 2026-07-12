import { useDocumentTitle } from '../../hooks/useDocumentTitle.js'
import PageHeader from '../../components/ui/PageHeader.jsx'
import Reveal from '../../components/ui/Reveal.jsx'
import SectionHead from '../../components/ui/SectionHead.jsx'
import Button from '../../components/ui/Button.jsx'
import CtaBand from '../../components/ui/CtaBand.jsx'

export default function NotFound() {
  useDocumentTitle('Page Not Found')
  return (
    <>
      <PageHeader
        title="Page Not Found"
        current="404"
        bg="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=1400&auto=format&fit=crop"
      />

      <section className="pad">
        <div className="container">
          <SectionHead
            eyebrow="Error 404"
            title="This Chair Doesn't Exist"
            lead="The page you're looking for has moved or never existed. Let's get you back to a fresh cut."
          />
          <Reveal className="center-cta">
            <Button to="/" variant="dark">
              Back To Home
            </Button>
          </Reveal>
        </div>
      </section>

      <CtaBand />
    </>
  )
}
