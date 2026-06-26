import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import SearchPage from './pages/SearchPage'
import SubmitPage from './pages/SubmitPage'
import PrivacyPage from './pages/PrivacyPage'
import './styles/global.css'

/**
 * App.jsx — Root application component.
 *
 * Defines the page routing structure:
 *   /          → Home page
 *   /search    → Browse / search experiences
 *   /submit    → Submit an anonymous experience
 *   /privacy   → Trust & privacy explanation
 *
 * Navbar and Footer appear on every page.
 *
 * FUTURE: Add authentication routes here (login, register, profile).
 */
function App() {
  return (
    <div className="app-shell">
      <Navbar />

      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/submit" element={<SubmitPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
        </Routes>
      </main>

      <Footer />
    </div>
  )
}

export default App
