import { Link } from 'react-router-dom'

/** Global footer with the required medical disclaimer. */
function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-disclaimer">
          This platform does not provide medical diagnosis or medical advice. It only helps users
          understand anonymous patient journeys.
        </div>

        <div className="footer-grid">
          <div>
            <span className="footer-brand">HealthPath Kosovo</span>
            <p className="footer-tagline">Transparent, anonymous patient journeys — no advice, no names.</p>
            <p className="footer-note">University MVP prototype. Not a production medical system.</p>
          </div>
          <div>
            <h4 className="footer-heading">Explore</h4>
            <Link to="/" className="footer-link">Home</Link>
            <Link to="/search" className="footer-link">Search</Link>
            <Link to="/privacy" className="footer-link">Privacy & Trust</Link>
          </div>
          <div>
            <h4 className="footer-heading">Privacy</h4>
            <span className="footer-item">Anonymous by default</span>
            <span className="footer-item">Documents are never public</span>
            <span className="footer-item">No personal identifiers</span>
          </div>
        </div>

        <div className="footer-bottom">
          &copy; {new Date().getFullYear()} HealthPath Kosovo — Local demo only.
        </div>
      </div>
    </footer>
  )
}

export default Footer
