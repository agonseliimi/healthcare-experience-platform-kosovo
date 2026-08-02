import { CATEGORIES, CITIES, INSTITUTION_TYPES } from '../utils/constants'
import { useTranslation } from 'react-i18next'

/**
 * Filter row for the Search page (fully controlled by the parent).
 *
 * The redesign replaces the left sidebar with a single row so results start
 * roughly a screen higher. Every filter the sidebar had is still here:
 * search text, city, category, institution type, cost range, waiting time and
 * verification level — just laid out horizontally and wrapping on small screens.
 *
 * Props:
 *   search     - current free-text query
 *   onSearch   - (value) => void, called as the query changes
 *   onSubmit   - () => void, called on Enter
 *   filters    - current filter values
 *   onChange   - (key, value) => void
 *   onReset    - () => void
 */
function SearchFilters({ search, onSearch, onSubmit, filters, onChange, onReset }) {
  const { t } = useTranslation()

  function handleKeyDown(event) {
    if (event.key === 'Enter') {
      event.preventDefault()
      onSubmit?.()
    }
  }

  return (
    <div className="filters" role="search">
      <div className="filter-search">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
             strokeWidth="2" strokeLinecap="round" aria-hidden="true" style={{ color: 'var(--text-light)' }}>
          <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />
        </svg>
        <input
          type="search"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t('searchPage.searchPlaceholder')}
          aria-label={t('searchPage.searchBtn')}
        />
      </div>

      <select
        className="filter-select"
        value={filters.city}
        onChange={(e) => onChange('city', e.target.value)}
        aria-label={t('filters.city')}
      >
        <option value="">{t('filters.allCities')}</option>
        {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
      </select>

      <select
        className="filter-select"
        value={filters.category}
        onChange={(e) => onChange('category', e.target.value)}
        aria-label={t('filters.category')}
      >
        <option value="">{t('filters.allCategories')}</option>
        {CATEGORIES.map((c) => <option key={c} value={c}>{t(`categories.${c}`)}</option>)}
      </select>

      <div className="filter-seg" role="group" aria-label={t('filters.institution')}>
        <button
          type="button"
          aria-pressed={filters.institutionType === ''}
          onClick={() => onChange('institutionType', '')}
        >
          {t('filters.all')}
        </button>
        {INSTITUTION_TYPES.map((type) => (
          <button
            key={type.value}
            type="button"
            aria-pressed={filters.institutionType === type.value}
            onClick={() => onChange('institutionType', type.value)}
          >
            {t(`institutions.${type.value}`)}
          </button>
        ))}
      </div>

      <input
        type="number"
        min="0"
        className="filter-select filter-num"
        placeholder={t('filters.min')}
        value={filters.minCost}
        onChange={(e) => onChange('minCost', e.target.value)}
        aria-label={`${t('filters.cost')} — ${t('filters.min')}`}
      />
      <input
        type="number"
        min="0"
        className="filter-select filter-num"
        placeholder={t('filters.max')}
        value={filters.maxCost}
        onChange={(e) => onChange('maxCost', e.target.value)}
        aria-label={`${t('filters.cost')} — ${t('filters.max')}`}
      />

      <input
        type="text"
        className="filter-select filter-num"
        placeholder={t('filters.waitingTimePlaceholder')}
        value={filters.waitingTime}
        onChange={(e) => onChange('waitingTime', e.target.value)}
        aria-label={t('filters.waitingTime')}
      />

      <select
        className="filter-select"
        value={filters.verificationLevel}
        onChange={(e) => onChange('verificationLevel', e.target.value)}
        aria-label={t('filters.verification')}
      >
        <option value="">{t('filters.allLevels')}</option>
        <option value="SELF_REPORTED">{t('verifications.SELF_REPORTED')}</option>
        <option value="DOCUMENT_SUPPORTED">{t('verifications.DOCUMENT_SUPPORTED')}</option>
      </select>

      <button type="button" className="filter-clear" onClick={onReset}>
        {t('filters.clearAll')}
      </button>
    </div>
  )
}

export default SearchFilters
