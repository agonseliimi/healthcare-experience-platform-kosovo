// Central API client for the Spring Boot backend.
//
// All functions talk to http://localhost:5000/api and automatically attach the
// JWT token (if present) from localStorage. Every call is wrapped so callers get
// a clean Error with a readable message, even when the backend is offline.

const BASE_URL = 'http://localhost:5000/api'

const TOKEN_KEY = 'healthcare_token'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
}

/**
 * Low-level request helper.
 * Adds JSON headers + Authorization, parses the response, and throws a friendly
 * Error on failure. If the backend is unreachable, a clear message is thrown.
 */
async function request(path, { method = 'GET', body, auth = true } = {}) {
  const headers = { 'Content-Type': 'application/json' }

  const token = getToken()
  if (auth && token) {
    headers.Authorization = `Bearer ${token}`
  }

  let response
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch (networkError) {
    // Backend not running / CORS / DNS, etc.
    throw new Error(
      'Cannot reach the server. Please make sure the backend is running on http://localhost:5000.'
    )
  }

  // 204 No Content
  if (response.status === 204) return null

  let data = null
  const text = await response.text()
  if (text) {
    try {
      data = JSON.parse(text)
    } catch {
      data = text
    }
  }

  if (!response.ok) {
    const message =
      (data && data.message) ||
      (typeof data === 'string' && data) ||
      `Request failed (${response.status})`
    throw new Error(message)
  }

  return data
}

// ---------------- Auth ----------------
export const registerUser = (data) => request('/auth/register', { method: 'POST', body: data, auth: false })
export const loginUser = (data) => request('/auth/login', { method: 'POST', body: data, auth: false })
export const getMe = () => request('/auth/me')

// ------------- Experiences ------------
export function getExperiences(filters = {}) {
  const params = new URLSearchParams()
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, value)
    }
  })
  const query = params.toString()
  return request(`/experiences${query ? `?${query}` : ''}`, { auth: false })
}
export const getMyExperiences = () => request('/experiences/mine')
export const getExperienceById = (id) => request(`/experiences/${id}`, { auth: false })
// Authenticated fetch — lets an owner load their own non-published (e.g. HIDDEN) post for editing.
export const getExperienceForEdit = (id) => request(`/experiences/${id}`)
export const createExperience = (data) => request('/experiences', { method: 'POST', body: data })
export const updateExperience = (id, data) => request(`/experiences/${id}`, { method: 'PUT', body: data })
export const deleteExperience = (id) => request(`/experiences/${id}`, { method: 'DELETE' })
export const voteExperience = (id, type) => request(`/experiences/${id}/vote`, { method: 'POST', body: { type } })

// --------------- Reports --------------
export const createReport = (data) => request('/reports', { method: 'POST', body: data })
export const getReports = () => request('/reports')
export const updateReportStatus = (id, status) => request(`/reports/${id}/status`, { method: 'PATCH', body: { status } })

// ------------ Verification ------------
export const createVerificationRequest = (data) => request('/verification/request', { method: 'POST', body: data })
export const getMyVerificationRequests = () => request('/verification/my')
export const getAllVerificationRequests = () => request('/verification/all')
export const updateVerificationStatus = (id, data) => request(`/verification/${id}/status`, { method: 'PATCH', body: data })

// ---------------- Admin ---------------
export const getAdminDashboard = () => request('/admin/dashboard')
export const getAdminReports = () => request('/admin/reports')
export const getAdminVerificationRequests = () => request('/admin/verification-requests')
export const updateExperienceStatus = (id, status) => request(`/admin/experiences/${id}/status`, { method: 'PATCH', body: { status } })
export const updateUserTrust = (id, trustScore) => request(`/admin/users/${id}/trust`, { method: 'PATCH', body: { trustScore } })
