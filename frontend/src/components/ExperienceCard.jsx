import { verificationLevels } from '../data/mockExperiences'
import '../styles/ExperienceCard.css'

/**
 * ExperienceCard component — renders a single patient experience entry.
 *
 * Designed to show useful transparency information without revealing
 * any personal data. Fields are deliberately general.
 *
 * Props:
 *   experience (object) — a single experience object from mockExperiences.js
 *
 * FUTURE: "Was this helpful?" vote buttons will be wired to a backend endpoint.
 * FUTURE: Card click will expand into a full detail view / modal.
 */
function ExperienceCard({ experience }) {
  const verification = verificationLevels[experience.verificationStatus]

  return (
    <article className="exp-card" aria-label={`Experience: ${experience.category} in ${experience.city}`}>
      {/* Top row: category + institution type badge */}
      <div className="exp-card-header">
        <span className="exp-card-category">{experience.category}</span>
        <span
          className={`exp-card-badge exp-card-badge--${experience.institutionType}`}
          aria-label={`Institution type: ${experience.institutionType}`}
        >
          {experience.institutionType === 'public' ? 'Public Hospital' : 'Private Clinic'}
        </span>
      </div>

      {/* Symptom summary — general description only, no personal details */}
      <p className="exp-card-summary">{experience.symptomSummary}</p>

      {/* Location */}
      <p className="exp-card-location">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
            stroke="currentColor"
            strokeWidth="2"
          />
          <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="2" />
        </svg>
        {experience.city}
      </p>

      {/* Steps taken — core transparency information */}
      <div className="exp-card-section">
        <h4 className="exp-card-section-label">Steps taken</h4>
        <ol className="exp-card-steps">
          {experience.steps.map((step, i) => (
            <li key={i} className="exp-card-step">{step}</li>
          ))}
        </ol>
      </div>

      {/* Key metrics row */}
      <div className="exp-card-metrics">
        <div className="exp-card-metric">
          <span className="exp-card-metric-label">Cost</span>
          <span className="exp-card-metric-value">{experience.approximateCost}</span>
        </div>
        <div className="exp-card-metric">
          <span className="exp-card-metric-label">Wait time</span>
          <span className="exp-card-metric-value">{experience.waitingTime}</span>
        </div>
        <div className="exp-card-metric">
          <span className="exp-card-metric-label">Result time</span>
          <span className="exp-card-metric-value">{experience.resultTime}</span>
        </div>
      </div>

      {/* Verification badge */}
      <div className="exp-card-footer">
        <span
          className="exp-card-verification"
          style={{ borderColor: verification?.color, color: verification?.color }}
          title={verification?.description}
          aria-label={`Verification: ${verification?.label}`}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
          {verification?.label}
        </span>

        <span className="exp-card-anon">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
              stroke="currentColor"
              strokeWidth="2"
            />
            <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
          </svg>
          Anonymous
        </span>

        {/* FUTURE: "Was this helpful?" upvote button connected to backend */}
        <button className="exp-card-helpful" disabled title="Coming soon">
          Helpful
        </button>
      </div>
    </article>
  )
}

export default ExperienceCard
