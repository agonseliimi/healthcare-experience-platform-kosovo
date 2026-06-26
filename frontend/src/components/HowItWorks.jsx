import '../styles/HowItWorks.css'

/**
 * HowItWorks component — displayed on the Home page below the Hero.
 *
 * Explains the platform flow in 3 simple steps so new visitors
 * immediately understand the value proposition without confusion.
 */
function HowItWorks() {
  const steps = [
    {
      number: '01',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
          <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ),
      title: 'Search & Browse',
      description:
        'Search by symptom category, city, institution type, or cost range. Read experiences shared by others who went through a similar journey.',
    },
    {
      number: '02',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      ),
      title: 'Share Anonymously',
      description:
        'Submit your own healthcare experience without revealing your identity. You can optionally upload a supporting document — it will never be shown publicly.',
    },
    {
      number: '03',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      title: 'Build Transparency',
      description:
        'Every shared experience adds to a clearer picture of the healthcare system — helping future patients set realistic expectations about costs, waiting times, and next steps.',
    },
  ]

  return (
    <section className="how-it-works" aria-labelledby="hiw-heading">
      <div className="section-inner">
        <div className="section-label">How it works</div>
        <h2 id="hiw-heading" className="section-heading">
          Three simple steps
        </h2>
        <p className="section-subheading">
          No registration required to browse. Sharing is always anonymous.
        </p>

        <div className="hiw-steps">
          {steps.map((step) => (
            <div key={step.number} className="hiw-step">
              <div className="hiw-step-icon">{step.icon}</div>
              <div className="hiw-step-number">{step.number}</div>
              <h3 className="hiw-step-title">{step.title}</h3>
              <p className="hiw-step-desc">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
