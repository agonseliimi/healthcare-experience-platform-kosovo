import { Link } from 'react-router-dom'

/** Home page hero: value proposition, disclaimer, and primary CTAs. */
function Hero() {
  return (
    <section className="hero">
      <div className="hero-badge">
        <span className="hero-dot" aria-hidden="true" />
        Anonymous &amp; Privacy-First
      </div>

      <h1 className="hero-title">
        Transparent healthcare<br />experiences for Kosovo
      </h1>

      <p className="hero-sub">
        Read anonymous patient journeys, compare approximate costs, waiting times, and steps before
        visiting a healthcare institution.
      </p>

      <div className="hero-disclaimer">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
          <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        We do not give medical advice. We show real anonymous patient journeys.
      </div>

      <div className="hero-cta">
        <Link to="/search" className="btn btn-primary btn-lg">Search Experiences</Link>
        <Link to="/submit" className="btn btn-secondary btn-lg">Share Experience</Link>
      </div>
    </section>
  )
}

export default Hero
