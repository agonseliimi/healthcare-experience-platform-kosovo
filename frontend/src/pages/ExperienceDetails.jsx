import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getExperienceById, voteExperience } from '../api/api'
import { useAuth } from '../context/AuthContext'
import { INSTITUTION_LABELS, VERIFICATION_LABELS } from '../components/ExperienceCard'
import TrustBadge from '../components/TrustBadge'
import ReportModal from '../components/ReportModal'
import GuestLimitBanner from '../components/GuestLimitBanner'
import LoadingState from '../components/LoadingState'
import ErrorState from '../components/ErrorState'
import { hasReachedGuestLimit, incrementGuestUsage } from '../utils/guestUsage'

/** Full details for a single experience. */
function ExperienceDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [exp, setExp] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showReport, setShowReport] = useState(false)
  const [showGuestLimit, setShowGuestLimit] = useState(false)
  // Guard so a single view counts once, even with React StrictMode's double effect.
  const countedIdRef = useRef(null)

  useEffect(() => {
    // Viewing details counts as one guest action (per experience id).
    if (!isAuthenticated && countedIdRef.current !== id) {
      countedIdRef.current = id
      if (hasReachedGuestLimit()) {
        setShowGuestLimit(true)
      } else {
        incrementGuestUsage()
      }
    }
    async function load() {
      setLoading(true)
      setError(null)
      try {
        setExp(await getExperienceById(id))
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id, isAuthenticated])

  async function handleVote(type) {
    if (!isAuthenticated) {
      setShowGuestLimit(true)
      return
    }
    try {
      setExp(await voteExperience(exp.id, type))
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) return <div className="page"><LoadingState /></div>
  if (error) return <div className="page"><ErrorState message={error} onRetry={() => navigate(0)} /></div>
  if (!exp) return null

  return (
    <div className="page detail">
      <button className="link-btn back" onClick={() => navigate(-1)}>← Back</button>

      <div className="detail-head">
        <span className="exp-category">{exp.category}</span>
        <span className={`chip chip--${exp.institutionType === 'PUBLIC_HOSPITAL' ? 'public' : 'private'}`}>
          {INSTITUTION_LABELS[exp.institutionType]}
        </span>
        <span className={`vbadge vbadge--${exp.verificationLevel}`}>{VERIFICATION_LABELS[exp.verificationLevel]}</span>
      </div>

      <h1 className="detail-title">{exp.city}</h1>
      {exp.authorTrustScore != null && <TrustBadge score={exp.authorTrustScore} label={exp.authorTrustLabel} />}

      {exp.summary && <p className="detail-summary">{exp.summary}</p>}

      <div className="detail-grid">
        <Detail label="Steps taken" value={exp.stepsTaken} />
        <Detail label="Tests performed" value={exp.testsPerformed} />
        <Detail label="Approximate cost" value={exp.approximateCost != null ? `${exp.approximateCost} €` : '—'} />
        <Detail label="Waiting time" value={exp.waitingTime} />
        <Detail label="Result time" value={exp.resultTime} />
        <Detail label="Author" value={exp.authorDisplayName || 'Anonymous'} />
      </div>

      <div className="alert alert-warning">
        This is one anonymous journey. It should not be used as medical advice.
      </div>

      <div className="detail-actions">
        <button className="icon-btn" onClick={() => handleVote('LIKE')}>👍 {exp.likes ?? 0}</button>
        <button className="icon-btn" onClick={() => handleVote('DISLIKE')}>👎 {exp.dislikes ?? 0}</button>
        <button className="icon-btn" onClick={() => (isAuthenticated ? setShowReport(true) : setShowGuestLimit(true))}>⚑ Report</button>
      </div>

      {showReport && (
        <ReportModal experienceId={exp.id} reportedUserId={exp.authorId || undefined} onClose={() => setShowReport(false)} />
      )}
      {showGuestLimit && <GuestLimitBanner onContinue={() => setShowGuestLimit(false)} />}
    </div>
  )
}

function Detail({ label, value }) {
  return (
    <div className="detail-item">
      <span className="detail-item-label">{label}</span>
      <span className="detail-item-value">{value || '—'}</span>
    </div>
  )
}

export default ExperienceDetails
