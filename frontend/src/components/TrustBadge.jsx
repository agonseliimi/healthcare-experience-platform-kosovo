import { useTranslation } from 'react-i18next'

/**
 * Small badge that shows a user's community trust score + label.
 *
 * NOTE: Trust reflects community credibility, NOT medical correctness.
 */
function TrustBadge({ score, label }) {
  const { t } = useTranslation()

  // Choose a colour band from the score.
  let tone = 'low'
  if (score >= 80) tone = 'high'
  else if (score >= 50) tone = 'medium'

  // Always use a translated band label so it follows the selected language.
  // (The backend `label` is kept in the props for compatibility but not shown.)
  const text = tone === 'high' ? t('trust.high') : tone === 'medium' ? t('trust.medium') : t('trust.low')

  return (
    <span className={`trust-badge trust-badge--${tone}`} title={t('trust.tooltip')}>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2" />
      </svg>
      {text}{typeof score === 'number' ? ` · ${score}` : ''}
    </span>
  )
}

export default TrustBadge
