import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

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

  function handleLogout() {
    logout()
    setOpen(false)
    navigate('/')
  }

  const linkClass = ({ isActive }) => `nav-link ${isActive ? 'nav-link--active' : ''}`

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
          <NavLink to="/" className={linkClass} end>Home</NavLink>
          <NavLink to="/search" className={linkClass}>Search</NavLink>
          {isAuthenticated && <NavLink to="/submit" className={linkClass}>Share Experience</NavLink>}
          <NavLink to="/privacy" className={linkClass}>Privacy</NavLink>
          {isAuthenticated && <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>}
          {isAdmin && <NavLink to="/admin" className={linkClass}>Admin</NavLink>}

          {!isAuthenticated ? (
            <div className="nav-auth">
              <NavLink to="/login" className="btn btn-ghost btn-sm">Login</NavLink>
              <NavLink to="/register" className="btn btn-primary btn-sm">Register</NavLink>
            </div>
          ) : (
            <div className="nav-auth">
              <span className="nav-user" title={user?.email}>Hi, {user?.displayName}</span>
              <button className="btn btn-ghost btn-sm" onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
