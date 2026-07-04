import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getAdminVerificationRequests, updateVerificationStatus, fetchVerificationDocument } from '../api/api'
import LoadingState from '../components/LoadingState'
import ErrorState from '../components/ErrorState'

/** Admin verification review. Approving raises the experience verification level. */
function AdminVerification() {
  const { t } = useTranslation()
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

  // Open the private document in a new tab (admin-only, authenticated fetch).
  async function openDocument(id) {
    setError(null)
    try {
      const url = await fetchVerificationDocument(id)
      window.open(url, '_blank', 'noopener,noreferrer')
      // Revoke later so the new tab has time to load it.
      setTimeout(() => URL.revokeObjectURL(url), 60000)
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) return <div className="page"><LoadingState /></div>

  return (
    <div className="page">
      <header className="page-head">
        <h1 className="page-title">{t('adminVerify.title')}</h1>
        <p className="page-sub">{t('adminVerify.sub')}</p>
      </header>

      {error && <ErrorState message={error} onRetry={load} />}

      {requests.length === 0 ? (
        <p className="muted">{t('adminVerify.none')}</p>
      ) : (
        <div className="verif-list">
          {requests.map((v) => (
            <div key={v.id} className="card verif-item">
              <div className="verif-head">
                <div>
                  <strong>{v.experienceCategory ? t(`categories.${v.experienceCategory}`) : `${t('adminVerify.experience')} #${v.experienceId}`}</strong>
                  <span className="muted"> · {t('adminVerify.by')} {v.userDisplayName}</span>
                </div>
                <span className={`status status--${v.status}`}>{t(`statuses.${v.status}`)}</span>
              </div>

              <div className="verif-body">
                <p><span className="k">{t('adminVerify.documentNote')}</span> {v.documentNote || '—'}</p>
                <p>
                  <span className="k">{t('adminVerify.document')}</span>{' '}
                  {v.hasDocument ? (
                    <button type="button" className="link" onClick={() => openDocument(v.id)}>
                      {v.fileName || t('adminVerify.download')}
                    </button>
                  ) : (
                    <span className="muted">{t('adminVerify.noDocument')}</span>
                  )}{' '}
                  <span className="muted">{t('adminVerify.neverPublic')}</span>
                </p>
                <p><span className="k">{t('adminVerify.redactionConfirmed')}</span> {v.redactionConfirmed ? t('adminVerify.yes') : t('adminVerify.no')}</p>
                {v.adminNote && <p><span className="k">{t('adminVerify.adminNote')}</span> {v.adminNote}</p>}
              </div>

              {v.status === 'PENDING' && (
                <div className="verif-controls">
                  <select className="form-select" value={levels[v.id] || 'DOCUMENT_SUPPORTED'}
                    onChange={(e) => setLevels((p) => ({ ...p, [v.id]: e.target.value }))}>
                    <option value="DOCUMENT_SUPPORTED">{t('adminVerify.docSupported')}</option>
                    <option value="HIGH_CONFIDENCE">{t('adminVerify.highConfidence')}</option>
                  </select>
                  <input type="text" className="form-input" placeholder={t('adminVerify.adminNotePlaceholder')}
                    value={notes[v.id] || ''} onChange={(e) => setNotes((p) => ({ ...p, [v.id]: e.target.value }))} />
                  <button className="btn btn-primary btn-sm" disabled={busy === v.id} onClick={() => decide(v.id, 'APPROVED')}>{t('adminVerify.approve')}</button>
                  <button className="btn btn-ghost btn-sm" disabled={busy === v.id} onClick={() => decide(v.id, 'REJECTED')}>{t('adminVerify.reject')}</button>
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
