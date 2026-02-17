import Hero from './components/Hero'
import ValueSection from './components/ValueSection'
import HowItWorks from './components/HowItWorks'
import Benefits from './components/Benefits'
import Metrics from './components/Metrics'
import Acquisition from './components/Acquisition'
import Footer from './components/Footer'

function App() {
  return (
    <div className="min-h-screen">
      <Hero />
      <ValueSection />
      <HowItWorks />
      <Benefits />
      <Metrics />
      <Acquisition />
      <Footer />
    </div>
  )
}

export default App
