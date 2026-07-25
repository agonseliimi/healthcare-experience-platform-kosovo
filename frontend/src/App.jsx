import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'

import Home from './pages/Home'
import Search from './pages/Search'
import ExperienceDetails from './pages/ExperienceDetails'
import SubmitExperience from './pages/SubmitExperience'
import EditExperience from './pages/EditExperience'
import Privacy from './pages/Privacy'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import AdminDashboard from './pages/AdminDashboard'
import AdminReports from './pages/AdminReports'
import AdminVerification from './pages/AdminVerification'
import { useTranslation } from 'react-i18next'

/**
 * App shell + route table.
 *
 * Public:     /, /search, /experiences/:id, /privacy, /contact, /login, /register
 * Protected:  /submit, /experiences/:id/edit, /dashboard
 * Admin only: /admin, /admin/reports, /admin/verification
 */
function App() {
  const { t } = useTranslation()

  function skipToMainContent(event) {
    event.preventDefault()
    const main = document.getElementById('main-content')
    if (!main) return

    main.focus({ preventScroll: true })
    main.scrollIntoView({ block: 'start' })
    window.history.replaceState(null, '', '#main-content')
  }

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content" onClick={skipToMainContent}>
        {t('accessibility.skipToContent')}
      </a>
      <Navbar />
      <main id="main-content" className="main" tabIndex="-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/experiences/:id" element={<ExperienceDetails />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/submit" element={<ProtectedRoute><SubmitExperience /></ProtectedRoute>} />
          <Route path="/experiences/:id/edit" element={<ProtectedRoute><EditExperience /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/reports" element={<AdminRoute><AdminReports /></AdminRoute>} />
          <Route path="/admin/verification" element={<AdminRoute><AdminVerification /></AdminRoute>} />

          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
