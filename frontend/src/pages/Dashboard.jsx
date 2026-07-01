import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getMyExperiences, getMyVerificationRequests } from '../api/api'
import { useAuth } from '../context/AuthContext'
import { INSTITUTION_LABELS, VERIFICATION_LABELS } from '../components/ExperienceCard'
import TrustBadge from '../components/TrustBadge'
import LoadingState from '../components/LoadingState'
import ErrorState from '../components/ErrorState'

/** User dashboard: profile stats, own experiences, and verification requests. */
function Dashboard() {
  const { user } = useAuth()
  const [experiences, setExperiences] = useState([])
  const [verifications, setVerifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const [exps, verifs] = await Promise.all([getMyExperiences(), getMyVerificationRequests()])
      setExperiences(exps)
      setVerifications(verifs)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  return (
    <div className="page">
      <header className="page-head">
        <h1 className="page-title">Welcome, {user?.displayName}</h1>
        <p className="page-sub">Your contributions and community standing.</p>
      </header>

      <div className="stat-cards">
        <div className="card stat">
          <span className="stat-label">Trust</span>
          <TrustBadge score={user?.trustScore} label={user?.trustLabel} />
        </div>
        <div className="card stat"><span className="stat-label">Likes received</span><span className="stat-num">{user?.likesReceived ?? 0}</span></div>
        <div className="card stat"><span className="stat-label">Dislikes received</span><span className="stat-num">{user?.dislikesReceived ?? 0}</span></div>
        <div className="card stat"><span className="stat-label">Reports received</span><span className="stat-num">{user?.reportsReceived ?? 0}</span></div>
      </div>

      <div className="center dash-cta">
        <Link to="/submit" className="btn btn-primary">+ Submit New Experience</Link>
      </div>

      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message={error} onRetry={load} />
      ) : (
        <>
          <section className="section">
            <h2 className="section-title">My experiences ({experiences.length})</h2>
            {experiences.length === 0 ? (
              <p className="muted">You have not submitted any experiences yet.</p>
            ) : (
              <div className="table-wrap">
                <table className="table">
                  <thead>
                    <tr><th>Category</th><th>Institution</th><th>City</th><th>Status</th><th>Verification</th><th>Likes</th><th></th></tr>
                  </thead>
                  <tbody>
                    {experiences.map((e) => (
                      <tr key={e.id}>
                        <td>{e.category}</td>
                        <td>{INSTITUTION_LABELS[e.institutionType]}</td>
                        <td>{e.city}</td>
                        <td><span className={`status status--${e.status}`}>{e.status}</span></td>
                        <td>{VERIFICATION_LABELS[e.verificationLevel]}</td>
                        <td>{e.likes}</td>
                        <td><Link className="link" to={`/experiences/${e.id}`}>View</Link></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section className="section">
            <h2 className="section-title">My verification requests ({verifications.length})</h2>
            {verifications.length === 0 ? (
              <p className="muted">No verification requests yet.</p>
            ) : (
              <div className="table-wrap">
                <table className="table">
                  <thead>
                    <tr><th>Experience</th><th>Note</th><th>Status</th><th>Admin note</th></tr>
                  </thead>
                  <tbody>
                    {verifications.map((v) => (
                      <tr key={v.id}>
                        <td>{v.experienceCategory || `#${v.experienceId}`}</td>
                        <td>{v.documentNote || '—'}</td>
                        <td><span className={`status status--${v.status}`}>{v.status}</span></td>
                        <td>{v.adminNote || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  )
}

export default Dashboard
