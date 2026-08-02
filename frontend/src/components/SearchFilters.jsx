import { CATEGORIES, CITIES, INSTITUTION_TYPES } from '../utils/constants'
import { useTranslation } from 'react-i18next'

/**
 * Filter row for the Search page (fully controlled by the parent).
 *
 * Deliberately short: search, city, specialty, where they went, and a sort.
 * The old sidebar also offered a cost range, a waiting-time text match and a
 * verification level; those were dropped because they crowded the row without
 * being used much. The backend still accepts them — see emptyFilters in Search.
 *
 * Props:
 *   search    - current free-text query
 *   onSearch  - (value) => void
 *   onSubmit  - () => void, called on Enter
 *   filters   - current filter values
 *   onChange  - (key, value) => void
 *   sort      - current sort key
 *   onSort    - (value) => void
 *   onReset   - () => void
 */
function SearchFilters({ search, onSearch, onSubmit, filters, onChange, sort, onSort, onReset }) {
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

      <select
        className="filter-select"
        value={sort}
        onChange={(e) => onSort(e.target.value)}
        aria-label={t('filters.sort')}
      >
        <option value="helpful">{t('filters.sortHelpful')}</option>
        <option value="recent">{t('filters.sortRecent')}</option>
        <option value="cheapest">{t('filters.sortCheapest')}</option>
      </select>

      <button type="button" className="filter-clear" onClick={onReset}>
        {t('filters.clearAll')}
      </button>
    </div>
  )
}

export default SearchFilters
