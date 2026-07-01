import { BrowserRouter, Routes, Route } from 'react-router-dom'
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
import ConciergeBanner from './components/ConciergeBanner'
import BookingPage     from './pages/BookingPage'
import AppointmentPage from './pages/AppointmentPage'
import NotFound        from './pages/errors/NotFound'

function HomePage() {
  return (
    <div className="wrapper">
      <Nav />
      <main>
        <Hero />
        <ConciergeBanner />
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

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"        element={<HomePage />} />
        <Route path="/booking"     element={<BookingPage />} />
        <Route path="/appointment" element={<AppointmentPage />} />
        <Route path="*"            element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}
