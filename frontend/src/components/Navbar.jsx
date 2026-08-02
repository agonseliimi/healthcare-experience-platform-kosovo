import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'
import AccessibilityMenu from './AccessibilityMenu'

/** Two initials for the account chip, e.g. "Blerina Krasniqi" -> "BK". */
function initialsOf(name) {
  if (!name) return '?'
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('')
}

/**
 * Global navigation.
 *
 * The redesign cuts the primary navigation from eight items to three: Privacy
 * and Contact moved to the footer, and Dashboard / Admin / Logout moved into the
 * account menu. Nothing was dropped, only relocated.
 */
function Navbar() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const accountRef = useRef(null)
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()

  function handleLogout() {
    logout()
    setOpen(false)
    setAccountOpen(false)
    navigate('/')
  }

  const linkClass = ({ isActive }) => `nav-link ${isActive ? 'nav-link--active' : ''}`
  const isAlbanian = i18n.language.startsWith('sq')

  function toggleLanguage() {
    i18n.changeLanguage(isAlbanian ? 'en' : 'sq')
  }

  useEffect(() => {
    document.documentElement.lang = i18n.resolvedLanguage?.startsWith('sq') ? 'sq' : 'en'
  }, [i18n.resolvedLanguage])

  // Close the account menu on outside click or Escape.
  useEffect(() => {
    if (!accountOpen) return
    function onPointerDown(event) {
      if (accountRef.current && !accountRef.current.contains(event.target)) setAccountOpen(false)
    }
    function onKeyDown(event) {
      if (event.key === 'Escape') setAccountOpen(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [accountOpen])

  return (
    <nav className="navbar" aria-label={t('accessibility.primaryNavigation')}>
      <div className="navbar-inner">
        <Link to="/" className="brand" onClick={() => setOpen(false)}>
          <span className="brand-mark" aria-hidden="true">
            <svg width="26" height="26" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="var(--primary)" />
              <path d="M16 7v18M7 16h18" stroke="var(--on-primary)" strokeWidth="3.5" strokeLinecap="round" />
            </svg>
          </span>
          <span className="brand-text">HealthPath <span className="brand-sub">Kosovo</span></span>
        </Link>

        <div id="primary-navigation" className={`nav-links ${open ? 'nav-links--open' : ''}`} onClick={() => setOpen(false)}>
          <NavLink to="/" className={linkClass} end>{t('navbar.home')}</NavLink>
          <NavLink to="/search" className={linkClass}>{t('navbar.search')}</NavLink>
          <NavLink to="/submit" className={linkClass}>{t('navbar.share')}</NavLink>
          {isAuthenticated && (
            <NavLink to="/dashboard" className={linkClass}>{t('navbar.dashboard')}</NavLink>
          )}

          {/* Auth actions repeat inside the collapsible panel because the top bar
              has no room for them on a phone. Hidden on desktop via CSS. */}
          <div className="nav-auth-mobile">
            {!isAuthenticated ? (
              <>
                <NavLink to="/login" className="btn btn-secondary btn-sm">{t('navbar.login')}</NavLink>
                <NavLink to="/register" className="btn btn-primary btn-sm">{t('navbar.register')}</NavLink>
              </>
            ) : (
              <>
                {isAdmin && <NavLink to="/admin" className={linkClass}>{t('navbar.admin')}</NavLink>}
                <button className="btn btn-secondary btn-sm" onClick={handleLogout}>{t('navbar.logout')}</button>
              </>
            )}
          </div>
        </div>

        <div className="nav-tools">
          <button className="nav-chip" onClick={toggleLanguage} aria-label={t('accessibility.toggleLanguage')}>
            {isAlbanian ? 'EN' : 'SQ'}
          </button>

          <AccessibilityMenu />

          {!isAuthenticated ? (
            <div className="nav-auth">
              <NavLink to="/login" className="btn btn-secondary btn-sm">{t('navbar.login')}</NavLink>
              <NavLink to="/register" className="btn btn-primary btn-sm">{t('navbar.register')}</NavLink>
            </div>
          ) : (
            <div className="account" ref={accountRef}>
              <button
                className="account-trigger"
                onClick={() => setAccountOpen((current) => !current)}
                aria-expanded={accountOpen}
                aria-haspopup="menu"
              >
                <span className="account-initials" aria-hidden="true">{initialsOf(user?.displayName)}</span>
                <span className="account-name">{user?.displayName}</span>
                <span className="account-caret" aria-hidden="true">▼</span>
              </button>

              {accountOpen && (
                <div className="account-menu" role="menu">
                  {user?.email && <div className="account-email">{user.email}</div>}
                  {/* Dashboard and Share sit in the primary nav now, so they are
                      deliberately not repeated here. */}
                  {isAdmin && (
                    <Link to="/admin" className="account-item" role="menuitem" onClick={() => setAccountOpen(false)}>
                      {t('navbar.admin')}
                    </Link>
                  )}
                  <button className="account-item account-item--danger" role="menuitem" onClick={handleLogout}>
                    {t('navbar.logout')}
                  </button>
                </div>
              )}
            </div>
          )}

          <button
            className="nav-toggle"
            aria-label={t('accessibility.toggleMenu')}
            aria-expanded={open}
            aria-controls="primary-navigation"
            onClick={() => setOpen((current) => !current)}
          >
            <span /><span /><span />
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
