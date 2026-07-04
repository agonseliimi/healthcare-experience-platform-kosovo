import { useTranslation } from 'react-i18next'

/** Reusable error box with an optional retry button. */
function ErrorState({ message, onRetry }) {
  const { t } = useTranslation()
  return (
    <div className="state-box state-box--error" role="alert">
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
        <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <p className="state-text">{message || t('states.error')}</p>
      {onRetry && (
        <button className="btn btn-secondary" onClick={onRetry}>
          {t('states.tryAgain')}
        </button>
      )}
    </div>
  )
}

export default ErrorState
