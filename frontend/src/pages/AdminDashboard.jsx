import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getAdminDashboard } from '../api/api'
import LoadingState from '../components/LoadingState'
import ErrorState from '../components/ErrorState'

/** Admin overview with summary metric cards. */
function AdminDashboard() {
  const { t } = useTranslation()
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
    { label: t('adminDash.totalUsers'), value: stats.totalUsers },
    { label: t('adminDash.totalExperiences'), value: stats.totalExperiences },
    { label: t('adminDash.pendingReports'), value: stats.pendingReports },
    { label: t('adminDash.pendingVerifications'), value: stats.pendingVerificationRequests },
    { label: t('adminDash.hiddenExperiences'), value: stats.hiddenExperiences },
    { label: t('adminDash.avgTrust'), value: stats.averageTrustScore },
  ]

  return (
    <div className="page">
      <header className="page-head">
        <h1 className="page-title">{t('adminDash.title')}</h1>
        <p className="page-sub">{t('adminDash.sub')}</p>
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
        <Link to="/admin/reports" className="btn btn-secondary">{t('adminDash.reviewReports')}</Link>
        <Link to="/admin/verification" className="btn btn-secondary">{t('adminDash.reviewVerifications')}</Link>
      </div>
    </div>
  )
}

export default AdminDashboard
