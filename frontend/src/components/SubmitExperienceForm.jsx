import { useState } from 'react'
import { medicalCategories, kosovoCities } from '../data/mockExperiences'
import '../styles/SubmitExperienceForm.css'

/**
 * SubmitExperienceForm component — form for anonymous experience submission.
 *
 * Collects general healthcare journey information.
 * Personal identifiers are explicitly excluded from every field.
 *
 * On submit, logs the data to the console for now (MVP prototype).
 *
 * FUTURE: Replace the console.log with a real POST request:
 *   POST /api/experiences
 *   Body: { category, institutionType, city, steps, tests,
 *           approximateCost, waitingTime, resultTime, isAnonymous, hasDocument }
 *
 * FUTURE: Add authentication so users can optionally track their own submissions.
 * FUTURE: Add secure document upload (file never shown publicly, only metadata used).
 * FUTURE: ML-based cost/time estimation shown as a hint while the user types.
 */

const initialFormState = {
  category: '',
  institutionType: '',
  city: '',
  steps: '',
  testsPerformed: '',
  approximateCost: '',
  waitingTime: '',
  resultTime: '',
  isAnonymous: true,
  hasDocument: false,
  privacyAcknowledged: false,
}

function SubmitExperienceForm() {
  const [form, setForm] = useState(initialFormState)
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState({})

  // Update a single form field
  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    // Clear validation error for that field on change
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  // Simple client-side validation
  const validate = () => {
    const newErrors = {}
    if (!form.category) newErrors.category = 'Please select a category.'
    if (!form.institutionType) newErrors.institutionType = 'Please select an institution type.'
    if (!form.city) newErrors.city = 'Please select a city.'
    if (!form.steps.trim()) newErrors.steps = 'Please describe the steps you went through.'
    if (!form.privacyAcknowledged) {
      newErrors.privacyAcknowledged = 'You must acknowledge the privacy notice before submitting.'
    }
    return newErrors
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const validationErrors = validate()

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    // FUTURE: Replace this block with a real API call:
    // const response = await fetch('/api/experiences', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(form),
    // })
    console.log('[MVP] Form submitted (mock — no backend connected):', form)

    setSubmitted(true)
    setForm(initialFormState)
    setErrors({})
  }

  // Show success state after submission
  if (submitted) {
    return (
      <div className="submit-success" role="status" aria-live="polite">
        <div className="submit-success-icon" aria-hidden="true">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="#10B981" strokeWidth="2" />
            <path d="M8 12l3 3 5-5" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h3 className="submit-success-title">Experience Submitted</h3>
        <p className="submit-success-text">
          Thank you for sharing your journey. Your experience has been received and will help others
          navigate the healthcare system. No personal information has been stored.
        </p>
        <button
          className="btn btn-primary"
          onClick={() => setSubmitted(false)}
        >
          Submit Another
        </button>
      </div>
    )
  }

  return (
    <form
      className="submit-form"
      onSubmit={handleSubmit}
      noValidate
      aria-label="Submit anonymous healthcare experience"
    >
      {/* Privacy warning — shown at the top of the form */}
      <div className="submit-privacy-warning" role="alert">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
        <div>
          <strong>Privacy Notice:</strong> Do not upload or share personal identifiers, personal ID
          numbers, phone numbers, addresses, full names, or any sensitive private details. Describe
          your experience in general terms only.
        </div>
      </div>

      {/* Section: About your experience */}
      <fieldset className="form-fieldset">
        <legend className="form-legend">About Your Experience</legend>

        {/* Category */}
        <div className="form-group">
          <label className="form-label" htmlFor="category">
            Health Concern / Category <span className="form-required" aria-hidden="true">*</span>
          </label>
          <select
            id="category"
            className={`form-select ${errors.category ? 'form-input--error' : ''}`}
            value={form.category}
            onChange={(e) => handleChange('category', e.target.value)}
            aria-required="true"
            aria-describedby={errors.category ? 'category-error' : undefined}
          >
            <option value="">Select a category...</option>
            {medicalCategories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          {errors.category && (
            <p id="category-error" className="form-error" role="alert">{errors.category}</p>
          )}
        </div>

        {/* Institution type */}
        <div className="form-group">
          <span className="form-label">
            Institution Type <span className="form-required" aria-hidden="true">*</span>
          </span>
          <div className="form-radio-group" role="radiogroup" aria-label="Institution type">
            {['public', 'private'].map((type) => (
              <label key={type} className="form-radio-label">
                <input
                  type="radio"
                  name="institutionType"
                  value={type}
                  checked={form.institutionType === type}
                  onChange={(e) => handleChange('institutionType', e.target.value)}
                  aria-required="true"
                />
                <span>{type === 'public' ? 'Public Hospital' : 'Private Clinic'}</span>
              </label>
            ))}
          </div>
          {errors.institutionType && (
            <p className="form-error" role="alert">{errors.institutionType}</p>
          )}
        </div>

        {/* City */}
        <div className="form-group">
          <label className="form-label" htmlFor="city">
            City <span className="form-required" aria-hidden="true">*</span>
          </label>
          <select
            id="city"
            className={`form-select ${errors.city ? 'form-input--error' : ''}`}
            value={form.city}
            onChange={(e) => handleChange('city', e.target.value)}
            aria-required="true"
          >
            <option value="">Select a city...</option>
            {kosovoCities.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
          {errors.city && (
            <p className="form-error" role="alert">{errors.city}</p>
          )}
        </div>
      </fieldset>

      {/* Section: Journey details */}
      <fieldset className="form-fieldset">
        <legend className="form-legend">Journey Details</legend>

        {/* Steps taken */}
        <div className="form-group">
          <label className="form-label" htmlFor="steps">
            Steps Taken <span className="form-required" aria-hidden="true">*</span>
          </label>
          <p className="form-hint">
            Describe what happened step by step. Example: "Visited GP → Got referral → Waited 3 weeks → Specialist appointment"
          </p>
          <textarea
            id="steps"
            className={`form-textarea ${errors.steps ? 'form-input--error' : ''}`}
            rows={5}
            value={form.steps}
            onChange={(e) => handleChange('steps', e.target.value)}
            placeholder="Describe the steps in your healthcare journey..."
            aria-required="true"
          />
          {errors.steps && (
            <p className="form-error" role="alert">{errors.steps}</p>
          )}
        </div>

        {/* Tests performed */}
        <div className="form-group">
          <label className="form-label" htmlFor="testsPerformed">
            Tests Performed <span className="form-optional">(optional)</span>
          </label>
          <input
            id="testsPerformed"
            type="text"
            className="form-input"
            value={form.testsPerformed}
            onChange={(e) => handleChange('testsPerformed', e.target.value)}
            placeholder="e.g. Blood test, X-ray, ECG..."
          />
        </div>
      </fieldset>

      {/* Section: Time and cost */}
      <fieldset className="form-fieldset">
        <legend className="form-legend">Time &amp; Cost (Approximate)</legend>

        <div className="form-row">
          {/* Approximate cost */}
          <div className="form-group">
            <label className="form-label" htmlFor="approximateCost">
              Approximate Cost <span className="form-optional">(optional)</span>
            </label>
            {/* FUTURE: ML model will suggest a cost range based on category + city */}
            <input
              id="approximateCost"
              type="text"
              className="form-input"
              value={form.approximateCost}
              onChange={(e) => handleChange('approximateCost', e.target.value)}
              placeholder="e.g. 0 EUR, 30–50 EUR"
            />
          </div>

          {/* Waiting time */}
          <div className="form-group">
            <label className="form-label" htmlFor="waitingTime">
              Waiting Time <span className="form-optional">(optional)</span>
            </label>
            {/* FUTURE: ML model will suggest average wait based on category + institution */}
            <input
              id="waitingTime"
              type="text"
              className="form-input"
              value={form.waitingTime}
              onChange={(e) => handleChange('waitingTime', e.target.value)}
              placeholder="e.g. 2 days, 3 weeks"
            />
          </div>

          {/* Result time */}
          <div className="form-group">
            <label className="form-label" htmlFor="resultTime">
              Result Time <span className="form-optional">(optional)</span>
            </label>
            <input
              id="resultTime"
              type="text"
              className="form-input"
              value={form.resultTime}
              onChange={(e) => handleChange('resultTime', e.target.value)}
              placeholder="e.g. Same day, 1 week"
            />
          </div>
        </div>
      </fieldset>

      {/* Section: Submission options */}
      <fieldset className="form-fieldset">
        <legend className="form-legend">Submission Options</legend>

        {/* Anonymous toggle */}
        <label className="form-checkbox-label">
          <input
            type="checkbox"
            checked={form.isAnonymous}
            onChange={(e) => handleChange('isAnonymous', e.target.checked)}
          />
          <div>
            <span className="form-checkbox-title">Submit Anonymously</span>
            <span className="form-checkbox-desc">
              Your identity will not be stored or associated with this submission.
              {/* FUTURE: Authenticated users can choose to link this to their account for follow-up. */}
            </span>
          </div>
        </label>

        {/* Document verification note */}
        <label className="form-checkbox-label">
          <input
            type="checkbox"
            checked={form.hasDocument}
            onChange={(e) => handleChange('hasDocument', e.target.checked)}
          />
          <div>
            <span className="form-checkbox-title">I Have a Supporting Document</span>
            <span className="form-checkbox-desc">
              E.g. a lab result, prescription, or appointment letter. This increases the
              verification level of your experience.{' '}
              {/* FUTURE: Secure document upload will be implemented here.
                  Documents will be stored encrypted and never shown publicly.
                  Only metadata (e.g. "document verified: yes") will be visible. */}
              <span className="form-future-note">[Document upload coming in a future version]</span>
            </span>
          </div>
        </label>

        {/* Privacy acknowledgement */}
        <label className={`form-checkbox-label ${errors.privacyAcknowledged ? 'form-checkbox-label--error' : ''}`}>
          <input
            type="checkbox"
            checked={form.privacyAcknowledged}
            onChange={(e) => handleChange('privacyAcknowledged', e.target.checked)}
            aria-required="true"
          />
          <div>
            <span className="form-checkbox-title">
              I Acknowledge the Privacy Notice <span className="form-required" aria-hidden="true">*</span>
            </span>
            <span className="form-checkbox-desc">
              I confirm I have not included any personal identifiers, ID numbers, phone numbers,
              addresses, or sensitive private information in my submission.
            </span>
          </div>
        </label>
        {errors.privacyAcknowledged && (
          <p className="form-error" role="alert">{errors.privacyAcknowledged}</p>
        )}
      </fieldset>

      <button type="submit" className="btn btn-primary submit-btn">
        Submit Experience Anonymously
      </button>
    </form>
  )
}

export default SubmitExperienceForm
