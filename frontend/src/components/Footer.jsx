import { Link } from 'react-router-dom'
import '../styles/Footer.css'

/**
 * Footer component — appears on every page.
 *
 * Contains:
 *   - Legal disclaimer (very important: not medical advice)
 *   - Quick links
 *   - Privacy notice summary
 *   - Project context (university MVP)
 */
function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      <div className="footer-inner">
        {/* Disclaimer — the most important legal notice */}
        <div className="footer-disclaimer">
          <p className="footer-disclaimer-text">
            <strong>Medical Disclaimer:</strong> This platform does not provide medical diagnosis or
            medical advice. All content represents anonymous patient experiences shared voluntarily.
            Always consult a qualified healthcare professional for medical decisions.
          </p>
        </div>

        <div className="footer-columns">
          {/* Brand column */}
          <div className="footer-col">
            <span className="footer-brand">HealthPath Kosovo</span>
            <p className="footer-tagline">
              Transparent patient journeys. No names. No advice.
            </p>
            <p className="footer-mvp-note">
              This is an early-stage MVP prototype built as part of a university mentorship project.
            </p>
          </div>

          {/* Navigation column */}
          <div className="footer-col">
            <h3 className="footer-col-title">Navigation</h3>
            <ul className="footer-links" role="list">
              <li><Link to="/" className="footer-link">Home</Link></li>
              <li><Link to="/search" className="footer-link">Search Experiences</Link></li>
              <li><Link to="/submit" className="footer-link">Share an Experience</Link></li>
              <li><Link to="/privacy" className="footer-link">Privacy & Trust</Link></li>
            </ul>
          </div>

          {/* Privacy column */}
          <div className="footer-col">
            <h3 className="footer-col-title">Privacy</h3>
            <ul className="footer-links" role="list">
              <li className="footer-text-item">All submissions are anonymous</li>
              <li className="footer-text-item">No personal identifiers stored</li>
              <li className="footer-text-item">Documents are never shown publicly</li>
              <li className="footer-text-item">
                FUTURE: GDPR-aligned data policy
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copy">
            &copy; {new Date().getFullYear()} HealthPath Kosovo — University MVP Prototype
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
