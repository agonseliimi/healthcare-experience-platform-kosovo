// "Save for later" list, stored per browser in localStorage.
//
// Deliberately client-side: there is no saved-journeys table on the backend, so
// this list is per-device and disappears if the user clears site data. That is
// an acceptable trade for a bookmark, and it means the feature works without a
// schema change. Swap the four functions below for API calls if it ever moves
// server-side — nothing else needs to change.

const KEY = 'healthpath_saved_journeys'

/** @returns {number[]} ids, most recently saved first */
export function getSavedIds() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY))
    return Array.isArray(raw) ? raw.filter((id) => Number.isFinite(id)) : []
  } catch {
    return []
  }
}

export function isSaved(id) {
  return getSavedIds().includes(Number(id))
}

/** Adds or removes the id. @returns the new saved state */
export function toggleSaved(id) {
  const numeric = Number(id)
  const current = getSavedIds()
  const next = current.includes(numeric)
    ? current.filter((saved) => saved !== numeric)
    : [numeric, ...current]
  localStorage.setItem(KEY, JSON.stringify(next))
  return next.includes(numeric)
}

export function clearSaved() {
  localStorage.removeItem(KEY)
}
