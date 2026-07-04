import { useTranslation } from 'react-i18next'

/** Simple, reusable loading indicator. */
function LoadingState({ message }) {
  const { t } = useTranslation()
  return (
    <div className="state-box" role="status" aria-live="polite">
      <div className="spinner" aria-hidden="true" />
      <p className="state-text">{message || t('states.loading')}</p>
    </div>
  )
}

export default LoadingState
