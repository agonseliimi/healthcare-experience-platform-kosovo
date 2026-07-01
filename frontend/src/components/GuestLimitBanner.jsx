import { Link } from 'react-router-dom'

/**
 * Modal shown when a guest reaches the free browsing limit.
 *
 * Props:
 *   onContinue - lets the guest dismiss and keep a limited preview
 */
function GuestLimitBanner({ onContinue }) {
  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="guest-limit-title">
      <div className="modal">
        <h2 id="guest-limit-title" className="modal-title">You have reached the guest access limit</h2>
        <p className="modal-text">
          Create a free account to unlock full access: browse all experiences, share your own
          anonymous journey, vote, and request verification.
        </p>
        <div className="modal-actions">
          <Link to="/register" className="btn btn-primary">Register</Link>
          <Link to="/login" className="btn btn-secondary">Login</Link>
          <button className="btn btn-ghost" onClick={onContinue}>Continue Limited Preview</button>
        </div>
      </div>
    </div>
  )
}

export default GuestLimitBanner
