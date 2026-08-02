import { useTranslation } from 'react-i18next'
import { isDocumented } from './VerificationLabel'

/**
 * How much weight a reader should give one journey.
 *
 * Combines three signals:
 *   - how helpful readers found it (likes vs dislikes)
 *   - whether a document backs it up
 *   - the author's standing
 *
 * The author's raw trust number is used as an input but is never rendered — it
 * stays private. Readers only see a three-step bar and a word.
 *
 * NOTE: this reflects community credibility, NOT medical correctness.
 */
export function journeyTrustScore({ likes = 0, dislikes = 0, verificationLevel, hasDocument, authorTrustScore }) {
  // Helpfulness (0..35). Ramps in over the first few votes so a single like
  // cannot push a brand-new journey into the top band.
  const totalVotes = (likes || 0) + (dislikes || 0)
  const ratio = totalVotes > 0 ? (likes || 0) / totalVotes : 0
  const confidence = Math.min(totalVotes / 5, 1)
  const helpful = ratio * confidence * 35

  // Evidence (0..40) — the strongest single signal available. Uses the same
  // mapping as the badge, so a journey shown as "Documented" always scores as one.
  const documented = isDocumented({ verificationLevel, hasDocument }) ? 40 : 0

  // Author standing (0..25). Input only, never displayed.
  const author = (Math.min(Math.max(authorTrustScore ?? 0, 0), 100) / 100) * 25

  return Math.round(helpful + documented + author)
}

/**
 * Props:
 *   likes, dislikes    - vote counts on this journey
 *   verificationLevel  - backend enum for this journey
 *   authorTrustScore   - 0..100, scoring input only, never shown
 */
function TrustBadge({ likes, dislikes, verificationLevel, hasDocument, authorTrustScore }) {
  const { t } = useTranslation()

  const score = journeyTrustScore({ likes, dislikes, verificationLevel, hasDocument, authorTrustScore })

  let tone = 'low'
  let filled = 1
  if (score >= 60) {
    tone = 'high'
    filled = 3
  } else if (score >= 30) {
    tone = 'medium'
    filled = 2
  }

  const text = tone === 'high' ? t('trust.high') : tone === 'medium' ? t('trust.medium') : t('trust.low')

  return (
    <span className={`trust-badge trust-badge--${tone}`} title={t('trust.tooltip')}>
      <span className="trust-bars" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <span className={`trust-bar ${i < filled ? 'is-on' : ''}`} key={i} />
        ))}
      </span>
      <span className="trust-label">{text}</span>
    </span>
  )
}

export default TrustBadge
