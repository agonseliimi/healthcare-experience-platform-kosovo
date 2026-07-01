import { useState } from 'react'
import { createVerificationRequest } from '../api/api'

// The redaction checklist the user must confirm before requesting verification.
const CHECKLIST = [
  'I removed my name',
  'I removed personal ID number',
  'I removed phone number',
  'I removed address',
  'I removed doctor/patient identifiers',
  'I understand documents are for verification only',
]

/**
 * Optional, privacy-first verification request box.
 *
 * PRIVACY: No real file is uploaded in this MVP. Only a file name reference and
 * a note are stored, and documents are never shown publicly.
 *
 * FUTURE:
 *   - browser-based redaction before upload
 *   - secure encrypted file storage
 *   - admin-only file viewer
 *   - automatic document deletion
 *   - privacy audit logs
 *
 * Props:
 *   experienceId - the experience to verify
 */
function VerificationBox({ experienceId }) {
  const [documentNote, setDocumentNote] = useState('')
  const [fileName, setFileName] = useState('')
  const [checked, setChecked] = useState(() => CHECKLIST.map(() => false))
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState(null)

  const allConfirmed = checked.every(Boolean)

  function toggle(index) {
    setChecked((prev) => prev.map((v, i) => (i === index ? !v : v)))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    if (!allConfirmed) {
      setError('Please confirm all redaction items before requesting verification.')
      return
    }
    setSubmitting(true)
    try {
      await createVerificationRequest({
        experienceId,
        documentNote,
        fileName: fileName || null,
        redactionConfirmed: true,
      })
      setDone(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (done) {
    return (
      <div className="verify-box">
        <div className="alert alert-success">
          Verification requested. An administrator will review it. Your document is never shown publicly.
        </div>
      </div>
    )
  }

  return (
    <div className="verify-box">
      <h3 className="verify-title">Request verification (optional)</h3>
      <p className="verify-text">
        Verification is optional. Documents you reference are <strong>never shown publicly</strong> and are
        used only to raise the confidence level of your experience.
      </p>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label className="form-label" htmlFor="doc-note">Document note</label>
          <textarea
            id="doc-note"
            className="form-textarea"
            rows={2}
            value={documentNote}
            onChange={(e) => setDocumentNote(e.target.value)}
            placeholder="e.g. Lab result supports the approximate cost and waiting time."
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="file-name">
            Document reference name <span className="form-optional">(demo only, no real upload)</span>
          </label>
          <input
            id="file-name"
            type="text"
            className="form-input"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            placeholder="redacted-demo-file.pdf"
          />
        </div>

        <fieldset className="checklist">
          <legend className="form-label">Redaction checklist</legend>
          {CHECKLIST.map((item, i) => (
            <label key={item} className="checklist-item">
              <input type="checkbox" checked={checked[i]} onChange={() => toggle(i)} />
              <span>{item}</span>
            </label>
          ))}
        </fieldset>

        <button type="submit" className="btn btn-primary" disabled={submitting || !allConfirmed}>
          {submitting ? 'Submitting...' : 'Request Verification'}
        </button>
      </form>
    </div>
  )
}

export default VerificationBox
