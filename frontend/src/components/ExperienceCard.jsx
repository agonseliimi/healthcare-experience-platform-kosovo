import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { voteExperience } from '../api/api'
import { useAuth } from '../context/AuthContext'
import TrustBadge from './TrustBadge'
import VerificationLabel from './VerificationLabel'
import ReportModal from './ReportModal'
import { parseJourneySteps } from '../utils/journeySteps'
import { useTranslation } from 'react-i18next'

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

// Beyond this the chips wrap onto too many lines; the rest are on the detail page.
const MAX_VISIBLE_STEPS = 4

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
  const { t } = useTranslation()
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

  const steps = parseJourneySteps(exp.stepsTaken)
  const visibleSteps = steps.slice(0, MAX_VISIBLE_STEPS)
  const hiddenStepCount = steps.length - visibleSteps.length

  // 0 is a real answer (public care was free), not a missing value.
  const cost =
    exp.approximateCost == null
      ? '—'
      : exp.approximateCost === 0
        ? t('experienceCard.free')
        : `${exp.approximateCost} €`

  return (
    <article className="card exp-card">
      <div className="exp-top">
        <div>
          <div className="exp-category">{t(`categories.${exp.category}`) || exp.category}</div>
          <div className="exp-place">{exp.city}</div>
        </div>
        <span className={`chip chip--${exp.institutionType === 'PUBLIC_HOSPITAL' ? 'public' : 'private'}`}>
          {t(`institutions.${exp.institutionType}`)}
        </span>
      </div>

      {/* The journey leads the card: what they actually did, in order. */}
      {visibleSteps.length > 0 && (
        <div className="exp-steps">
          {visibleSteps.map((step, i) => (
            <span className="exp-step" key={`${step}-${i}`}>
              <span className="exp-step-n">{i + 1}</span>{step}
            </span>
          ))}
          {hiddenStepCount > 0 && (
            <span className="exp-step exp-step--more">
              {t('experienceCard.moreSteps', { count: hiddenStepCount })}
            </span>
          )}
        </div>
      )}

      <div className="exp-metrics">
        <div>
          <span className="m-label">{t('experienceCard.cost')}</span>
          <span className="m-value">{cost}</span>
        </div>
        <div>
          <span className="m-label">{t('experienceCard.wait')}</span>
          <span className="m-value">{exp.waitingTime || '—'}</span>
        </div>
        <div>
          <span className="m-label">{t('experienceCard.result')}</span>
          <span className="m-value">{exp.resultTime || '—'}</span>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <footer className="exp-foot">
        <div className="exp-foot-left">
          <VerificationLabel verificationLevel={exp.verificationLevel} />
          <TrustBadge
            likes={exp.likes}
            dislikes={exp.dislikes}
            verificationLevel={exp.verificationLevel}
            authorTrustScore={exp.authorTrustScore}
          />
        </div>

        <div className="exp-foot-right">
          <button className="icon-btn" onClick={() => handleVote('LIKE')} aria-label={t('experienceCard.like')}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 strokeWidth="2" strokeLinejoin="round" aria-hidden="true">
              <path d="M7 22V11l5-9 1 1v6h6l-2 13H7z" />
            </svg>
            {exp.likes ?? 0}
          </button>
          <button className="icon-btn" onClick={() => handleVote('DISLIKE')} aria-label={t('experienceCard.dislike')}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 strokeWidth="2" strokeLinejoin="round" aria-hidden="true"
                 style={{ transform: 'rotate(180deg)' }}>
              <path d="M7 22V11l5-9 1 1v6h6l-2 13H7z" />
            </svg>
            {exp.dislikes ?? 0}
          </button>
          <button className="icon-btn" onClick={handleReport} aria-label={t('experienceCard.report')}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 21V4M5 4h11l-1.5 4L16 12H5" />
            </svg>
          </button>
          <button className="exp-open" onClick={() => navigate(`/experiences/${exp.id}`)}>
            {t('experienceCard.open')}
          </button>
        </div>
      </footer>

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
