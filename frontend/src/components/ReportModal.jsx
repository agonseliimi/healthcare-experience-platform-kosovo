import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { createReport } from '../api/api'

// Report reasons; labels are translated at render time via the i18n key.
const REASONS = [
  { value: 'PERSONAL_INFO_EXPOSED', key: 'r_personal' },
  { value: 'MEDICAL_ADVICE', key: 'r_medical' },
  { value: 'OFFENSIVE_CONTENT', key: 'r_offensive' },
  { value: 'FAKE_OR_MISLEADING', key: 'r_fake' },
  { value: 'SPAM', key: 'r_spam' },
  { value: 'OTHER', key: 'r_other' },
]

/**
 * Modal for reporting an experience (and its author).
 *
 * Props:
 *   experienceId    - the experience being reported
 *   reportedUserId  - optional author id
 *   onClose(success)- called when the modal closes; success=true after submit
 */
function ReportModal({ experienceId, reportedUserId, onClose }) {
  const { t } = useTranslation()
  const [reason, setReason] = useState('PERSONAL_INFO_EXPOSED')
  const [explanation, setExplanation] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      // FUTURE: backend could rate-limit reports per user to prevent abuse.
      await createReport({ experienceId, reportedUserId, reason, explanation })
      onClose(true)
    } catch (err) {
      setError(err.message)
      setSubmitting(false)
    }
  }

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="report-title">
      <div className="modal">
        <h2 id="report-title" className="modal-title">{t('report.title')}</h2>
        <p className="modal-text">{t('report.text')}</p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label className="form-label" htmlFor="report-reason">{t('report.reason')}</label>
            <select
              id="report-reason"
              className="form-select"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            >
              {REASONS.map((r) => (
                <option key={r.value} value={r.value}>{t(`report.${r.key}`)}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="report-explanation">
              {t('report.explanation')} <span className="form-optional">{t('report.optional')}</span>
            </label>
            <textarea
              id="report-explanation"
              className="form-textarea"
              rows={3}
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              placeholder={t('report.explanationPlaceholder')}
            />
          </div>

          <div className="modal-actions">
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? t('report.submitting') : t('report.submit')}
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => onClose(false)}>
              {t('report.cancel')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ReportModal
