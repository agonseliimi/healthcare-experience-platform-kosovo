import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { createExperience, updateExperience, createVerificationRequest } from '../api/api'
import { CATEGORIES, CITIES, INSTITUTION_TYPES } from '../utils/constants'

/**
 * Form to submit or edit an anonymous experience.
 *
 * Props:
 *   experience - when provided (with an id), the form runs in EDIT mode:
 *                it prefills from this object and PUTs to /experiences/{id}
 *                instead of creating a new one. The optional verification
 *                request (with optional document upload) is only offered when
 *                creating.
 *
 * The backend also runs a privacy sanitization check and will reject
 * submissions that appear to contain personal identifiers.
 */
const emptyState = {
  category: '',
  institutionType: '',
  city: '',
  stepsTaken: '',
  testsPerformed: '',
  approximateCost: '',
  waitingTime: '',
  resultTime: '',
  summary: '',
  isAnonymous: true,
  requestVerification: false,
  documentNote: '',
}

/** Build initial form state from an existing experience (edit mode) or blanks (create). */
function toFormState(experience) {
  if (!experience) return emptyState
  return {
    ...emptyState,
    category: experience.category ?? '',
    institutionType: experience.institutionType ?? '',
    city: experience.city ?? '',
    stepsTaken: experience.stepsTaken ?? '',
    testsPerformed: experience.testsPerformed ?? '',
    approximateCost: experience.approximateCost == null ? '' : String(experience.approximateCost),
    waitingTime: experience.waitingTime ?? '',
    resultTime: experience.resultTime ?? '',
    summary: experience.summary ?? '',
    isAnonymous: experience.isAnonymous ?? true,
  }
}

function SubmitExperienceForm({ experience }) {
  const { t } = useTranslation()
  const isEdit = Boolean(experience?.id)
  const [form, setForm] = useState(() => toFormState(experience))
  const [documentFile, setDocumentFile] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  function set(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)

    if (!form.category || !form.institutionType || !form.city || !form.stepsTaken.trim()) {
      setError(t('submit.requiredError'))
      return
    }

    const payload = {
      category: form.category,
      institutionType: form.institutionType,
      city: form.city,
      stepsTaken: form.stepsTaken,
      testsPerformed: form.testsPerformed,
      approximateCost: form.approximateCost === '' ? null : Number(form.approximateCost),
      waitingTime: form.waitingTime,
      resultTime: form.resultTime,
      summary: form.summary,
      isAnonymous: form.isAnonymous,
    }

    setSubmitting(true)
    try {
      if (isEdit) {
        // Edit mode: update the existing experience and return to its detail page.
        await updateExperience(experience.id, payload)
        navigate(`/experiences/${experience.id}`)
        return
      }

      // 1) Create the experience.
      const created = await createExperience(payload)

      // 2) Optionally request verification for it right away (with optional document).
      if (form.requestVerification) {
        // NOTE: redactionConfirmed is required by the backend; the user agrees by
        // ticking the optional verification box, which shows the privacy note.
        await createVerificationRequest({
          experienceId: created.id,
          documentNote: form.documentNote,
          redactionConfirmed: true,
          file: documentFile,
        })
      }

      navigate(`/experiences/${created.id}`)
    } catch (err) {
      setError(err.message)
      setSubmitting(false)
    }
  }

  return (
    <form className="form card form-card" onSubmit={handleSubmit}>
      <div className="alert alert-warning">
        <strong>{t('submit.privacyWarning')}</strong> {t('submit.privacyWarningText')}
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="form-group">
        <label className="form-label" htmlFor="s-cat">{t('submit.category')}</label>
        <select id="s-cat" className="form-select" value={form.category} onChange={(e) => set('category', e.target.value)}>
          <option value="">{t('submit.selectCategory')}</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{t(`categories.${c}`)}</option>)}
        </select>
      </div>

      <div className="form-group">
        <span className="form-label">{t('submit.institutionType')}</span>
        <div className="radio-row">
          {INSTITUTION_TYPES.map((type) => (
            <label className="radio" key={type.value}>
              <input type="radio" name="s-inst" checked={form.institutionType === type.value} onChange={() => set('institutionType', type.value)} /> {t(`institutions.${type.value}`)}
            </label>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="s-city">{t('submit.city')}</label>
        <select id="s-city" className="form-select" value={form.city} onChange={(e) => set('city', e.target.value)}>
          <option value="">{t('submit.selectCity')}</option>
          {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="s-steps">{t('submit.stepsTaken')}</label>
        <textarea id="s-steps" className="form-textarea" rows={4} value={form.stepsTaken}
          onChange={(e) => set('stepsTaken', e.target.value)}
          placeholder={t('submit.stepsPlaceholder')} />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="s-tests">{t('submit.testsPerformed')}</label>
        <input id="s-tests" type="text" className="form-input" value={form.testsPerformed}
          onChange={(e) => set('testsPerformed', e.target.value)} placeholder={t('submit.testsPlaceholder')} />
      </div>

      <div className="form-row-3">
        <div className="form-group">
          <label className="form-label" htmlFor="s-cost">{t('submit.approxCost')}</label>
          <input id="s-cost" type="number" min="0" className="form-input" value={form.approximateCost}
            onChange={(e) => set('approximateCost', e.target.value)} placeholder="0" />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="s-wait">{t('submit.waitingTime')}</label>
          <input id="s-wait" type="text" className="form-input" value={form.waitingTime}
            onChange={(e) => set('waitingTime', e.target.value)} placeholder={t('submit.waitingPlaceholder')} />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="s-result">{t('submit.resultTime')}</label>
          <input id="s-result" type="text" className="form-input" value={form.resultTime}
            onChange={(e) => set('resultTime', e.target.value)} placeholder={t('submit.resultPlaceholder')} />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="s-summary">{t('submit.summary')}</label>
        <textarea id="s-summary" className="form-textarea" rows={3} value={form.summary}
          onChange={(e) => set('summary', e.target.value)} placeholder={t('submit.summaryPlaceholder')} />
      </div>

      <label className="checkbox-row">
        <input type="checkbox" checked={form.isAnonymous} onChange={(e) => set('isAnonymous', e.target.checked)} />
        <span>{t('submit.anonymous')}</span>
      </label>

      {!isEdit && (
        <>
          <label className="checkbox-row">
            <input type="checkbox" checked={form.requestVerification} onChange={(e) => set('requestVerification', e.target.checked)} />
            <span>{t('submit.requestVerification')}</span>
          </label>

          {form.requestVerification && (
            <div className="form-group">
              <label className="form-label" htmlFor="s-docnote">{t('submit.documentNote')}</label>
              <textarea id="s-docnote" className="form-textarea" rows={2} value={form.documentNote}
                onChange={(e) => set('documentNote', e.target.value)}
                placeholder={t('submit.documentNotePlaceholder')} />

              <label className="form-label upload-label" htmlFor="s-docfile">{t('submit.uploadLabel')}</label>
              <input
                id="s-docfile"
                type="file"
                className="form-input"
                accept="application/pdf,image/*"
                onChange={(e) => setDocumentFile(e.target.files?.[0] || null)}
              />
              {documentFile && (
                <p className="form-hint">
                  {t('submit.fileSelected')} <strong>{documentFile.name}</strong>{' '}
                  <button type="button" className="link link-danger" onClick={() => setDocumentFile(null)}>
                    {t('submit.removeFile')}
                  </button>
                </p>
              )}
              <p className="form-hint">{t('submit.uploadHint')}</p>
              <p className="form-hint">{t('submit.documentHint')}</p>
            </div>
          )}
        </>
      )}

      <div className="form-actions">
        <button type="submit" className="btn btn-primary btn-lg" disabled={submitting}>
          {submitting
            ? (isEdit ? t('submit.saving') : t('submit.submitting'))
            : (isEdit ? t('submit.saveBtn') : t('submit.submitBtn'))}
        </button>
        {isEdit && (
          <button type="button" className="btn btn-secondary btn-lg" disabled={submitting}
            onClick={() => navigate(`/experiences/${experience.id}`)}>
            {t('submit.cancel')}
          </button>
        )}
      </div>
    </form>
  )
}

export default SubmitExperienceForm
