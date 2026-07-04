import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

/**
 * Modal shown when a guest reaches the free browsing limit.
 *
 * Props:
 *   onContinue - lets the guest dismiss and keep a limited preview
 */
function GuestLimitBanner({ onContinue }) {
  const { t } = useTranslation()
  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="guest-limit-title">
      <div className="modal">
        <h2 id="guest-limit-title" className="modal-title">{t('guestLimit.title')}</h2>
        <p className="modal-text">{t('guestLimit.text')}</p>
        <div className="modal-actions">
          <Link to="/register" className="btn btn-primary">{t('guestLimit.register')}</Link>
          <Link to="/login" className="btn btn-secondary">{t('guestLimit.login')}</Link>
          <button className="btn btn-ghost" onClick={onContinue}>{t('guestLimit.continue')}</button>
        </div>
      </div>
    </div>
  )
}

export default GuestLimitBanner
