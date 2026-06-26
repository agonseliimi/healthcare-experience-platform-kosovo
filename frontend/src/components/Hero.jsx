import { Link } from 'react-router-dom'
import '../styles/Hero.css'

/**
 * Hero component — the first visible section on the Home page.
 *
 * Communicates three things immediately:
 *   1. What the platform is
 *   2. What it is NOT (not medical advice)
 *   3. Two clear calls-to-action
 *
 * The calm, clear design is intentional — patients should feel safe sharing.
 */
function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-heading">
      {/* Privacy badge — builds immediate trust */}
      <div className="hero-badge">
        <span className="hero-badge-dot" aria-hidden="true" />
        Anonymous &amp; Privacy-First
      </div>

      <h1 id="hero-heading" className="hero-heading">
        Real patient journeys.<br />
        <span className="hero-heading-highlight">No names. No advice.</span>
      </h1>

      <p className="hero-subheading">
        HealthPath Kosovo helps you understand what to expect when navigating the healthcare system.
        Read and share anonymous experiences about costs, waiting times, tests, and steps — 
        so no one has to figure it out alone.
      </p>

      {/* Critical disclaimer — must be prominent */}
      <div className="hero-disclaimer" role="note">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
          <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <span>
          We do not give medical advice. We show real anonymous patient journeys.
        </span>
      </div>

      {/* Primary call-to-action buttons */}
      <div className="hero-cta-group">
        <Link to="/search" className="btn btn-primary">
          Search Experiences
        </Link>
        <Link to="/submit" className="btn btn-secondary">
          Share Your Journey
        </Link>
      </div>
    </section>
  )
}

export default Hero
