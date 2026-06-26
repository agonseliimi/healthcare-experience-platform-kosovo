import SubmitExperienceForm from '../components/SubmitExperienceForm'
import '../styles/SubmitPage.css'

/**
 * SubmitPage — page wrapper for the anonymous experience submission form.
 *
 * Provides context and reassurance before the user fills in the form.
 * The actual form logic lives in the SubmitExperienceForm component.
 */
function SubmitPage() {
  return (
    <div className="submit-page">
      {/* Page header */}
      <div className="submit-page-header">
        <div className="submit-page-header-inner">
          <h1 className="submit-page-title">Share Your Healthcare Journey</h1>
          <p className="submit-page-subtitle">
            Help others understand what to expect. Share your experience anonymously — 
            no names, no personal details, just the journey.
          </p>

          {/* Trust reassurance items */}
          <div className="submit-trust-row" role="list" aria-label="Privacy assurances">
            <div className="submit-trust-item" role="listitem">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M9 12l2 2 4-4" stroke="#10B981" strokeWidth="2" strokeLinecap="round" />
                <circle cx="12" cy="12" r="10" stroke="#10B981" strokeWidth="2" />
              </svg>
              Fully anonymous
            </div>
            <div className="submit-trust-item" role="listitem">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M9 12l2 2 4-4" stroke="#10B981" strokeWidth="2" strokeLinecap="round" />
                <circle cx="12" cy="12" r="10" stroke="#10B981" strokeWidth="2" />
              </svg>
              No registration required
            </div>
            <div className="submit-trust-item" role="listitem">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M9 12l2 2 4-4" stroke="#10B981" strokeWidth="2" strokeLinecap="round" />
                <circle cx="12" cy="12" r="10" stroke="#10B981" strokeWidth="2" />
              </svg>
              No personal data stored
            </div>
            <div className="submit-trust-item" role="listitem">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M9 12l2 2 4-4" stroke="#10B981" strokeWidth="2" strokeLinecap="round" />
                <circle cx="12" cy="12" r="10" stroke="#10B981" strokeWidth="2" />
              </svg>
              Not medical advice
            </div>
          </div>
        </div>
      </div>

      {/* Form section */}
      <div className="submit-form-wrapper">
        <SubmitExperienceForm />
      </div>
    </div>
  )
}

export default SubmitPage
