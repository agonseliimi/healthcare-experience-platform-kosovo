import { useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getExperiences } from '../api/api'
import { useAuth } from '../context/AuthContext'
import ExperienceCard from '../components/ExperienceCard'
import SearchFilters from '../components/SearchFilters'
import GuestLimitBanner from '../components/GuestLimitBanner'
import LoadingState from '../components/LoadingState'
import ErrorState from '../components/ErrorState'
import { hasReachedGuestLimit, incrementGuestUsage } from '../utils/guestUsage'
import { useTranslation } from 'react-i18next'

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
  const { t } = useTranslation()
  // The hero links here as /search?q=…, so seed the box from the URL.
  const [searchParams] = useSearchParams()
  const initialQuery = searchParams.get('q') ?? ''
  const [searchInput, setSearchInput] = useState(initialQuery)
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

  // Initial browse (not counted against the guest limit). Re-runs when the hero
  // sends a new ?q= while this page is already mounted.
  useEffect(() => {
    setSearchInput(initialQuery)
    fetchData(initialQuery, emptyFilters)
  }, [fetchData, initialQuery])

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

  function handleSearchSubmit() {
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

  const countLabel = `${experiences.length} ${
    experiences.length !== 1 ? t('searchPage.experienceCountPlural') : t('searchPage.experienceCountSingle')
  }`

  return (
    <div className="page">
      <header className="page-head">
        <div className="search-head">
          <h1 className="page-title">{t('searchPage.title')}</h1>
          {!loading && !error && <span className="search-count">{countLabel}</span>}
        </div>
        <p className="page-sub">{t('searchPage.sub')}</p>

        <SearchFilters
          search={searchInput}
          onSearch={setSearchInput}
          onSubmit={handleSearchSubmit}
          filters={filters}
          onChange={handleFilterChange}
          onReset={handleReset}
        />
      </header>

      <div className="search-results">
        {loading ? (
          <LoadingState message={t('searchPage.loading')} />
        ) : error ? (
          <ErrorState message={error} onRetry={() => fetchData(searchInput, filters)} />
        ) : experiences.length === 0 ? (
          <div className="state-box">
            <p className="state-text">{t('searchPage.noMatch')}</p>
            <button className="btn btn-secondary" onClick={handleReset}>{t('searchPage.clearFilters')}</button>
          </div>
        ) : (
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
        )}
      </div>

      {showGuestLimit && (
        <GuestLimitBanner onContinue={() => { setPreviewMode(true); setShowGuestLimit(false) }} />
      )}
    </div>
  )
}

export default Search
