import { CATEGORIES, CITIES, INSTITUTION_TYPES, VERIFICATION_LEVELS } from '../utils/constants'
import { useTranslation } from 'react-i18next'

/**
 * Sidebar filter panel for the Search page (fully controlled by the parent).
 *
 * Props:
 *   filters  - current filter values
 *   onChange - (key, value) => void
 *   onReset  - () => void
 */
function SearchFilters({ filters, onChange, onReset }) {
  const { t } = useTranslation()

  return (
    <aside className="filters card">
      <div className="filters-head">
        <h2 className="filters-title">{t('filters.title')}</h2>
        <button className="link-btn" onClick={onReset}>{t('filters.clearAll')}</button>
      </div>

      <div className="filter-group">
        <label className="form-label" htmlFor="f-city">{t('filters.city')}</label>
        <select id="f-city" className="form-select" value={filters.city} onChange={(e) => onChange('city', e.target.value)}>
          <option value="">{t('filters.allCities')}</option>
          {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="filter-group">
        <label className="form-label" htmlFor="f-cat">{t('filters.category')}</label>
        <select id="f-cat" className="form-select" value={filters.category} onChange={(e) => onChange('category', e.target.value)}>
          <option value="">{t('filters.allCategories')}</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{t(`categories.${c}`)}</option>)}
        </select>
      </div>

      <div className="filter-group">
        <span className="form-label">{t('filters.institution')}</span>
        <label className="radio"><input type="radio" name="inst" checked={filters.institutionType === ''} onChange={() => onChange('institutionType', '')} /> {t('filters.all')}</label>
        {INSTITUTION_TYPES.map((type) => (
          <label className="radio" key={type.value}>
            <input type="radio" name="inst" checked={filters.institutionType === type.value} onChange={() => onChange('institutionType', type.value)} /> {t(`institutions.${type.value}`)}
          </label>
        ))}
      </div>

      <div className="filter-group">
        <span className="form-label">{t('filters.cost')}</span>
        <div className="filter-row">
          <input type="number" min="0" className="form-input" placeholder={t('filters.min')} value={filters.minCost} onChange={(e) => onChange('minCost', e.target.value)} />
          <input type="number" min="0" className="form-input" placeholder={t('filters.max')} value={filters.maxCost} onChange={(e) => onChange('maxCost', e.target.value)} />
        </div>
      </div>

      <div className="filter-group">
        <label className="form-label" htmlFor="f-wait">{t('filters.waitingTime')}</label>
        <input id="f-wait" type="text" className="form-input" placeholder={t('filters.waitingTimePlaceholder')} value={filters.waitingTime} onChange={(e) => onChange('waitingTime', e.target.value)} />
      </div>

      <div className="filter-group">
        <label className="form-label" htmlFor="f-verif">{t('filters.verification')}</label>
        <select id="f-verif" className="form-select" value={filters.verificationLevel} onChange={(e) => onChange('verificationLevel', e.target.value)}>
          <option value="">{t('filters.allLevels')}</option>
          {VERIFICATION_LEVELS.map((v) => <option key={v.value} value={v.value}>{t(`verifications.${v.value}`)}</option>)}
        </select>
      </div>
    </aside>
  )
}

export default SearchFilters
