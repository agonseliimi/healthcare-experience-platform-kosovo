import { useState } from 'react'
import { createReport } from '../api/api'

const REASONS = [
  { value: 'PERSONAL_INFO_EXPOSED', label: 'Personal information exposed' },
  { value: 'MEDICAL_ADVICE', label: 'Medical advice or diagnosis claim' },
  { value: 'OFFENSIVE_CONTENT', label: 'Offensive content' },
  { value: 'FAKE_OR_MISLEADING', label: 'Fake or misleading experience' },
  { value: 'SPAM', label: 'Spam' },
  { value: 'OTHER', label: 'Other' },
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
        <h2 id="report-title" className="modal-title">Report this experience</h2>
        <p className="modal-text">
          Reports are reviewed by moderators. Use this to flag privacy issues, medical-advice claims,
          or misleading content.
        </p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label className="form-label" htmlFor="report-reason">Reason</label>
            <select
              id="report-reason"
              className="form-select"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            >
              {REASONS.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="report-explanation">
              Explanation <span className="form-optional">(optional)</span>
            </label>
            <textarea
              id="report-explanation"
              className="form-textarea"
              rows={3}
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              placeholder="Add any details that help moderators..."
            />
          </div>

          <div className="modal-actions">
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Report'}
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => onClose(false)}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ReportModal
