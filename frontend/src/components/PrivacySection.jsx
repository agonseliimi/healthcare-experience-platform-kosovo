import { useTranslation } from 'react-i18next'

/**
 * Reusable privacy/trust explanation content used by the Privacy page.
 *
 * Two verification levels, matching what the rest of the UI now shows.
 * The document policy here describes what the app actually does: uploaded
 * evidence IS published, after the author blurs identifying areas with the
 * built-in tool and a moderator reviews it.
 */
function PrivacySection() {
  const { t } = useTranslation()
  const neverPublished = [
    t('privacyPage.notShare1'),
    t('privacyPage.notShare2'),
    t('privacyPage.notShare3'),
    t('privacyPage.notShare4'),
    t('privacyPage.notShare5'),
    t('privacyPage.notShare6'),
  ]

  return (
    <div className="privacy">
      <section className="privacy-block">
        <h2>{t('privacyPage.anonModeTitle')}</h2>
        <p>{t('privacyPage.anonModeText')}</p>
      </section>

      <section className="privacy-block">
        <h2>{t('privacyPage.notShareTitle')}</h2>
        <div className="privacy-tags">
          {neverPublished.map((item) => (
            <span className="privacy-tag" key={item}>{item}</span>
          ))}
        </div>
        <p style={{ marginTop: 11 }}>{t('privacyPage.notShareNote')}</p>
      </section>

      <section className="privacy-block">
        <h2>{t('privacyPage.documentsTitle')}</h2>
        <p>{t('privacyPage.documentsText')}</p>
      </section>

      <section className="privacy-block">
        <h2>{t('privacyPage.levelsTitle')}</h2>
        <div className="privacy-levels">
          <div className="privacy-level">
            <span className="privacy-level-dot privacy-level-dot--self" />
            <div>
              <div className="privacy-level-t">{t('privacyPage.levelSelfTitle')}</div>
              <p className="privacy-level-p">{t('privacyPage.levelSelfText')}</p>
            </div>
          </div>
          <div className="privacy-level">
            <span className="privacy-level-dot privacy-level-dot--doc" />
            <div>
              <div className="privacy-level-t">{t('privacyPage.levelDocTitle')}</div>
              <p className="privacy-level-p">{t('privacyPage.levelDocText')}</p>
            </div>
          </div>
        </div>
        <p style={{ marginTop: 13 }}>{t('privacyPage.trustText')}</p>
      </section>

      <section className="privacy-block">
        <h2>{t('privacyPage.abuseTitle')}</h2>
        <p>{t('privacyPage.abuseText')}</p>
      </section>

      <section className="privacy-block">
        <h2>{t('privacyPage.removingTitle')}</h2>
        <p>{t('privacyPage.removingText')}</p>
      </section>

      <section className="privacy-block">
        <h2>{t('privacyPage.limitsTitle')}</h2>
        <div className="privacy-tags">
          <span className="privacy-tag">{t('privacyPage.limit1')}</span>
          <span className="privacy-tag">{t('privacyPage.limit2')}</span>
          <span className="privacy-tag">{t('privacyPage.limit3')}</span>
        </div>
      </section>
    </div>
  )
}

export default PrivacySection
