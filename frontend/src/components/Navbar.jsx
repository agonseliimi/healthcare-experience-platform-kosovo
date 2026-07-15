import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTranslation } from 'react-i18next'

/**
 * Top navigation bar. Shows different links depending on auth state:
 *   - guest: Home, Search, Privacy, Login, Register
 *   - user:  + Share, Dashboard, Logout
 *   - admin: + Admin
 */
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

  const toggleLanguage = () => {
    const newLang = i18n.language === 'sq' ? 'en' : 'sq'
    i18n.changeLanguage(newLang)
  }

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand" onClick={() => setOpen(false)}>
          <span className="brand-mark" aria-hidden="true">
            <svg width="26" height="26" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="#0EA5E9" />
              <path d="M16 7v18M7 16h18" stroke="white" strokeWidth="3.5" strokeLinecap="round" />
            </svg>
          </span>
          <span className="brand-text">HealthPath <span className="brand-sub">Kosovo</span></span>
        </Link>

        <button
          className="nav-toggle"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span /><span /><span />
        </button>

        <div className={`nav-links ${open ? 'nav-links--open' : ''}`} onClick={() => setOpen(false)}>
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
              <button className="btn btn-ghost btn-sm" onClick={(e) => { e.stopPropagation(); toggleLanguage(); }} title="Toggle Language">
                {i18n.language === 'sq' ? '🇬🇧 EN' : '🇦🇱 SQ'}
              </button>
            </div>
          ) : (
            <div className="nav-auth">
              <span className="nav-user" title={user?.email}>{t('navbar.greeting')}, {user?.displayName}</span>
              <button className="btn btn-ghost btn-sm" onClick={handleLogout}>{t('navbar.logout')}</button>
              <button className="btn btn-ghost btn-sm" onClick={(e) => { e.stopPropagation(); toggleLanguage(); }} title="Toggle Language">
                {i18n.language === 'sq' ? '🇬🇧 EN' : '🇦🇱 SQ'}
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
