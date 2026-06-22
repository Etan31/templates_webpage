import './App.css'
import Nav         from './components/Nav'
import Hero        from './components/Hero'
import Marquee     from './components/Marquee'
import Stats       from './components/Stats'
import Services    from './components/Services'
import Team        from './components/Team'
import Testimonial from './components/Testimonial'
import Gallery     from './components/Gallery'
import Pricing     from './components/Pricing'
import Hours       from './components/Hours'
import Contact     from './components/Contact'
import Footer      from './components/Footer'

export default function App() {
  return (
    <div className="wrapper">
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <Stats />
        <Services />
        <Team />
        <Testimonial />
        <Gallery />
        <Pricing />
        <Hours />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
