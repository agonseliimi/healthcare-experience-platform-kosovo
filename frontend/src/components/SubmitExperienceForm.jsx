import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createExperience, createVerificationRequest } from '../api/api'
import { CATEGORIES, CITIES, INSTITUTION_TYPES } from '../utils/constants'

/**
 * Form to submit an anonymous experience to the backend.
 *
 * The backend also runs a privacy sanitization check and will reject
 * submissions that appear to contain personal identifiers.
 */
const initialState = {
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

function SubmitExperienceForm() {
  const [form, setForm] = useState(initialState)
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
      setError('Please fill in category, institution type, city, and steps taken.')
      return
    }

    setSubmitting(true)
    try {
      // 1) Create the experience.
      const created = await createExperience({
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
      })

      // 2) Optionally request verification for it right away.
      if (form.requestVerification) {
        // NOTE: redactionConfirmed is required by the backend; the user agrees by
        // ticking the optional verification box, which shows the privacy note.
        await createVerificationRequest({
          experienceId: created.id,
          documentNote: form.documentNote,
          fileName: null,
          redactionConfirmed: true,
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
        <strong>Privacy warning:</strong> Do not upload or share personal identifiers, personal ID
        numbers, phone numbers, addresses, exact names, doctor names, or sensitive private details.
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="form-group">
        <label className="form-label" htmlFor="s-cat">Health concern / category *</label>
        <select id="s-cat" className="form-select" value={form.category} onChange={(e) => set('category', e.target.value)}>
          <option value="">Select a category...</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="form-group">
        <span className="form-label">Institution type *</span>
        <div className="radio-row">
          {INSTITUTION_TYPES.map((t) => (
            <label className="radio" key={t.value}>
              <input type="radio" name="s-inst" checked={form.institutionType === t.value} onChange={() => set('institutionType', t.value)} /> {t.label}
            </label>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="s-city">City *</label>
        <select id="s-city" className="form-select" value={form.city} onChange={(e) => set('city', e.target.value)}>
          <option value="">Select a city...</option>
          {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="s-steps">Steps taken *</label>
        <textarea id="s-steps" className="form-textarea" rows={4} value={form.stepsTaken}
          onChange={(e) => set('stepsTaken', e.target.value)}
          placeholder="e.g. GP visit → referral → tests → specialist appointment" />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="s-tests">Tests performed</label>
        <input id="s-tests" type="text" className="form-input" value={form.testsPerformed}
          onChange={(e) => set('testsPerformed', e.target.value)} placeholder="e.g. Blood test, X-ray, MRI" />
      </div>

      <div className="form-row-3">
        <div className="form-group">
          <label className="form-label" htmlFor="s-cost">Approximate cost (€)</label>
          <input id="s-cost" type="number" min="0" className="form-input" value={form.approximateCost}
            onChange={(e) => set('approximateCost', e.target.value)} placeholder="0" />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="s-wait">Waiting time</label>
          <input id="s-wait" type="text" className="form-input" value={form.waitingTime}
            onChange={(e) => set('waitingTime', e.target.value)} placeholder="e.g. 2 weeks" />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="s-result">Result time</label>
          <input id="s-result" type="text" className="form-input" value={form.resultTime}
            onChange={(e) => set('resultTime', e.target.value)} placeholder="e.g. 3 days" />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="s-summary">Experience summary</label>
        <textarea id="s-summary" className="form-textarea" rows={3} value={form.summary}
          onChange={(e) => set('summary', e.target.value)} placeholder="A short general summary of your journey" />
      </div>

      <label className="checkbox-row">
        <input type="checkbox" checked={form.isAnonymous} onChange={(e) => set('isAnonymous', e.target.checked)} />
        <span>Submit anonymously (your identity is never shown on the experience)</span>
      </label>

      <label className="checkbox-row">
        <input type="checkbox" checked={form.requestVerification} onChange={(e) => set('requestVerification', e.target.checked)} />
        <span>Request optional verification (documents are never shown publicly)</span>
      </label>

      {form.requestVerification && (
        <div className="form-group">
          <label className="form-label" htmlFor="s-docnote">Document verification note</label>
          <textarea id="s-docnote" className="form-textarea" rows={2} value={form.documentNote}
            onChange={(e) => set('documentNote', e.target.value)}
            placeholder="Describe (without identifiers) what evidence supports this experience." />
          <p className="form-hint">
            By requesting verification you confirm you removed all personal identifiers.
          </p>
        </div>
      )}

      <button type="submit" className="btn btn-primary btn-lg" disabled={submitting}>
        {submitting ? 'Submitting...' : 'Submit Experience'}
      </button>
    </form>
  )
}

export default SubmitExperienceForm
