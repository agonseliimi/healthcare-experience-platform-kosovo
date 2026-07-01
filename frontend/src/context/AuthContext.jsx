import { createContext, useContext, useEffect, useState } from 'react'
import { clearToken, getMe, getToken, loginUser, registerUser, setToken } from '../api/api'
import { resetGuestUsage } from '../utils/guestUsage'

/**
 * AuthContext holds the current user and auth actions (login/register/logout).
 * It restores the session on load by calling /auth/me if a token exists.
 */
const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // On first load, if we have a token, try to fetch the current user.
  useEffect(() => {
    async function restore() {
      if (!getToken()) {
        setLoading(false)
        return
      }
      try {
        const me = await getMe()
        setUser(me)
      } catch {
        // Token invalid/expired or backend offline.
        clearToken()
      } finally {
        setLoading(false)
      }
    }
    restore()
  }, [])

  async function login(credentials) {
    const res = await loginUser(credentials)
    setToken(res.token)
    // /auth/me returns the richer profile (counts, trust label).
    const me = await getMe()
    setUser(me)
    resetGuestUsage() // logged-in users are no longer guests
    return me
  }

  async function register(data) {
    const res = await registerUser(data)
    setToken(res.token)
    const me = await getMe()
    setUser(me)
    resetGuestUsage()
    return me
  }

  function logout() {
    clearToken()
    setUser(null)
  }

  /** Re-fetch the current user (e.g. after trust score changes). */
  async function refreshUser() {
    if (!getToken()) return
    try {
      const me = await getMe()
      setUser(me)
    } catch {
      // ignore
    }
  }

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ADMIN',
    login,
    register,
    logout,
    refreshUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
