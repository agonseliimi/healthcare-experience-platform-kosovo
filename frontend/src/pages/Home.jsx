import { Link } from 'react-router-dom'
import Hero from '../components/Hero'

/** Landing page: hero, how it works, and feature cards. */
function Home() {
  const steps = [
    'Browse anonymous experiences',
    'Compare costs, waiting times, and steps',
    'Share your experience anonymously',
    'Choose optional verification',
    'Help the community identify trustworthy information',
  ]

  const features = [
    { title: 'Anonymous sharing', text: 'Share your journey without revealing your identity.' },
    { title: 'Public / private comparison', text: 'Compare public hospitals and private clinics.' },
    { title: 'Optional verification', text: 'Add evidence privately to raise confidence.' },
    { title: 'Trust score', text: 'Community credibility signals — not medical accuracy.' },
    { title: 'Abuse reporting', text: 'Flag privacy issues, medical-advice claims, or spam.' },
    { title: 'Privacy-first design', text: 'Documents are never public; identifiers are blocked.' },
  ]

  return (
    <div className="page home">
      <Hero />

      <section className="section">
        <h2 className="section-title">How it works</h2>
        <ol className="steps">
          {steps.map((s, i) => (
            <li key={i} className="step">
              <span className="step-num">{i + 1}</span>
              <span>{s}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="section">
        <h2 className="section-title">Why HealthPath</h2>
        <div className="feature-grid">
          {features.map((f) => (
            <div key={f.title} className="card feature">
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-text">{f.text}</p>
            </div>
          ))}
        </div>
        <div className="center">
          <Link to="/search" className="btn btn-primary btn-lg">Browse Experiences</Link>
        </div>
      </section>
    </div>
  )
}

export default Home
