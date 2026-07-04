import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getAdminReports, updateReportStatus, updateExperienceStatus } from '../api/api'
import LoadingState from '../components/LoadingState'
import ErrorState from '../components/ErrorState'

// Maps backend report reasons to translation keys.
const REASON_KEYS = {
  PERSONAL_INFO_EXPOSED: 'r_personal',
  MEDICAL_ADVICE: 'r_medical',
  OFFENSIVE_CONTENT: 'r_offensive',
  FAKE_OR_MISLEADING: 'r_fake',
  SPAM: 'r_spam',
  OTHER: 'r_other',
}

/** Admin reports table with moderation actions. */
function AdminReports() {
  const { t } = useTranslation()
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [busy, setBusy] = useState(null)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      setReports(await getAdminReports())
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  async function setStatus(id, status) {
    setBusy(id)
    try {
      await updateReportStatus(id, status)
      await load()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(null)
    }
  }

  async function hideExperience(experienceId) {
    if (!experienceId) return
    setBusy(`exp-${experienceId}`)
    try {
      await updateExperienceStatus(experienceId, 'HIDDEN')
      await load()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(null)
    }
  }

  if (loading) return <div className="page"><LoadingState /></div>

  return (
    <div className="page">
      <header className="page-head">
        <h1 className="page-title">{t('adminReports.title')}</h1>
        <p className="page-sub">{t('adminReports.sub')}</p>
      </header>

      {error && <ErrorState message={error} onRetry={load} />}

      {reports.length === 0 ? (
        <p className="muted">{t('adminReports.none')}</p>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>{t('adminReports.colReason')}</th><th>{t('adminReports.colExplanation')}</th><th>{t('adminReports.colExperience')}</th><th>{t('adminReports.colReportedUser')}</th>
                <th>{t('adminReports.colReporter')}</th><th>{t('adminReports.colStatus')}</th><th>{t('adminReports.colCreated')}</th><th>{t('adminReports.colActions')}</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((r) => (
                <tr key={r.id}>
                  <td>{REASON_KEYS[r.reason] ? t(`adminReports.${REASON_KEYS[r.reason]}`) : r.reason}</td>
                  <td className="cell-wrap">{r.explanation || '—'}</td>
                  <td>{r.experienceId ? `#${r.experienceId}` : '—'}</td>
                  <td>{r.reportedUserDisplayName || '—'}</td>
                  <td>{r.reporterDisplayName || '—'}</td>
                  <td><span className={`status status--${r.status}`}>{t(`statuses.${r.status}`)}</span></td>
                  <td>{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : '—'}</td>
                  <td className="actions-cell">
                    <button className="btn btn-xs btn-secondary" disabled={busy === r.id} onClick={() => setStatus(r.id, 'REVIEWED')}>{t('adminReports.reviewed')}</button>
                    <button className="btn btn-xs btn-ghost" disabled={busy === r.id} onClick={() => setStatus(r.id, 'DISMISSED')}>{t('adminReports.dismiss')}</button>
                    <button className="btn btn-xs btn-primary" disabled={busy === r.id} onClick={() => setStatus(r.id, 'ACTION_TAKEN')}>{t('adminReports.action')}</button>
                    {r.experienceId && (
                      <button className="btn btn-xs btn-danger" disabled={busy === `exp-${r.experienceId}`} onClick={() => hideExperience(r.experienceId)}>{t('adminReports.hideExp')}</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default AdminReports
