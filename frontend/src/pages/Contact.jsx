import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { sendFeedback } from '../api/api'

const initialForm = { name: '', email: '', message: '' }
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Public, privacy-conscious contact form backed by the Spring email endpoint. */
function Contact() {
  const { t } = useTranslation()
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [status, setStatus] = useState(null)

  function set(key, value) {
    setForm((previous) => ({ ...previous, [key]: value }))
    setErrors((previous) => ({ ...previous, [key]: undefined }))
    setStatus(null)
  }

  function validate() {
    const next = {}
    const name = form.name.trim()
    const email = form.email.trim()
    const message = form.message.trim()

    if (name.length > 100) next.name = t('contact.nameTooLong')
    if (email && !EMAIL_PATTERN.test(email)) next.email = t('contact.invalidEmail')
    if (email.length > 254) next.email = t('contact.invalidEmail')
    if (message.length < 10) next.message = t('contact.messageTooShort')
    if (message.length > 3000) next.message = t('contact.messageTooLong')

    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (submitting || !validate()) return

    setSubmitting(true)
    setStatus(null)
    try {
      await sendFeedback({
        name: form.name.trim() || null,
        email: form.email.trim() || null,
        message: form.message.trim(),
      })
      setForm(initialForm)
      setErrors({})
      setStatus('success')
    } catch {
      setStatus('error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="page narrow">
      <header className="page-head">
        <h1 className="page-title">{t('contact.title')}</h1>
        <p className="page-sub">{t('contact.helper')}</p>
      </header>

      <form className="form card form-card contact-card" onSubmit={handleSubmit} noValidate>
        {status === 'success' && <div className="alert alert-success" role="status">{t('contact.success')}</div>}
        {status === 'error' && <div className="alert alert-error" role="alert">{t('contact.failure')}</div>}

        <div className="form-group">
          <label className="form-label" htmlFor="contact-name">
            {t('contact.name')} <span className="form-optional">{t('contact.optional')}</span>
          </label>
          <input id="contact-name" className="form-input" type="text" maxLength={100}
            value={form.name} onChange={(event) => set('name', event.target.value)}
            autoComplete="name" aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'contact-name-error' : undefined} />
          {errors.name && <span id="contact-name-error" className="field-error">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="contact-email">
            {t('contact.email')} <span className="form-optional">{t('contact.optional')}</span>
          </label>
          <input id="contact-email" className="form-input" type="email" maxLength={254}
            value={form.email} onChange={(event) => set('email', event.target.value)}
            autoComplete="email" aria-invalid={Boolean(errors.email)} aria-describedby="contact-email-hint contact-email-error" />
          <span id="contact-email-hint" className="form-hint">{t('contact.emailHint')}</span>
          {errors.email && <span id="contact-email-error" className="field-error">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="contact-message">{t('contact.message')} *</label>
          <textarea id="contact-message" className="form-textarea" rows={8} maxLength={3000}
            value={form.message} onChange={(event) => set('message', event.target.value)} required
            aria-invalid={Boolean(errors.message)} aria-describedby="contact-message-count contact-message-error" />
          <div className="field-meta">
            {errors.message ? <span id="contact-message-error" className="field-error">{errors.message}</span> : <span />}
            <span id="contact-message-count" className="char-counter">{form.message.length}/3000</span>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary btn-lg" disabled={submitting}>
            {submitting ? t('contact.sending') : t('contact.submit')}
          </button>
        </div>
      </form>
    </div>
  )
}

export default Contact
