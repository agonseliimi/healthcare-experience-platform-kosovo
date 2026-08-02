import { useTranslation } from 'react-i18next'

/**
 * The redesign reduces verification to two readable states.
 *
 * A journey counts as documented when it carries a document, whichever way it
 * got one:
 *   - DOCUMENT_SUPPORTED, set on upload
 *   - HIGH_CONFIDENCE, no longer offered but present on older rows
 *   - hasDocument, which covers journeys uploaded before the level was set on
 *     upload. Without this a page could show the document and still claim none
 *     was attached.
 *
 * This is the single place that mapping lives.
 */
export function isDocumented(experience) {
  if (!experience) return false
  const level = typeof experience === 'string' ? experience : experience.verificationLevel
  const hasDocument = typeof experience === 'string' ? false : Boolean(experience.hasDocument)
  return hasDocument || level === 'DOCUMENT_SUPPORTED' || level === 'HIGH_CONFIDENCE'
}

function VerificationLabel({ experience }) {
  const { t } = useTranslation()

  if (isDocumented(experience)) {
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
