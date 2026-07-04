import { useTranslation } from 'react-i18next'
import PrivacySection from '../components/PrivacySection'

/** Trust & Privacy page. */
function Privacy() {
  const { t } = useTranslation()
  return (
    <div className="page narrow">
      <header className="page-head">
        <h1 className="page-title">{t('privacyPage.title')}</h1>
        <p className="page-sub">{t('privacyPage.sub')}</p>
      </header>
      <PrivacySection />
    </div>
  )
}

export default Privacy
