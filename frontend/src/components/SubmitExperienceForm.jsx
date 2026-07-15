import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { createExperience, updateExperience } from '../api/api'
import { CATEGORIES, CITIES, INSTITUTION_TYPES } from '../utils/constants'
import ImageBlurTool from './ImageBlurTool'

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
  symptoms: [],
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
    symptoms: Array.isArray(experience.symptoms) ? experience.symptoms : [],
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
  const [showBlurTool, setShowBlurTool] = useState(false)
  const [rawImageFile, setRawImageFile] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [symptomInput, setSymptomInput] = useState('')
  const [symptomError, setSymptomError] = useState(null)
  const navigate = useNavigate()
  const translatedSuggestions = t('submit.symptomSuggestions', { returnObjects: true })
  const symptomSuggestions = Array.isArray(translatedSuggestions) ? translatedSuggestions : []

  function set(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function symptomValidationMessage(value, selected = form.symptoms) {
    const trimmed = value.trim()
    if (trimmed.length < 2) return t('submit.symptomTooShort')
    if (trimmed.length > 80) return t('submit.symptomTooLong')
    if (selected.some((symptom) => symptom.toLocaleLowerCase() === trimmed.toLocaleLowerCase())) {
      return t('submit.symptomDuplicate')
    }
    if (selected.length >= 10) return t('submit.symptomLimit')
    return null
  }

  function addSymptom(value = symptomInput) {
    const trimmed = value.trim()
    const validationMessage = symptomValidationMessage(trimmed)
    if (validationMessage) {
      setSymptomError(validationMessage)
      return false
    }
    set('symptoms', [...form.symptoms, trimmed])
    setSymptomInput('')
    setSymptomError(null)
    return true
  }

  function removeSymptom(value) {
    set('symptoms', form.symptoms.filter((symptom) => symptom !== value))
    setSymptomError(null)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)

    if (!form.category || !form.institutionType || !form.city || !form.stepsTaken.trim()) {
      setError(t('submit.requiredError'))
      return
    }

    let symptoms = form.symptoms
    if (symptomInput.trim()) {
      const validationMessage = symptomValidationMessage(symptomInput, symptoms)
      if (validationMessage) {
        setSymptomError(validationMessage)
        return
      }
      symptoms = [...symptoms, symptomInput.trim()]
      set('symptoms', symptoms)
      setSymptomInput('')
    }

    const payload = {
      category: form.category,
      institutionType: form.institutionType,
      city: form.city,
      stepsTaken: form.stepsTaken,
      symptoms,
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

      // 1) Create the experience (with optional document).
      const created = await createExperience(payload, documentFile)

      // Note: we no longer call createVerificationRequest here because the user
      // wanted the document to be public, and verification hides the post (UNDER_REVIEW).
      // The document is already uploaded as part of createExperience.

      // Reset form so the user cannot accidentally re-submit.
      setForm(emptyState)
      setDocumentFile(null)

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

      <fieldset className="symptoms-section">
        <legend className="symptoms-title">{t('submit.symptoms')}</legend>
        <p className="symptoms-helper">{t('submit.symptomsHelper')}</p>
        <p className="form-hint">{t('submit.symptomsPrivacy')}</p>

        <div className="symptom-suggestions" aria-label={t('submit.symptomSuggestionsLabel')}>
          {symptomSuggestions.map((suggestion) => {
            const selected = form.symptoms.some((symptom) => symptom.toLocaleLowerCase() === suggestion.toLocaleLowerCase())
            return (
              <button key={suggestion} type="button" className={`symptom-suggestion ${selected ? 'is-selected' : ''}`}
                onClick={() => addSymptom(suggestion)} disabled={selected || (form.symptoms.length >= 10 && !selected)}>
                {suggestion}
              </button>
            )
          })}
        </div>

        <div className="symptom-input-row">
          <label className="form-label" htmlFor="s-symptom">{t('submit.customSymptom')}</label>
          <div className="symptom-input-controls">
            <input id="s-symptom" type="text" className="form-input" value={symptomInput} maxLength={80}
              onChange={(event) => { setSymptomInput(event.target.value); setSymptomError(null) }}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault()
                  addSymptom()
                }
              }}
              placeholder={t('submit.customSymptomPlaceholder')} aria-invalid={Boolean(symptomError)}
              aria-describedby="symptom-error symptom-count" />
            <button type="button" className="btn btn-secondary" onClick={() => addSymptom()} disabled={!symptomInput.trim()}>
              {t('submit.addSymptom')}
            </button>
          </div>
        </div>

        {form.symptoms.length > 0 && (
          <div className="symptom-chips" aria-label={t('submit.selectedSymptoms')}>
            {form.symptoms.map((symptom) => (
              <span className="symptom-chip" key={symptom}>
                {symptom}
                <button type="button" onClick={() => removeSymptom(symptom)} aria-label={t('submit.removeSymptom', { symptom })}>×</button>
              </span>
            ))}
          </div>
        )}
        <div className="field-meta">
          <span id="symptom-error" className="field-error" aria-live="polite">{symptomError || ''}</span>
          <span id="symptom-count" className="char-counter">{form.symptoms.length}/10</span>
        </div>
      </fieldset>

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
                onChange={(e) => {
                  const file = e.target.files?.[0] || null
                  if (file && file.type.startsWith('image/')) {
                    // Image selected → open blur tool before accepting
                    setRawImageFile(file)
                    setShowBlurTool(true)
                  } else {
                    // PDF or other → accept directly
                    setDocumentFile(file)
                  }
                }}
              />
              {documentFile && (
                <p className="form-hint">
                  {t('submit.fileSelected')} <strong>{documentFile.name}</strong>{' '}
                  <button type="button" className="link link-danger" onClick={() => { setDocumentFile(null); setRawImageFile(null); }}>
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

      {showBlurTool && rawImageFile && (
        <ImageBlurTool
          file={rawImageFile}
          onConfirm={(blob, filename) => {
            // Create a File from the blob so FormData sends the correct filename.
            const processed = new File([blob], filename, { type: blob.type })
            setDocumentFile(processed)
            setShowBlurTool(false)
          }}
          onCancel={() => {
            setShowBlurTool(false)
            setRawImageFile(null)
          }}
        />
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
