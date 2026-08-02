import { useTranslation } from 'react-i18next'

/**
 * The redesign reduces verification to two readable states.
 *
 * The backend enum still has three values. HIGH_CONFIDENCE is no longer offered
 * anywhere in the UI, but rows created before that change still carry it, so it
 * is treated as documented rather than silently rendering as unverified.
 *
 * See isDocumented() for the single place that mapping lives.
 */
export function isDocumented(verificationLevel) {
  return verificationLevel === 'DOCUMENT_SUPPORTED' || verificationLevel === 'HIGH_CONFIDENCE'
}

function VerificationLabel({ verificationLevel }) {
  const { t } = useTranslation()

  if (isDocumented(verificationLevel)) {
    return (
      <span className="vbadge vbadge--DOCUMENT_SUPPORTED">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
             strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M20 6 9 17l-5-5" />
        </svg>
        {t('verifications.DOCUMENT_SUPPORTED')}
      </span>
    )
  }

  return (
    <span className="vbadge vbadge--SELF_REPORTED">
      <span className="vbadge-dot" aria-hidden="true" />
      {t('verifications.SELF_REPORTED')}
    </span>
  )
}

export default VerificationLabel
