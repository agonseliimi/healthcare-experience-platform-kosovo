import { useState, useMemo } from 'react'
import SearchFilters from '../components/SearchFilters'
import ExperienceCard from '../components/ExperienceCard'
import { mockExperiences } from '../data/mockExperiences'
import '../styles/SearchPage.css'

/**
 * SearchPage — browse and filter all anonymous patient experiences.
 *
 * Features:
 *   - Text search (matches category, symptom summary, city)
 *   - Sidebar filters (institution type, category, city, verification level)
 *   - Results count
 *   - Empty state when no results match
 *
 * All filtering is done client-side for this MVP.
 *
 * FUTURE: Replace client-side filtering with server-side search:
 *   GET /api/experiences?q=knee&city=Prizren&type=public&verification=high-confidence
 *
 * FUTURE: Add pagination (GET /api/experiences?page=2&limit=10).
 * FUTURE: Add sort options (newest, most helpful, highest confidence).
 * FUTURE: Add ML-powered semantic search ("knee injury after sport").
 */

const defaultFilters = {
  institutionType: '',
  category: '',
  city: '',
  verificationStatus: '',
}

function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState(defaultFilters)

  // Update one filter key at a time
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  // Reset all filters and search
  const handleReset = () => {
    setFilters(defaultFilters)
    setSearchQuery('')
  }

  // Derive filtered results from mock data based on current state
  // FUTURE: This entire block will be replaced by an API call
  const filteredExperiences = useMemo(() => {
    return mockExperiences.filter((exp) => {
      const q = searchQuery.toLowerCase()

      // Text search across key fields
      const matchesSearch =
        !q ||
        exp.category.toLowerCase().includes(q) ||
        exp.symptomSummary.toLowerCase().includes(q) ||
        exp.city.toLowerCase().includes(q)

      const matchesType =
        !filters.institutionType || exp.institutionType === filters.institutionType

      const matchesCategory =
        !filters.category || exp.category === filters.category

      const matchesCity =
        !filters.city || exp.city === filters.city

      const matchesVerification =
        !filters.verificationStatus || exp.verificationStatus === filters.verificationStatus

      return matchesSearch && matchesType && matchesCategory && matchesCity && matchesVerification
    })
  }, [searchQuery, filters])

  const hasActiveFilters =
    searchQuery || Object.values(filters).some(Boolean)

  return (
    <div className="search-page">
      {/* Page header */}
      <div className="search-header">
        <div className="search-header-inner">
          <h1 className="search-page-title">Browse Experiences</h1>
          <p className="search-page-subtitle">
            Search anonymous patient journeys from Kosovo healthcare institutions.
            All entries are privacy-protected — no personal information is shown.
          </p>

          {/* Search input */}
          <div className="search-input-wrapper" role="search">
            <label htmlFor="main-search" className="sr-only">
              Search experiences
            </label>
            <svg
              className="search-input-icon"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
              <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <input
              id="main-search"
              type="search"
              className="search-input"
              placeholder="Search by symptom, category, or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search experiences"
            />
            {searchQuery && (
              <button
                className="search-clear"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main layout: filters sidebar + results */}
      <div className="search-body">
        <SearchFilters
          filters={filters}
          onChange={handleFilterChange}
          onReset={handleReset}
        />

        <div className="search-results">
          {/* Results summary */}
          <div className="search-results-meta" aria-live="polite" aria-atomic="true">
            <span className="search-results-count">
              {filteredExperiences.length} experience
              {filteredExperiences.length !== 1 ? 's' : ''} found
            </span>
            {hasActiveFilters && (
              <button className="search-results-reset" onClick={handleReset}>
                Clear filters
              </button>
            )}
          </div>

          {/* Results grid */}
          {filteredExperiences.length > 0 ? (
            <div className="search-results-grid">
              {filteredExperiences.map((exp) => (
                <ExperienceCard key={exp.id} experience={exp} />
              ))}
            </div>
          ) : (
            /* Empty state */
            <div className="search-empty" role="status">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="11" cy="11" r="8" stroke="#CBD5E1" strokeWidth="2" />
                <path d="M21 21l-4.35-4.35" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <h3 className="search-empty-title">No experiences found</h3>
              <p className="search-empty-text">
                Try adjusting your search or filters, or{' '}
                <button className="search-empty-reset" onClick={handleReset}>
                  clear all filters
                </button>
                .
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SearchPage
