import PrivacySection from '../components/PrivacySection'
import '../styles/PrivacyPage.css'

/**
 * PrivacyPage — the Trust & Privacy section of the platform.
 *
 * This is an important page for user trust.
 * It wraps the PrivacySection component with a page header.
 */
function PrivacyPage() {
  return (
    <div className="privacy-page">
      {/* Page header */}
      <div className="privacy-page-header">
        <div className="privacy-page-header-inner">
          <h1 className="privacy-page-title">Privacy &amp; Trust</h1>
          <p className="privacy-page-subtitle">
            Understand how your data is protected and how the platform works to ensure
            your privacy and the integrity of shared experiences.
          </p>
        </div>
      </div>

      {/* Privacy content */}
      <div className="privacy-page-body">
        <PrivacySection />
      </div>
    </div>
  )
}

export default PrivacyPage
