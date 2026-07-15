import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

/** Global footer with the required medical disclaimer. */
function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-disclaimer">
          {t('footer.disclaimer')}
        </div>

        <div className="footer-grid">
          <div>
            <span className="footer-brand">HealthPath Kosovo</span>
            <p className="footer-tagline">{t('footer.tagline')}</p>
            <p className="footer-note">{t('footer.note')}</p>
          </div>
          <div>
            <h4 className="footer-heading">{t('footer.explore')}</h4>
            <Link to="/" className="footer-link">{t('footer.home')}</Link>
            <Link to="/search" className="footer-link">{t('footer.search')}</Link>
            <Link to="/privacy" className="footer-link">{t('footer.privacy_link')}</Link>
            <Link to="/contact" className="footer-link">{t('footer.contact')}</Link>
          </div>
          <div>
            <h4 className="footer-heading">{t('footer.privacy_header')}</h4>
            <span className="footer-item">{t('footer.privacy_item1')}</span>
            <span className="footer-item">{t('footer.privacy_item2')}</span>
            <span className="footer-item">{t('footer.privacy_item3')}</span>
          </div>
        </div>

        <div className="footer-bottom">
          &copy; {new Date().getFullYear()} {t('footer.copyright')}
        </div>
      </div>
    </footer>
  )
}

export default Footer
