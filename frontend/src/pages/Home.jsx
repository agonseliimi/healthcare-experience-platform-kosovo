import { Link } from 'react-router-dom'
import Hero from '../components/Hero'
import { useTranslation } from 'react-i18next'

/** Landing page: hero, how it works, and feature cards. */
function Home() {
  const { t } = useTranslation()
  const steps = [
    t('homePage.step1'),
    t('homePage.step2'),
    t('homePage.step3'),
    t('homePage.step4'),
    t('homePage.step5'),
  ]

  const features = [
    { title: t('homePage.f1Title'), text: t('homePage.f1Text') },
    { title: t('homePage.f2Title'), text: t('homePage.f2Text') },
    { title: t('homePage.f3Title'), text: t('homePage.f3Text') },
    { title: t('homePage.f4Title'), text: t('homePage.f4Text') },
    { title: t('homePage.f5Title'), text: t('homePage.f5Text') },
    { title: t('homePage.f6Title'), text: t('homePage.f6Text') },
    { title: t('homePage.f7Title'), text: t('homePage.f7Text') },
    { title: t('homePage.f8Title'), text: t('homePage.f8Text') },
  ]

  return (
    <div className="page home">
      <Hero />

      <section className="section">
        <h2 className="section-title">{t('homePage.howItWorks')}</h2>
        <ol className="steps">
          {steps.map((s, i) => (
            <li key={i} className="step">
              <span className="step-num">{i + 1}</span>
              <span>{s}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="section">
        <h2 className="section-title">{t('homePage.why')}</h2>
        <div className="feature-grid">
          {features.map((f) => (
            <div key={f.title} className="card feature">
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-text">{f.text}</p>
            </div>
          ))}
        </div>
        <div className="center">
          <Link to="/search" className="btn btn-primary btn-lg">{t('homePage.browseBtn')}</Link>
        </div>
      </section>
    </div>
  )
}

export default Home
