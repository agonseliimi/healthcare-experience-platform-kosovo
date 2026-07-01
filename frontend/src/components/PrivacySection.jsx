/**
 * Reusable privacy/trust explanation content used by the Privacy page.
 */
function PrivacySection() {
  return (
    <div className="privacy">
      <div className="alert alert-warning privacy-banner">
        <strong>This platform does not provide medical diagnosis or medical advice.</strong>{' '}
        It only helps users understand anonymous patient journeys.
      </div>

      <section className="privacy-block card">
        <h2>Anonymous mode</h2>
        <p>
          You can submit experiences anonymously. When an experience is anonymous, your identity is
          never shown next to it. There is no requirement to reveal who you are.
        </p>
      </section>

      <section className="privacy-block card">
        <h2>What not to share</h2>
        <ul className="bullet">
          <li>Personal ID numbers</li>
          <li>Phone numbers</li>
          <li>Exact addresses</li>
          <li>Full patient names</li>
          <li>Doctor names</li>
          <li>Any sensitive private identifiers</li>
        </ul>
        <p>The backend also runs a basic automatic check and will reject obvious personal identifiers.</p>
      </section>

      <section className="privacy-block card">
        <h2>Optional verification &amp; documents</h2>
        <p>
          Verification is optional. You can submit without it and request it later. If you reference a
          supporting document, it is <strong>never shown publicly</strong>. In this MVP no real file is
          stored — only a reference name and note, visible to administrators only.
        </p>
      </section>

      <section className="privacy-block card">
        <h2>Verification levels</h2>
        <div className="levels">
          <div className="level">
            <span className="dot" style={{ background: '#F59E0B' }} />
            <div><strong>Self-reported</strong><p>Submitted without supporting evidence.</p></div>
          </div>
          <div className="level">
            <span className="dot" style={{ background: '#3B82F6' }} />
            <div><strong>Document-supported</strong><p>A supporting document reference was provided and reviewed. The document is not public.</p></div>
          </div>
          <div className="level">
            <span className="dot" style={{ background: '#10B981' }} />
            <div><strong>High-confidence verification</strong><p>Multiple signals corroborated or admin-reviewed.</p></div>
          </div>
        </div>
      </section>

      <section className="privacy-block card">
        <h2>Trust score</h2>
        <p>
          Every member has a community trust score (0–100). It rises with helpful, corroborated
          contributions and falls with dislikes or upheld reports. <strong>Trust reflects community
          credibility, not medical correctness.</strong>
        </p>
      </section>

      <section className="privacy-block card">
        <h2>Abuse reporting</h2>
        <p>
          Any logged-in user can report an experience for privacy exposure, medical-advice claims,
          offensive content, misleading information, or spam. Moderators review reports and can hide
          content when needed.
        </p>
      </section>

      <section className="privacy-block card">
        <h2>Platform limitations</h2>
        <ul className="bullet">
          <li>This is a university MVP, not a production medical system.</li>
          <li>It does not provide diagnosis, treatment, or emergency advice.</li>
          <li>It does not replace doctors or rate medical correctness.</li>
        </ul>
      </section>
    </div>
  )
}

export default PrivacySection
