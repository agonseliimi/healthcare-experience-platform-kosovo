import { Link } from 'react-router-dom'
import Hero from '../components/Hero'
import HowItWorks from '../components/HowItWorks'
import ExperienceCard from '../components/ExperienceCard'
import { mockExperiences } from '../data/mockExperiences'
import '../styles/HomePage.css'

/**
 * HomePage — the landing page of the platform.
 *
 * Sections:
 *   1. Hero — value proposition + CTA
 *   2. How It Works — 3-step explainer
 *   3. Recent Experiences — preview of the latest 3 entries
 *   4. Stats strip — quick numbers (mock for MVP)
 *
 * FUTURE: The "recent experiences" section will load from the API:
 *   GET /api/experiences?sort=latest&limit=3
 */
function HomePage() {
  // Show only the 3 most recent experiences as a preview
  const recentExperiences = mockExperiences.slice(0, 3)

  return (
    <div className="home-page">
      <Hero />

      {/* Stats strip — mock numbers for MVP, replace with real data later */}
      <section className="stats-strip" aria-label="Platform statistics">
        <div className="stats-inner">
          {/* FUTURE: These numbers will be pulled from GET /api/stats */}
          <div className="stat-item">
            <span className="stat-number">6</span>
            <span className="stat-label">Experiences Shared</span>
          </div>
          <div className="stat-divider" aria-hidden="true" />
          <div className="stat-item">
            <span className="stat-number">4</span>
            <span className="stat-label">Cities Represented</span>
          </div>
          <div className="stat-divider" aria-hidden="true" />
          <div className="stat-item">
            <span className="stat-number">100%</span>
            <span className="stat-label">Anonymous</span>
          </div>
          <div className="stat-divider" aria-hidden="true" />
          <div className="stat-item">
            <span className="stat-number">0</span>
            <span className="stat-label">Medical Diagnoses Given</span>
          </div>
        </div>
      </section>

      <HowItWorks />

      {/* Recent experiences preview */}
      <section className="home-recent" aria-labelledby="recent-heading">
        <div className="section-inner">
          <div className="section-label">Latest entries</div>
          <h2 id="recent-heading" className="section-heading">
            Recent Patient Journeys
          </h2>
          <p className="section-subheading">
            All entries are anonymous. No personal information is shown.
          </p>

          <div className="home-cards-grid">
            {recentExperiences.map((exp) => (
              <ExperienceCard key={exp.id} experience={exp} />
            ))}
          </div>

          <div className="home-see-all">
            <Link to="/search" className="btn btn-secondary">
              Browse All Experiences
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
