import { verificationLevels } from '../data/mockExperiences'
import '../styles/PrivacySection.css'

/**
 * PrivacySection component — explains the platform's trust and privacy model.
 *
 * Covers:
 *   - Anonymous submission mode
 *   - How documents are handled (never shown publicly)
 *   - Verification level system
 *   - What the platform is and is not for
 *
 * This is an important trust-building component. Healthcare users are
 * especially sensitive about privacy.
 */
function PrivacySection() {
  const pillars = [
    {
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ),
      title: 'Always Anonymous',
      body: `When you submit an experience, your identity is never stored. There is no mandatory registration. The platform collects only general healthcare journey information — no names, no ID numbers, no phone numbers, no addresses. Each submission is treated as fully anonymous by default.`,
    },
    {
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" strokeWidth="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ),
      title: 'Documents Stay Private',
      body: `If you choose to attach a supporting document (such as a lab result or prescription), it is stored encrypted and never shown to the public. Only its existence is used to raise the verification confidence level of your experience. Documents are not analysed automatically in this MVP — this feature is planned for a future version.`,
    },
    {
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      title: 'Transparency, Not Diagnosis',
      body: `This platform exists to improve healthcare transparency in Kosovo. We help patients set realistic expectations about costs, waiting times, tests, and steps. We do not interpret, assess, or comment on medical conditions. We do not provide medical advice. We do not replace the advice of a qualified healthcare professional.`,
    },
  ]

  return (
    <div className="privacy-section">
      {/* Main disclaimer banner */}
      <div className="privacy-disclaimer-banner" role="note">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
          <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <p>
          <strong>This platform does not provide medical diagnosis or medical advice.</strong>{' '}
          All content represents anonymous patient experiences shared voluntarily. Always consult a
          qualified healthcare professional for any medical concern.
        </p>
      </div>

      {/* Three pillars */}
      <div className="privacy-pillars">
        {pillars.map((pillar) => (
          <div key={pillar.title} className="privacy-pillar">
            <div className="privacy-pillar-icon">{pillar.icon}</div>
            <h3 className="privacy-pillar-title">{pillar.title}</h3>
            <p className="privacy-pillar-body">{pillar.body}</p>
          </div>
        ))}
      </div>

      {/* Verification level explanation */}
      <div className="privacy-verification">
        <h2 className="privacy-verification-heading">Verification Levels</h2>
        <p className="privacy-verification-intro">
          Each shared experience is assigned a verification level. This helps readers understand
          how much confidence to place in the information — but does not imply any medical accuracy.
        </p>
        <div className="privacy-verification-levels">
          {Object.entries(verificationLevels).map(([key, level]) => (
            <div key={key} className="privacy-verification-level">
              <div
                className="privacy-level-indicator"
                style={{ backgroundColor: level.color }}
                aria-hidden="true"
              />
              <div>
                <h4 className="privacy-level-title" style={{ color: level.color }}>
                  {level.label}
                </h4>
                <p className="privacy-level-desc">{level.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Future data policy note */}
      <div className="privacy-future-note">
        <h3 className="privacy-future-title">Future Data Policy</h3>
        <ul className="privacy-future-list">
          <li>GDPR-aligned privacy policy (planned for production version)</li>
          <li>Right to deletion — users can request removal of their submission</li>
          <li>Data stored in PostgreSQL on a secure backend server</li>
          <li>No data is sold or shared with third parties</li>
          <li>ML-based cost/time estimation uses aggregated, anonymised data only</li>
        </ul>
      </div>
    </div>
  )
}

export default PrivacySection
