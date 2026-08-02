import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

// Reuses the symptom list the submit form already offers, so the words readers
// search for are the same words authors tag with.
const POPULAR_COUNT = 6

/** Home hero: the search box is the product's front door. */
function Hero() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  const suggestions = t('submit.symptomSuggestions', { returnObjects: true })
  const popular = Array.isArray(suggestions) ? suggestions.slice(0, POPULAR_COUNT) : []

  function go(term) {
    const value = (term ?? query).trim()
    navigate(value ? `/search?q=${encodeURIComponent(value)}` : '/search')
  }

  function handleSubmit(event) {
    event.preventDefault()
    go()
  }

  return (
    <section className="hero">
      <h1 className="hero-title">{t('hero.title_line1')}<br />{t('hero.title_line2')}</h1>
      <p className="hero-sub">{t('hero.sub')}</p>

      <form className="hero-search" onSubmit={handleSubmit} role="search">
        <svg className="hero-search-icon" width="17" height="17" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />
        </svg>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('hero.searchPlaceholder')}
          aria-label={t('hero.searchPlaceholder')}
        />
        <button type="submit" className="btn btn-primary">{t('hero.cta_search')}</button>
      </form>

      {popular.length > 0 && (
        <div className="hero-popular">
          {popular.map((term) => (
            <button type="button" className="hero-chip" key={term} onClick={() => go(term)}>
              {term}
            </button>
          ))}
        </div>
      )}

      <p className="hero-note">
        <span className="hero-note-mark" aria-hidden="true">i</span>
        {t('hero.disclaimer')}
      </p>
    </section>
  )
}

export default Hero
