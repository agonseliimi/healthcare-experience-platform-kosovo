import { useEffect, useState, useCallback } from 'react'
import { getExperiences } from '../api/api'
import { useAuth } from '../context/AuthContext'
import ExperienceCard from '../components/ExperienceCard'
import SearchFilters from '../components/SearchFilters'
import GuestLimitBanner from '../components/GuestLimitBanner'
import LoadingState from '../components/LoadingState'
import ErrorState from '../components/ErrorState'
import { hasReachedGuestLimit, incrementGuestUsage } from '../utils/guestUsage'

const emptyFilters = {
  city: '',
  category: '',
  institutionType: '',
  minCost: '',
  maxCost: '',
  waitingTime: '',
  verificationLevel: '',
}

/** Browse + search experiences, with client guest-limit gating. */
function Search() {
  const { isAuthenticated } = useAuth()
  const [searchInput, setSearchInput] = useState('')
  const [filters, setFilters] = useState(emptyFilters)
  const [experiences, setExperiences] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showGuestLimit, setShowGuestLimit] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)

  const fetchData = useCallback(async (appliedSearch, appliedFilters) => {
    setLoading(true)
    setError(null)
    try {
      const data = await getExperiences({ search: appliedSearch, ...appliedFilters })
      setExperiences(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  // Initial browse (not counted against the guest limit).
  useEffect(() => {
    fetchData('', emptyFilters)
  }, [fetchData])

  // Returns true if the action is allowed; guests are limited.
  function guardGuestAction() {
    if (isAuthenticated || previewMode) return true
    if (hasReachedGuestLimit()) {
      setShowGuestLimit(true)
      return false
    }
    incrementGuestUsage()
    if (hasReachedGuestLimit()) {
      // This was the last allowed action; still perform it, then warn next time.
    }
    return true
  }

  function handleSearchSubmit(e) {
    e.preventDefault()
    if (!guardGuestAction()) return
    fetchData(searchInput, filters)
  }

  function handleFilterChange(key, value) {
    const next = { ...filters, [key]: value }
    setFilters(next)
    if (!guardGuestAction()) return
    fetchData(searchInput, next)
  }

  function handleReset() {
    setFilters(emptyFilters)
    setSearchInput('')
    fetchData('', emptyFilters)
  }

  return (
    <div className="page">
      <header className="page-head">
        <h1 className="page-title">Browse Experiences</h1>
        <p className="page-sub">
          Search anonymous patient journeys. No personal information is ever shown.
        </p>

        <form className="search-bar" onSubmit={handleSearchSubmit} role="search">
          <input
            type="search"
            className="form-input search-input"
            placeholder="Search by symptom, category, or city..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            aria-label="Search experiences"
          />
          <button type="submit" className="btn btn-primary">Search</button>
        </form>
      </header>

      <div className="search-layout">
        <SearchFilters filters={filters} onChange={handleFilterChange} onReset={handleReset} />

        <div className="search-results">
          {loading ? (
            <LoadingState message="Loading experiences..." />
          ) : error ? (
            <ErrorState message={error} onRetry={() => fetchData(searchInput, filters)} />
          ) : experiences.length === 0 ? (
            <div className="state-box">
              <p className="state-text">No experiences match your filters.</p>
              <button className="btn btn-secondary" onClick={handleReset}>Clear filters</button>
            </div>
          ) : (
            <>
              <p className="results-count">{experiences.length} experience{experiences.length !== 1 ? 's' : ''}</p>
              <div className="cards-grid">
                {experiences.map((exp) => (
                  <ExperienceCard
                    key={exp.id}
                    experience={exp}
                    onRequireAuth={() => setShowGuestLimit(true)}
                    onChanged={() => fetchData(searchInput, filters)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {showGuestLimit && (
        <GuestLimitBanner onContinue={() => { setPreviewMode(true); setShowGuestLimit(false) }} />
      )}
    </div>
  )
}

export default Search
