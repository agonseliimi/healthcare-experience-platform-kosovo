import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { voteExperience } from '../api/api'
import { useAuth } from '../context/AuthContext'
import TrustBadge from './TrustBadge'
import ReportModal from './ReportModal'

// Human-readable labels for backend enums.
export const INSTITUTION_LABELS = {
  PUBLIC_HOSPITAL: 'Public Hospital',
  PRIVATE_CLINIC: 'Private Clinic',
}
export const VERIFICATION_LABELS = {
  SELF_REPORTED: 'Self-Reported',
  DOCUMENT_SUPPORTED: 'Document-Supported',
  HIGH_CONFIDENCE: 'High-Confidence',
}

/**
 * Displays a single experience with actions.
 *
 * Props:
 *   experience     - the experience object from the API
 *   onChanged      - optional callback after a successful vote (to refresh lists)
 *   onRequireAuth  - called when a guest tries a members-only action
 */
function ExperienceCard({ experience, onChanged, onRequireAuth }) {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [exp, setExp] = useState(experience)
  const [showReport, setShowReport] = useState(false)
  const [error, setError] = useState(null)

  async function handleVote(type) {
    if (!isAuthenticated) {
      onRequireAuth?.()
      return
    }
    setError(null)
    try {
      const updated = await voteExperience(exp.id, type)
      setExp(updated)
      onChanged?.()
    } catch (err) {
      setError(err.message)
    }
  }

  function handleReport() {
    if (!isAuthenticated) {
      onRequireAuth?.()
      return
    }
    setShowReport(true)
  }

  const stepsPreview = exp.stepsTaken
    ? exp.stepsTaken.length > 120 ? exp.stepsTaken.slice(0, 120) + '…' : exp.stepsTaken
    : '—'
  const testsPreview = exp.testsPerformed || '—'

  return (
    <article className="card exp-card">
      <div className="exp-top">
        <span className="exp-category">{exp.category}</span>
        <span className={`chip chip--${exp.institutionType === 'PUBLIC_HOSPITAL' ? 'public' : 'private'}`}>
          {INSTITUTION_LABELS[exp.institutionType]}
        </span>
      </div>

      <p className="exp-city">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="currentColor" strokeWidth="2" />
          <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="2" />
        </svg>
        {exp.city}
      </p>

      {exp.summary && <p className="exp-summary">{exp.summary}</p>}

      <div className="exp-field">
        <span className="exp-field-label">Steps</span>
        <span className="exp-field-value">{stepsPreview}</span>
      </div>
      <div className="exp-field">
        <span className="exp-field-label">Tests</span>
        <span className="exp-field-value">{testsPreview}</span>
      </div>

      <div className="exp-metrics">
        <div><span className="m-label">Cost</span><span className="m-value">{exp.approximateCost != null ? `${exp.approximateCost} €` : '—'}</span></div>
        <div><span className="m-label">Wait</span><span className="m-value">{exp.waitingTime || '—'}</span></div>
        <div><span className="m-label">Result</span><span className="m-value">{exp.resultTime || '—'}</span></div>
      </div>

      <div className="exp-badges">
        <span className={`vbadge vbadge--${exp.verificationLevel}`}>{VERIFICATION_LABELS[exp.verificationLevel]}</span>
        {exp.authorTrustScore != null && (
          <TrustBadge score={exp.authorTrustScore} label={exp.authorTrustLabel} />
        )}
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="exp-actions">
        <button className="icon-btn" onClick={() => handleVote('LIKE')} aria-label="Like">
          <span aria-hidden="true">👍</span> {exp.likes ?? 0}
        </button>
        <button className="icon-btn" onClick={() => handleVote('DISLIKE')} aria-label="Dislike">
          <span aria-hidden="true">👎</span> {exp.dislikes ?? 0}
        </button>
        <button className="icon-btn" onClick={handleReport} aria-label="Report">
          <span aria-hidden="true">⚑</span> Report
        </button>
        <button className="btn btn-secondary btn-sm exp-view" onClick={() => navigate(`/experiences/${exp.id}`)}>
          View Details
        </button>
      </div>

      {showReport && (
        <ReportModal
          experienceId={exp.id}
          reportedUserId={exp.authorId || undefined}
          onClose={() => setShowReport(false)}
        />
      )}
    </article>
  )
}

export default ExperienceCard
