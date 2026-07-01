import { useEffect, useState } from 'react'
import { getAdminReports, updateReportStatus, updateExperienceStatus } from '../api/api'
import LoadingState from '../components/LoadingState'
import ErrorState from '../components/ErrorState'

const REASON_LABELS = {
  PERSONAL_INFO_EXPOSED: 'Personal info exposed',
  MEDICAL_ADVICE: 'Medical advice claim',
  OFFENSIVE_CONTENT: 'Offensive content',
  FAKE_OR_MISLEADING: 'Fake / misleading',
  SPAM: 'Spam',
  OTHER: 'Other',
}

/** Admin reports table with moderation actions. */
function AdminReports() {
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
        <h1 className="page-title">Reports</h1>
        <p className="page-sub">Review reported experiences and take moderation actions.</p>
      </header>

      {error && <ErrorState message={error} onRetry={load} />}

      {reports.length === 0 ? (
        <p className="muted">No reports.</p>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Reason</th><th>Explanation</th><th>Experience</th><th>Reported user</th>
                <th>Reporter</th><th>Status</th><th>Created</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((r) => (
                <tr key={r.id}>
                  <td>{REASON_LABELS[r.reason] || r.reason}</td>
                  <td className="cell-wrap">{r.explanation || '—'}</td>
                  <td>{r.experienceId ? `#${r.experienceId}` : '—'}</td>
                  <td>{r.reportedUserDisplayName || '—'}</td>
                  <td>{r.reporterDisplayName || '—'}</td>
                  <td><span className={`status status--${r.status}`}>{r.status}</span></td>
                  <td>{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : '—'}</td>
                  <td className="actions-cell">
                    <button className="btn btn-xs btn-secondary" disabled={busy === r.id} onClick={() => setStatus(r.id, 'REVIEWED')}>Reviewed</button>
                    <button className="btn btn-xs btn-ghost" disabled={busy === r.id} onClick={() => setStatus(r.id, 'DISMISSED')}>Dismiss</button>
                    <button className="btn btn-xs btn-primary" disabled={busy === r.id} onClick={() => setStatus(r.id, 'ACTION_TAKEN')}>Action</button>
                    {r.experienceId && (
                      <button className="btn btn-xs btn-danger" disabled={busy === `exp-${r.experienceId}`} onClick={() => hideExperience(r.experienceId)}>Hide exp.</button>
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
