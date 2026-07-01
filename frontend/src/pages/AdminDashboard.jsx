import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getAdminDashboard } from '../api/api'
import LoadingState from '../components/LoadingState'
import ErrorState from '../components/ErrorState'

/** Admin overview with summary metric cards. */
function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      setStats(await getAdminDashboard())
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  if (loading) return <div className="page"><LoadingState /></div>
  if (error) return <div className="page"><ErrorState message={error} onRetry={load} /></div>

  const cards = [
    { label: 'Total users', value: stats.totalUsers },
    { label: 'Total experiences', value: stats.totalExperiences },
    { label: 'Pending reports', value: stats.pendingReports },
    { label: 'Pending verifications', value: stats.pendingVerificationRequests },
    { label: 'Hidden experiences', value: stats.hiddenExperiences },
    { label: 'Average trust score', value: stats.averageTrustScore },
  ]

  return (
    <div className="page">
      <header className="page-head">
        <h1 className="page-title">Admin Dashboard</h1>
        <p className="page-sub">Platform overview and moderation shortcuts.</p>
      </header>

      <div className="admin-grid">
        {cards.map((c) => (
          <div key={c.label} className="card admin-stat">
            <span className="admin-stat-value">{c.value}</span>
            <span className="admin-stat-label">{c.label}</span>
          </div>
        ))}
      </div>

      <div className="admin-links">
        <Link to="/admin/reports" className="btn btn-secondary">Review Reports</Link>
        <Link to="/admin/verification" className="btn btn-secondary">Review Verifications</Link>
      </div>
    </div>
  )
}

export default AdminDashboard
