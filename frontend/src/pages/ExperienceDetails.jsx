import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getExperienceById, getExperiences, voteExperience, getExperienceDocumentUrl } from '../api/api'
import { useAuth } from '../context/AuthContext'
import TrustBadge from '../components/TrustBadge'
import VerificationLabel, { isDocumented } from '../components/VerificationLabel'
import ReportModal from '../components/ReportModal'
import GuestLimitBanner from '../components/GuestLimitBanner'
import LoadingState from '../components/LoadingState'
import ErrorState from '../components/ErrorState'
import { parseJourneySteps } from '../utils/journeySteps'
import { findSimilarJourneys } from '../utils/similarJourneys'
import { isSaved, toggleSaved } from '../utils/savedJourneys'
import { hasReachedGuestLimit, incrementGuestUsage } from '../utils/guestUsage'

/** Full details for a single experience. */
function ExperienceDetails() {
  const { t } = useTranslation()
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [exp, setExp] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showReport, setShowReport] = useState(false)
  const [showGuestLimit, setShowGuestLimit] = useState(false)
  const [similar, setSimilar] = useState([])
  const [saved, setSaved] = useState(false)
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
      setSaved(isSaved(id))
      try {
        const current = await getExperienceById(id)
        setExp(current)

        // Similar journeys are matched client-side from the full list; the list
        // endpoint returns everything at once, so this needs no extra API.
        try {
          const all = await getExperiences({})
          setSimilar(findSimilarJourneys(current, Array.isArray(all) ? all : []))
        } catch {
          setSimilar([])
        }
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

  const steps = parseJourneySteps(exp.stepsTaken)
  const documented = isDocumented(exp)
  const cost = exp.approximateCost == null
    ? '—'
    : exp.approximateCost === 0 ? t('experienceCard.free') : `${exp.approximateCost} €`

  return (
    <div className="page detail">
      <button className="link-btn back" onClick={() => navigate(-1)}>{t('details.back')}</button>

      <div className="detail-layout">
        <div className="detail-main">
          <div className="detail-head">
            <h1 className="detail-title">{t(`categories.${exp.category}`)}</h1>
            <span className={`chip chip--${exp.institutionType === 'PUBLIC_HOSPITAL' ? 'public' : 'private'}`}>
              {t(`institutions.${exp.institutionType}`)}
            </span>
          </div>
          <p className="detail-place">{exp.city}</p>

          {exp.summary && <p className="detail-summary">{exp.summary}</p>}

          {Array.isArray(exp.symptoms) && exp.symptoms.length > 0 && (
            <>
              <div className="detail-symptoms">
                <span className="eyebrow">{t('details.reportedSymptoms')}</span>
                {exp.symptoms.map((symptom) => (
                  <span className="symptom-chip--static" key={symptom}>{symptom}</span>
                ))}
              </div>
              <p className="detail-symptoms-note">{t('details.symptomsDisclaimer')}</p>
            </>
          )}

          {/* The journey as a timeline. Falls back to the raw text if the author
              did not separate their steps with arrows. */}
          {steps.length > 1 ? (
            <ol className="timeline">
              {steps.map((step, i) => (
                <li className="tl-step" key={`${step}-${i}`}>
                  <div className="tl-rail" aria-hidden="true">
                    <span className="tl-num">{i + 1}</span>
                    {i < steps.length - 1 && <span className="tl-line" />}
                  </div>
                  <div className="tl-body">
                    <div className="tl-head">
                      <span className="tl-title">{step}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          ) : (
            exp.stepsTaken && (
              <div className="timeline">
                <p className="detail-summary">{exp.stepsTaken}</p>
              </div>
            )
          )}

          {exp.testsPerformed && (
            <div className="detail-symptoms">
              <span className="eyebrow">{t('details.tests')}</span>
              <span className="symptom-chip--static">{exp.testsPerformed}</span>
            </div>
          )}

          <div className="detail-totals">
            <div>
              <div className="eyebrow">{t('details.cost')}</div>
              <div className="detail-total-v">{cost}</div>
            </div>
            <div>
              <div className="eyebrow">{t('details.wait')}</div>
              <div className="detail-total-v">{exp.waitingTime || '—'}</div>
            </div>
            <div>
              <div className="eyebrow">{t('details.result')}</div>
              <div className="detail-total-v">{exp.resultTime || '—'}</div>
            </div>
          </div>

          {/* Published on purpose: the author blurs sensitive areas before upload. */}
          {exp.hasDocument && (
            <div className="detail-document">
              <div className="detail-document-head">
                <span className="eyebrow">{t('details.documentTitle')}</span>
                {exp.documentName && <span className="detail-symptoms-note">{exp.documentName}</span>}
              </div>
              {exp.documentContentType && exp.documentContentType.startsWith('image/') ? (
                <img
                  src={getExperienceDocumentUrl(exp.id)}
                  alt={exp.documentName || t('details.viewDocument')}
                  className="detail-document-img"
                />
              ) : (
                <a
                  href={getExperienceDocumentUrl(exp.id)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary btn-sm"
                >
                  {t('details.viewDocument')}
                </a>
              )}
              <p className="detail-symptoms-note">{t('details.documentNote')}</p>
            </div>
          )}

          <div className="alert alert-warning" style={{ marginTop: 22 }}>
            {t('details.disclaimer')}
          </div>
        </div>

        <aside className="detail-side">
          <div className="side-card">
            <div className="eyebrow">{t('details.verification')}</div>
            <div className={`side-verdict ${documented ? 'side-verdict--doc' : 'side-verdict--self'}`}>
              <VerificationLabel experience={exp} />
            </div>
            <p className="side-text">
              {documented ? t('details.verificationDocumented') : t('details.verificationSelfReported')}
            </p>
            <div className="side-trust">
              <TrustBadge
                likes={exp.likes}
                dislikes={exp.dislikes}
                verificationLevel={exp.verificationLevel}
                hasDocument={exp.hasDocument}
                authorTrustScore={exp.authorTrustScore}
              />
            </div>
          </div>

          <div className="side-card">
            <div className="side-title">{t('details.wasHelpful')}</div>
            <div className="side-actions">
              <button
                className={`btn btn-sm ${exp.myVote === 'LIKE' ? 'btn-success' : 'btn-secondary'}`}
                aria-pressed={exp.myVote === 'LIKE'}
                onClick={() => handleVote('LIKE')}
              >
                {exp.myVote === 'LIKE' ? `✓ ${t('details.helpfulYes')}` : t('details.helpfulYes')}
              </button>
              <button
                className={`btn btn-sm ${exp.myVote === 'DISLIKE' ? 'btn-ghost' : 'btn-secondary'}`}
                aria-pressed={exp.myVote === 'DISLIKE'}
                onClick={() => handleVote('DISLIKE')}
              >
                {exp.myVote === 'DISLIKE' ? `✓ ${t('details.helpfulNo')}` : t('details.helpfulNo')}
              </button>
            </div>
            {exp.myVote && <p className="side-vote-mine">{t('details.yourVoteNote')}</p>}
            <p className="side-vote-summary">
              {t('details.voteSummary', { likes: exp.likes ?? 0, dislikes: exp.dislikes ?? 0 })}
            </p>
            <div className="side-links">
              <button
                className={`link-btn ${saved ? 'is-saved' : ''}`}
                aria-pressed={saved}
                onClick={() => setSaved(toggleSaved(exp.id))}
              >
                {saved ? t('details.saved') : t('details.saveForLater')}
              </button>
              <button
                className="link-btn link-danger"
                onClick={() => (isAuthenticated ? setShowReport(true) : setShowGuestLimit(true))}
              >
                {t('details.report')}
              </button>
            </div>
          </div>

          {similar.length > 0 && (
            <div className="side-card">
              <div className="eyebrow">{t('details.similarJourneys')}</div>
              <div className="similar-list">
                {similar.map((item) => (
                  <button
                    key={item.id}
                    className="similar-item"
                    onClick={() => navigate(`/experiences/${item.id}`)}
                  >
                    <span className="similar-title">{t(`categories.${item.category}`)}</span>
                    <span className="similar-meta">
                      {item.city}
                      {' · '}
                      {item.approximateCost == null
                        ? '—'
                        : item.approximateCost === 0 ? t('experienceCard.free') : `${item.approximateCost} €`}
                      {item.waitingTime ? ` · ${item.waitingTime}` : ''}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>

      {showReport && (
        <ReportModal experienceId={exp.id} reportedUserId={exp.authorId || undefined} onClose={() => setShowReport(false)} />
      )}
      {showGuestLimit && <GuestLimitBanner onContinue={() => setShowGuestLimit(false)} />}
    </div>
  )
}

export default ExperienceDetails
