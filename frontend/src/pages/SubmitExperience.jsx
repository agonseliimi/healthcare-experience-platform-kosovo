import SubmitExperienceForm from '../components/SubmitExperienceForm'

/** Protected page wrapper for the submission form. */
function SubmitExperience() {
  return (
    <div className="page narrow">
      <header className="page-head">
        <h1 className="page-title">Share Your Healthcare Journey</h1>
        <p className="page-sub">
          Help others know what to expect. Sharing is anonymous by default and never includes
          personal identifiers.
        </p>
      </header>
      <SubmitExperienceForm />
    </div>
  )
}

export default SubmitExperience
