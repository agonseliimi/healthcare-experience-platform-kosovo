// Guest access tracking (frontend-only, stored in localStorage).
//
// Guests have no backend account. We count "meaningful actions" (searching,
// opening details, browsing more cards). After GUEST_LIMIT actions we prompt
// them to register or log in.

const KEY = 'healthcare_guest_usage'
export const GUEST_LIMIT = 5

export function getGuestUsage() {
  const raw = localStorage.getItem(KEY)
  const value = raw ? parseInt(raw, 10) : 0
  return Number.isNaN(value) ? 0 : value
}

/** Increment the counter and return the new value. */
export function incrementGuestUsage() {
  const next = getGuestUsage() + 1
  localStorage.setItem(KEY, String(next))
  return next
}

export function resetGuestUsage() {
  localStorage.removeItem(KEY)
}

export function hasReachedGuestLimit() {
  return getGuestUsage() >= GUEST_LIMIT
}
