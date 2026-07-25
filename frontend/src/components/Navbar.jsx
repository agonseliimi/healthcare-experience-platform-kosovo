import { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'
import AccessibilityMenu from './AccessibilityMenu'

/** Global navigation with authentication, language, and accessibility controls. */
function Navbar() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()

  function handleLogout() {
    logout()
    setOpen(false)
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
          {isAuthenticated && <NavLink to="/submit" className={linkClass}>{t('navbar.share')}</NavLink>}
          <NavLink to="/privacy" className={linkClass}>{t('navbar.privacy')}</NavLink>
          <NavLink to="/contact" className={linkClass}>{t('navbar.contact')}</NavLink>
          {isAuthenticated && <NavLink to="/dashboard" className={linkClass}>{t('navbar.dashboard')}</NavLink>}
          {isAdmin && <NavLink to="/admin" className={linkClass}>{t('navbar.admin')}</NavLink>}

          {!isAuthenticated ? (
            <div className="nav-auth">
              <NavLink to="/login" className="btn btn-ghost btn-sm">{t('navbar.login')}</NavLink>
              <NavLink to="/register" className="btn btn-primary btn-sm">{t('navbar.register')}</NavLink>
              <button className="btn btn-ghost btn-sm" onClick={(event) => { event.stopPropagation(); toggleLanguage() }}
                aria-label={t('accessibility.toggleLanguage')}>
                {isAlbanian ? 'EN' : 'SQ'}
              </button>
            </div>
          ) : (
            <div className="nav-auth">
              <span className="nav-user" title={user?.email}>{t('navbar.greeting')}, {user?.displayName}</span>
              <button className="btn btn-ghost btn-sm" onClick={handleLogout}>{t('navbar.logout')}</button>
              <button className="btn btn-ghost btn-sm" onClick={(event) => { event.stopPropagation(); toggleLanguage() }}
                aria-label={t('accessibility.toggleLanguage')}>
                {isAlbanian ? 'EN' : 'SQ'}
              </button>
            </div>
          )}
        </div>

        <div className="nav-tools">
          <AccessibilityMenu />
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
