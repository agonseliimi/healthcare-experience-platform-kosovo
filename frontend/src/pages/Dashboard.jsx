import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getMyExperiences, getMyVerificationRequests, deleteExperience } from '../api/api'
import { useAuth } from '../context/AuthContext'
import TrustBadge from '../components/TrustBadge'
import LoadingState from '../components/LoadingState'
import ErrorState from '../components/ErrorState'

/** User dashboard: profile stats, own experiences, and verification requests. */
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
      setExperiences(exps)
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
      await load()
    } catch (err) {
      setActionError(err.message)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="page">
      <header className="page-head">
        <h1 className="page-title">{t('dashboard.welcome', { name: user?.displayName })}</h1>
        <p className="page-sub">{t('dashboard.sub')}</p>
      </header>

      <div className="stat-cards">
        <div className="card stat">
          <span className="stat-label">{t('dashboard.trust')}</span>
          <TrustBadge score={user?.trustScore} label={user?.trustLabel} />
        </div>
        <div className="card stat"><span className="stat-label">{t('dashboard.likesReceived')}</span><span className="stat-num">{user?.likesReceived ?? 0}</span></div>
        <div className="card stat"><span className="stat-label">{t('dashboard.dislikesReceived')}</span><span className="stat-num">{user?.dislikesReceived ?? 0}</span></div>
        <div className="card stat"><span className="stat-label">{t('dashboard.reportsReceived')}</span><span className="stat-num">{user?.reportsReceived ?? 0}</span></div>
      </div>

      <div className="center dash-cta">
        <Link to="/submit" className="btn btn-primary">{t('dashboard.submitNew')}</Link>
      </div>

      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message={error} onRetry={load} />
      ) : (
        <>
          <section className="section">
            <h2 className="section-title">{t('dashboard.myExperiences', { count: experiences.length })}</h2>
            {actionError && <div className="alert alert-error">{actionError}</div>}
            {experiences.length === 0 ? (
              <p className="muted">{t('dashboard.noExperiences')}</p>
            ) : (
              <div className="table-wrap">
                <table className="table">
                  <thead>
                    <tr><th>{t('dashboard.colCategory')}</th><th>{t('dashboard.colInstitution')}</th><th>{t('dashboard.colCity')}</th><th>{t('dashboard.colStatus')}</th><th>{t('dashboard.colVerification')}</th><th>{t('dashboard.colLikes')}</th><th>{t('dashboard.colActions')}</th></tr>
                  </thead>
                  <tbody>
                    {experiences.map((e) => (
                      <tr key={e.id}>
                        <td>{t(`categories.${e.category}`)}</td>
                        <td>{t(`institutions.${e.institutionType}`)}</td>
                        <td>{e.city}</td>
                        <td><span className={`status status--${e.status}`}>{t(`statuses.${e.status}`)}</span></td>
                        <td>{t(`verifications.${e.verificationLevel}`)}</td>
                        <td>{e.likes}</td>
                        <td>
                          <div className="row-actions">
                            <Link className="link" to={`/experiences/${e.id}`}>{t('dashboard.view')}</Link>
                            <Link className="link" to={`/experiences/${e.id}/edit`}>{t('dashboard.edit')}</Link>
                            {e.status !== 'HIDDEN' && (
                              <button
                                type="button"
                                className="link link-danger"
                                onClick={() => handleDelete(e)}
                                disabled={deletingId === e.id}
                              >
                                {deletingId === e.id ? t('dashboard.deleting') : t('dashboard.delete')}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

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
