import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'

/** Login page. On success, saves the JWT and redirects. */
function Login() {
  const { t } = useTranslation()
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = location.state?.from || '/dashboard'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await login({ email, password })
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setError(err.message)
      setSubmitting(false)
    }
  }

  return (
    <div className="page auth-page">
      <div className="card auth-card">
        <h1 className="auth-title">{t('auth.welcomeBack')}</h1>
        <p className="auth-sub">{t('auth.loginSub')}</p>

        {error && <div className="alert alert-error">{error}</div>}

        <form className="form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="login-email">{t('auth.email')}</label>
            <input id="login-email" type="email" className="form-input" value={email}
              onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="login-password">{t('auth.password')}</label>
            <input id="login-password" type="password" className="form-input" value={password}
              onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
          </div>
          <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={submitting}>
            {submitting ? t('auth.loggingIn') : t('auth.login')}
          </button>
        </form>

        <p className="auth-alt">
          {t('auth.noAccount')} <Link to="/register" className="link">{t('auth.createOne')}</Link>
        </p>

        <div className="demo-note">
          <strong>{t('auth.demoAccounts')}</strong>
          <div>admin@healthcare-demo.local / Admin123!</div>
          <div>user1@healthcare-demo.local / User123!</div>
        </div>
      </div>
    </div>
  )
}

export default Login
