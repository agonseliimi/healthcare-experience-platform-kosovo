import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import '../styles/Navbar.css'

/**
 * Navbar component — appears on every page.
 *
 * Provides navigation between main sections:
 *   Home, Search Experiences, Share Experience, Privacy & Trust
 *
 * Includes a mobile hamburger menu for small screens.
 *
 * FUTURE: Show logged-in user avatar/name here once authentication is added.
 */
function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/search', label: 'Search' },
    { to: '/submit', label: 'Share Experience' },
    { to: '/privacy', label: 'Privacy & Trust' },
  ]

  // Highlight the active link based on current URL path
  const isActive = (path) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="navbar-inner">
        {/* Brand / Logo */}
        <Link to="/" className="navbar-brand" onClick={() => setMenuOpen(false)}>
          <span className="navbar-logo-icon" aria-hidden="true">
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="#0EA5E9" />
              <path d="M16 7v18M7 16h18" stroke="white" strokeWidth="3.5" strokeLinecap="round" />
            </svg>
          </span>
          <span className="navbar-brand-text">
            HealthPath <span className="navbar-brand-sub">Kosovo</span>
          </span>
        </Link>

        {/* Desktop nav links */}
        <ul className="navbar-links" role="list">
          {navLinks.map((link) => (
            <li key={link.to}>
              <Link
                to={link.to}
                className={`navbar-link ${isActive(link.to) ? 'navbar-link--active' : ''}`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile hamburger button */}
        <button
          className="navbar-hamburger"
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className={`hamburger-bar ${menuOpen ? 'open' : ''}`} />
          <span className={`hamburger-bar ${menuOpen ? 'open' : ''}`} />
          <span className={`hamburger-bar ${menuOpen ? 'open' : ''}`} />
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="navbar-mobile-menu" role="menu">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`navbar-mobile-link ${isActive(link.to) ? 'navbar-link--active' : ''}`}
              onClick={() => setMenuOpen(false)}
              role="menuitem"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}

export default Navbar
