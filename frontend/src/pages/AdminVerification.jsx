import { useEffect, useState } from 'react'
import { getAdminVerificationRequests, updateVerificationStatus } from '../api/api'
import LoadingState from '../components/LoadingState'
import ErrorState from '../components/ErrorState'

/** Admin verification review. Approving raises the experience verification level. */
function AdminVerification() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [notes, setNotes] = useState({})
  const [levels, setLevels] = useState({})
  const [busy, setBusy] = useState(null)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      setRequests(await getAdminVerificationRequests())
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  async function decide(id, status) {
    setBusy(id)
    setError(null)
    try {
      await updateVerificationStatus(id, {
        status,
        adminNote: notes[id] || '',
        newVerificationLevel: status === 'APPROVED' ? (levels[id] || 'DOCUMENT_SUPPORTED') : null,
      })
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
        <h1 className="page-title">Verification Requests</h1>
        <p className="page-sub">
          Documents are never shown publicly. Approving raises the experience's verification level.
        </p>
      </header>

      {error && <ErrorState message={error} onRetry={load} />}

      {requests.length === 0 ? (
        <p className="muted">No verification requests.</p>
      ) : (
        <div className="verif-list">
          {requests.map((v) => (
            <div key={v.id} className="card verif-item">
              <div className="verif-head">
                <div>
                  <strong>{v.experienceCategory || `Experience #${v.experienceId}`}</strong>
                  <span className="muted"> · by {v.userDisplayName}</span>
                </div>
                <span className={`status status--${v.status}`}>{v.status}</span>
              </div>

              <div className="verif-body">
                <p><span className="k">Document note:</span> {v.documentNote || '—'}</p>
                <p><span className="k">File reference:</span> {v.fileName || '—'} <span className="muted">(never shown publicly)</span></p>
                <p><span className="k">Redaction confirmed:</span> {v.redactionConfirmed ? 'Yes' : 'No'}</p>
                {v.adminNote && <p><span className="k">Admin note:</span> {v.adminNote}</p>}
              </div>

              {v.status === 'PENDING' && (
                <div className="verif-controls">
                  <select className="form-select" value={levels[v.id] || 'DOCUMENT_SUPPORTED'}
                    onChange={(e) => setLevels((p) => ({ ...p, [v.id]: e.target.value }))}>
                    <option value="DOCUMENT_SUPPORTED">Document-Supported</option>
                    <option value="HIGH_CONFIDENCE">High-Confidence</option>
                  </select>
                  <input type="text" className="form-input" placeholder="Admin note (optional)"
                    value={notes[v.id] || ''} onChange={(e) => setNotes((p) => ({ ...p, [v.id]: e.target.value }))} />
                  <button className="btn btn-primary btn-sm" disabled={busy === v.id} onClick={() => decide(v.id, 'APPROVED')}>Approve</button>
                  <button className="btn btn-ghost btn-sm" disabled={busy === v.id} onClick={() => decide(v.id, 'REJECTED')}>Reject</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AdminVerification
