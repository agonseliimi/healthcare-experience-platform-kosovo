import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getExperienceDocumentUrl } from '../api/api'

/**
 * Renders an experience's attached image with a Reddit-style NSFW blur.
 *
 * When `sensitive` is true the image is blurred behind a "click to reveal"
 * overlay until the viewer chooses to see it. Only images are handled here;
 * for any other attachment type the component renders nothing so the caller
 * can fall back to a plain download link.
 *
 * Props:
 *   experienceId - id used to build the document URL
 *   contentType  - the attachment MIME type (only image/* is rendered)
 *   sensitive    - whether the image should start blurred
 *   name         - optional file name (used for alt text)
 */
function SensitiveImage({ experienceId, contentType, sensitive, name }) {
  const { t } = useTranslation()
  const [revealed, setRevealed] = useState(false)

  const isImage = typeof contentType === 'string' && contentType.startsWith('image/')
  if (!isImage) return null

  // An attached image is always treated as sensitive (this mirrors the backend
  // detection rule). Defaulting to blurred here also covers experiences created
  // before the `sensitive` flag existed, whose flag is null/false.
  const shouldBlur = sensitive !== false
  const blurred = shouldBlur && !revealed
  const src = getExperienceDocumentUrl(experienceId)

  return (
    <figure className={`sensitive-media ${blurred ? 'is-blurred' : ''}`}>
      <img src={src} alt={name || t('sensitive.imageAlt')} className="sensitive-media-img" />

      {blurred && (
        <button
          type="button"
          className="sensitive-overlay"
          onClick={() => setRevealed(true)}
          aria-label={t('sensitive.reveal')}
        >
          <span className="sensitive-overlay-icon" aria-hidden="true">🔞</span>
          <span className="sensitive-overlay-title">{t('sensitive.title')}</span>
          <span className="sensitive-overlay-hint">{t('sensitive.reveal')}</span>
        </button>
      )}

      {shouldBlur && revealed && (
        <button type="button" className="sensitive-hide" onClick={() => setRevealed(false)}>
          {t('sensitive.hide')}
        </button>
      )}
    </figure>
  )
}

export default SensitiveImage
