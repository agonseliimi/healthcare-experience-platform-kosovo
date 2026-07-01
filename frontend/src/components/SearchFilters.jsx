import { CATEGORIES, CITIES, INSTITUTION_TYPES, VERIFICATION_LEVELS } from '../utils/constants'

/**
 * Sidebar filter panel for the Search page (fully controlled by the parent).
 *
 * Props:
 *   filters  - current filter values
 *   onChange - (key, value) => void
 *   onReset  - () => void
 */
function SearchFilters({ filters, onChange, onReset }) {
  return (
    <aside className="filters card">
      <div className="filters-head">
        <h2 className="filters-title">Filters</h2>
        <button className="link-btn" onClick={onReset}>Clear all</button>
      </div>

      <div className="filter-group">
        <label className="form-label" htmlFor="f-city">City</label>
        <select id="f-city" className="form-select" value={filters.city} onChange={(e) => onChange('city', e.target.value)}>
          <option value="">All cities</option>
          {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="filter-group">
        <label className="form-label" htmlFor="f-cat">Category</label>
        <select id="f-cat" className="form-select" value={filters.category} onChange={(e) => onChange('category', e.target.value)}>
          <option value="">All categories</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="filter-group">
        <span className="form-label">Institution</span>
        <label className="radio"><input type="radio" name="inst" checked={filters.institutionType === ''} onChange={() => onChange('institutionType', '')} /> All</label>
        {INSTITUTION_TYPES.map((t) => (
          <label className="radio" key={t.value}>
            <input type="radio" name="inst" checked={filters.institutionType === t.value} onChange={() => onChange('institutionType', t.value)} /> {t.label}
          </label>
        ))}
      </div>

      <div className="filter-group">
        <span className="form-label">Approximate cost (€)</span>
        <div className="filter-row">
          <input type="number" min="0" className="form-input" placeholder="Min" value={filters.minCost} onChange={(e) => onChange('minCost', e.target.value)} />
          <input type="number" min="0" className="form-input" placeholder="Max" value={filters.maxCost} onChange={(e) => onChange('maxCost', e.target.value)} />
        </div>
      </div>

      <div className="filter-group">
        <label className="form-label" htmlFor="f-wait">Waiting time contains</label>
        <input id="f-wait" type="text" className="form-input" placeholder="e.g. weeks, days" value={filters.waitingTime} onChange={(e) => onChange('waitingTime', e.target.value)} />
      </div>

      <div className="filter-group">
        <label className="form-label" htmlFor="f-verif">Verification level</label>
        <select id="f-verif" className="form-select" value={filters.verificationLevel} onChange={(e) => onChange('verificationLevel', e.target.value)}>
          <option value="">All levels</option>
          {VERIFICATION_LEVELS.map((v) => <option key={v.value} value={v.value}>{v.label}</option>)}
        </select>
      </div>
    </aside>
  )
}

export default SearchFilters
