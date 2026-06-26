import { medicalCategories, kosovoCities } from '../data/mockExperiences'
import '../styles/SearchFilters.css'

/**
 * SearchFilters component — sidebar filter panel for the Search page.
 *
 * Allows users to narrow down experiences by:
 *   - Institution type (public / private)
 *   - Medical category
 *   - City
 *   - Approximate cost range
 *   - Waiting time
 *   - Verification level
 *
 * Props:
 *   filters (object)    — current filter state (controlled from SearchPage)
 *   onChange (function) — callback to update a specific filter field
 *   onReset (function)  — callback to clear all filters
 *
 * FUTURE: Filter options will come from a backend endpoint that returns
 * available facets based on actual data in the database.
 */
function SearchFilters({ filters, onChange, onReset }) {
  return (
    <aside className="search-filters" aria-label="Filter experiences">
      <div className="filters-header">
        <h2 className="filters-title">Filter Results</h2>
        <button
          className="filters-reset"
          onClick={onReset}
          aria-label="Clear all filters"
        >
          Clear all
        </button>
      </div>

      {/* Institution type */}
      <div className="filter-group">
        <h3 className="filter-group-label">Institution Type</h3>
        <label className="filter-radio">
          <input
            type="radio"
            name="institutionType"
            value=""
            checked={filters.institutionType === ''}
            onChange={(e) => onChange('institutionType', e.target.value)}
          />
          <span>All</span>
        </label>
        <label className="filter-radio">
          <input
            type="radio"
            name="institutionType"
            value="public"
            checked={filters.institutionType === 'public'}
            onChange={(e) => onChange('institutionType', e.target.value)}
          />
          <span>Public Hospital</span>
        </label>
        <label className="filter-radio">
          <input
            type="radio"
            name="institutionType"
            value="private"
            checked={filters.institutionType === 'private'}
            onChange={(e) => onChange('institutionType', e.target.value)}
          />
          <span>Private Clinic</span>
        </label>
      </div>

      {/* Medical category */}
      <div className="filter-group">
        <h3 className="filter-group-label">Category</h3>
        <select
          className="filter-select"
          value={filters.category}
          onChange={(e) => onChange('category', e.target.value)}
          aria-label="Filter by medical category"
        >
          <option value="">All Categories</option>
          {medicalCategories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* City */}
      <div className="filter-group">
        <h3 className="filter-group-label">City</h3>
        <select
          className="filter-select"
          value={filters.city}
          onChange={(e) => onChange('city', e.target.value)}
          aria-label="Filter by city"
        >
          <option value="">All Cities</option>
          {kosovoCities.map((city) => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
      </div>

      {/* Verification level */}
      <div className="filter-group">
        <h3 className="filter-group-label">Verification Level</h3>
        <label className="filter-radio">
          <input
            type="radio"
            name="verificationStatus"
            value=""
            checked={filters.verificationStatus === ''}
            onChange={(e) => onChange('verificationStatus', e.target.value)}
          />
          <span>All Levels</span>
        </label>
        <label className="filter-radio">
          <input
            type="radio"
            name="verificationStatus"
            value="self-reported"
            checked={filters.verificationStatus === 'self-reported'}
            onChange={(e) => onChange('verificationStatus', e.target.value)}
          />
          <span>Self-Reported</span>
        </label>
        <label className="filter-radio">
          <input
            type="radio"
            name="verificationStatus"
            value="document-supported"
            checked={filters.verificationStatus === 'document-supported'}
            onChange={(e) => onChange('verificationStatus', e.target.value)}
          />
          <span>Document-Supported</span>
        </label>
        <label className="filter-radio">
          <input
            type="radio"
            name="verificationStatus"
            value="high-confidence"
            checked={filters.verificationStatus === 'high-confidence'}
            onChange={(e) => onChange('verificationStatus', e.target.value)}
          />
          <span>High-Confidence</span>
        </label>
      </div>
    </aside>
  )
}

export default SearchFilters
