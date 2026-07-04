import { useTranslation } from 'react-i18next'

/**
 * Reusable privacy/trust explanation content used by the Privacy page.
 */
function PrivacySection() {
  const { t } = useTranslation()
  return (
    <div className="privacy">
      <div className="alert alert-warning privacy-banner">
        <strong>{t('privacyPage.banner1')}</strong> {t('privacyPage.banner2')}
      </div>

      <section className="privacy-block card">
        <h2>{t('privacyPage.anonModeTitle')}</h2>
        <p>{t('privacyPage.anonModeText')}</p>
      </section>

      <section className="privacy-block card">
        <h2>{t('privacyPage.notShareTitle')}</h2>
        <ul className="bullet">
          <li>{t('privacyPage.notShare1')}</li>
          <li>{t('privacyPage.notShare2')}</li>
          <li>{t('privacyPage.notShare3')}</li>
          <li>{t('privacyPage.notShare4')}</li>
          <li>{t('privacyPage.notShare5')}</li>
          <li>{t('privacyPage.notShare6')}</li>
        </ul>
        <p>{t('privacyPage.notShareNote')}</p>
      </section>

      <section className="privacy-block card">
        <h2>{t('privacyPage.verifyTitle')}</h2>
        <p>{t('privacyPage.verifyText')}</p>
      </section>

      <section className="privacy-block card">
        <h2>{t('privacyPage.levelsTitle')}</h2>
        <div className="levels">
          <div className="level">
            <span className="dot" style={{ background: '#F59E0B' }} />
            <div><strong>{t('privacyPage.levelSelfTitle')}</strong><p>{t('privacyPage.levelSelfText')}</p></div>
          </div>
          <div className="level">
            <span className="dot" style={{ background: '#3B82F6' }} />
            <div><strong>{t('privacyPage.levelDocTitle')}</strong><p>{t('privacyPage.levelDocText')}</p></div>
          </div>
          <div className="level">
            <span className="dot" style={{ background: '#10B981' }} />
            <div><strong>{t('privacyPage.levelHighTitle')}</strong><p>{t('privacyPage.levelHighText')}</p></div>
          </div>
        </div>
      </section>

      <section className="privacy-block card">
        <h2>{t('privacyPage.trustTitle')}</h2>
        <p>{t('privacyPage.trustText')}</p>
      </section>

      <section className="privacy-block card">
        <h2>{t('privacyPage.abuseTitle')}</h2>
        <p>{t('privacyPage.abuseText')}</p>
      </section>

      <section className="privacy-block card">
        <h2>{t('privacyPage.limitsTitle')}</h2>
        <ul className="bullet">
          <li>{t('privacyPage.limit1')}</li>
          <li>{t('privacyPage.limit2')}</li>
          <li>{t('privacyPage.limit3')}</li>
        </ul>
      </section>
    </div>
  )
}

export default PrivacySection
