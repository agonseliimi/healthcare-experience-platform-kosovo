import PrivacySection from '../components/PrivacySection'

/** Trust & Privacy page. */
function Privacy() {
  return (
    <div className="page narrow">
      <header className="page-head">
        <h1 className="page-title">Privacy &amp; Trust</h1>
        <p className="page-sub">How your data is protected and how the platform stays trustworthy.</p>
      </header>
      <PrivacySection />
    </div>
  )
}

export default Privacy
