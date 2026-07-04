import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

/** Home page hero: value proposition, disclaimer, and primary CTAs. */
function Hero() {
  const { t } = useTranslation()

  return (
    <section className="hero">
      <div className="hero-badge">
        <span className="hero-dot" aria-hidden="true" />
        {t('hero.badge')}
      </div>

      <h1 className="hero-title">
        {t('hero.title_line1')}<br />{t('hero.title_line2')}
      </h1>

      <p className="hero-sub">
        {t('hero.sub')}
      </p>

      <div className="hero-disclaimer">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
          <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        {t('hero.disclaimer')}
      </div>

      <div className="hero-cta">
        <Link to="/search" className="btn btn-primary btn-lg">{t('hero.cta_search')}</Link>
        <Link to="/submit" className="btn btn-secondary btn-lg">{t('hero.cta_submit')}</Link>
      </div>
    </section>
  )
}

export default Hero
