import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

/**
 * Global footer.
 *
 * The redesign reduces this to a single quiet row. It also carries Privacy and
 * Contact, which moved out of the primary navigation.
 */
function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-links">
          <Link to="/privacy" className="footer-link">{t('footer.privacy_link')}</Link>
          <Link to="/contact" className="footer-link">{t('footer.contact')}</Link>
          <Link to="/privacy" className="footer-link">{t('footer.howVerification')}</Link>
        </div>
        <p className="footer-tagline">{t('footer.strip')}</p>
      </div>
    </footer>
  )
}

export default Footer
