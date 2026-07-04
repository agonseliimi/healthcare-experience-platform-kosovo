import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { createVerificationRequest } from '../api/api'

// Keys of the redaction checklist the user must confirm before requesting verification.
const CHECKLIST_KEYS = ['check1', 'check2', 'check3', 'check4', 'check5', 'check6']

/**
 * Optional, privacy-first verification request box.
 *
 * PRIVACY: An uploaded document is stored privately on the server and is NEVER
 * shown publicly. Only administrators can download it for review.
 *
 * FUTURE:
 *   - browser-based redaction before upload
 *   - encrypted file storage
 *   - automatic document deletion
 *   - privacy audit logs
 *
 * Props:
 *   experienceId - the experience to verify
 */
function VerificationBox({ experienceId }) {
  const { t } = useTranslation()
  const [documentNote, setDocumentNote] = useState('')
  const [file, setFile] = useState(null)
  const [checked, setChecked] = useState(() => CHECKLIST_KEYS.map(() => false))
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
      setError(t('verify.confirmError'))
      return
    }
    setSubmitting(true)
    try {
      await createVerificationRequest({
        experienceId,
        documentNote,
        redactionConfirmed: true,
        file,
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
        <div className="alert alert-success">{t('verify.successTitle')}</div>
      </div>
    )
  }

  return (
    <div className="verify-box">
      <h3 className="verify-title">{t('verify.title')}</h3>
      <p className="verify-text">{t('verify.intro')}</p>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label className="form-label" htmlFor="doc-note">{t('verify.documentNote')}</label>
          <textarea
            id="doc-note"
            className="form-textarea"
            rows={2}
            value={documentNote}
            onChange={(e) => setDocumentNote(e.target.value)}
            placeholder={t('verify.documentNotePlaceholder')}
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="verify-file">{t('verify.uploadLabel')}</label>
          <input
            id="verify-file"
            type="file"
            className="form-input"
            accept="application/pdf,image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          {file && (
            <p className="form-hint">
              {t('verify.fileSelected')} <strong>{file.name}</strong>{' '}
              <button type="button" className="link link-danger" onClick={() => setFile(null)}>
                {t('verify.removeFile')}
              </button>
            </p>
          )}
          <p className="form-hint">{t('verify.uploadHint')}</p>
        </div>

        <fieldset className="checklist">
          <legend className="form-label">{t('verify.checklistTitle')}</legend>
          {CHECKLIST_KEYS.map((key, i) => (
            <label key={key} className="checklist-item">
              <input type="checkbox" checked={checked[i]} onChange={() => toggle(i)} />
              <span>{t(`verify.${key}`)}</span>
            </label>
          ))}
        </fieldset>

        <button type="submit" className="btn btn-primary" disabled={submitting || !allConfirmed}>
          {submitting ? t('verify.submitting') : t('verify.submitBtn')}
        </button>
      </form>
    </div>
  )
}

export default VerificationBox
