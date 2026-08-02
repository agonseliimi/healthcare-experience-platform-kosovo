import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getMyExperiences, getMyVerificationRequests, deleteExperience } from '../api/api'
import { useAuth } from '../context/AuthContext'
import VerificationLabel from '../components/VerificationLabel'
import LoadingState from '../components/LoadingState'
import ErrorState from '../components/ErrorState'

/** Contributor standing, derived from the (private) trust score. */
function contributorTier(trustScore) {
  const score = trustScore ?? 0
  if (score >= 80) return { key: 'verified', filled: 3 }
  if (score >= 40) return { key: 'trusted', filled: 2 }
  return { key: 'new', filled: 1 }
}

/** "Your journeys": what you shared, how it landed, and verification requests. */
function Dashboard() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [experiences, setExperiences] = useState([])
  const [verifications, setVerifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const [actionError, setActionError] = useState(null)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const [exps, verifs] = await Promise.all([getMyExperiences(), getMyVerificationRequests()])
      // Filter out deleted (HIDDEN) experiences so they don't show up in the panel.
      setExperiences(exps.filter((e) => e.status !== 'HIDDEN'))
      setVerifications(verifs)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  // Soft-delete an experience the user owns (backend sets its status to HIDDEN).
  async function handleDelete(exp) {
    const ok = window.confirm(
      t('dashboard.deleteConfirm', { category: t(`categories.${exp.category}`), city: exp.city })
    )
    if (!ok) return

    setActionError(null)
    setDeletingId(exp.id)
    try {
      await deleteExperience(exp.id)
      // Remove the deleted experience from local state immediately.
      setExperiences((prev) => prev.filter((e) => e.id !== exp.id))
    } catch (err) {
      setActionError(err.message)
    } finally {
      setDeletingId(null)
    }
  }

  const tier = contributorTier(user?.trustScore)
  const helpfulTotal = experiences.reduce((sum, e) => sum + (e.likes ?? 0), 0)

  return (
    <div className="page">
      <div className="mine-head">
        <div>
          <h1 className="page-title">{t('dashboard.title')}</h1>
          <p className="page-sub">{t('dashboard.sub')}</p>
        </div>
        <Link to="/submit" className="btn btn-primary">{t('dashboard.submitNew')}</Link>
      </div>

      <div className="mine-stats">
        <div className="mine-stat">
          <div className="eyebrow">{t('dashboard.shared')}</div>
          <div className="mine-stat-v">{experiences.length}</div>
        </div>
        <div className="mine-stat">
          <div className="eyebrow">{t('dashboard.foundHelpful')}</div>
          <div className="mine-stat-v">{helpfulTotal} <small>{t('dashboard.times')}</small></div>
        </div>
        <div className="mine-stat">
          <div className="eyebrow">{t('dashboard.contributorStatus')}</div>
          <div className="trust-badge" style={{ marginTop: 11 }}>
            <span className="trust-bars" aria-hidden="true">
              {[0, 1, 2].map((i) => (
                <span className={`trust-bar ${i < tier.filled ? 'is-on' : ''}`} key={i} />
              ))}
            </span>
            <span className="trust-label">{t(`dashboard.tier_${tier.key}`)}</span>
          </div>
        </div>
      </div>

      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message={error} onRetry={load} />
      ) : (
        <>
          {actionError && <div className="alert alert-error" style={{ marginTop: 16 }}>{actionError}</div>}

          {experiences.length === 0 ? (
            <p className="muted" style={{ marginTop: 20 }}>{t('dashboard.noExperiences')}</p>
          ) : (
            <div className="mine-list">
              {experiences.map((e) => (
                <div className="mine-row" key={e.id}>
                  <div className="mine-row-main">
                    <div className="mine-row-title">{t(`categories.${e.category}`)}</div>
                    <div className="mine-row-sub">{t(`institutions.${e.institutionType}`)} · {e.city}</div>
                  </div>
                  <VerificationLabel verificationLevel={e.verificationLevel} />
                  <span className="mine-row-helpful">{t('dashboard.helpfulCount', { count: e.likes ?? 0 })}</span>
                  <div className="mine-row-actions">
                    <Link className="link" to={`/experiences/${e.id}`}>{t('dashboard.view')}</Link>
                    <Link className="link" to={`/experiences/${e.id}/edit`}>{t('dashboard.edit')}</Link>
                    <button
                      type="button"
                      className="link link-danger"
                      onClick={() => handleDelete(e)}
                      disabled={deletingId === e.id}
                    >
                      {deletingId === e.id ? t('dashboard.deleting') : t('dashboard.delete')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <section className="section">
            <h2 className="section-title">{t('dashboard.myVerifications', { count: verifications.length })}</h2>
            {verifications.length === 0 ? (
              <p className="muted">{t('dashboard.noVerifications')}</p>
            ) : (
              <div className="table-wrap">
                <table className="table">
                  <thead>
                    <tr><th>{t('dashboard.colExperience')}</th><th>{t('dashboard.colNote')}</th><th>{t('dashboard.colStatus')}</th><th>{t('dashboard.colAdminNote')}</th></tr>
                  </thead>
                  <tbody>
                    {verifications.map((v) => (
                      <tr key={v.id}>
                        <td>{v.experienceCategory ? t(`categories.${v.experienceCategory}`) : `#${v.experienceId}`}</td>
                        <td>{v.documentNote || '—'}</td>
                        <td><span className={`status status--${v.status}`}>{t(`statuses.${v.status}`)}</span></td>
                        <td>{v.adminNote || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  )
}

export default Dashboard
