import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Hero from '../components/Hero'
import ExperienceCard from '../components/ExperienceCard'
import { getExperiences } from '../api/api'
import { useTranslation } from 'react-i18next'

const RECENT_COUNT = 2

/** Landing page: hero, how it works, and a sample of recent journeys. */
function Home() {
  const { t } = useTranslation()
  const [recent, setRecent] = useState([])
  const [total, setTotal] = useState(0)

  // Best-effort only: if the backend is down the rest of the page still renders.
  useEffect(() => {
    let cancelled = false
    getExperiences({})
      .then((data) => {
        if (cancelled || !Array.isArray(data)) return
        setTotal(data.length)
        setRecent(data.slice(0, RECENT_COUNT))
      })
      .catch(() => {})
    return () => { cancelled = true }
  }, [])

  const steps = [
    { title: t('homePage.step1Title'), text: t('homePage.step1Text') },
    { title: t('homePage.step2Title'), text: t('homePage.step2Text') },
    { title: t('homePage.step3Title'), text: t('homePage.step3Text') },
  ]

  return (
    <div className="page home">
      <Hero />

      <section className="section">
        <ol className="steps">
          {steps.map((step, i) => (
            <li key={step.title} className="step">
              <span className="step-num">{i + 1}</span>
              <div className="step-title">{step.title}</div>
              <p className="step-text">{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {recent.length > 0 && (
        <section className="section">
          <div className="home-band">
            <h2>{t('homePage.recentlyShared')}</h2>
            <Link to="/search" className="link">
              {t('homePage.allJourneys', { count: total })}
            </Link>
          </div>
          <div className="recent-grid">
            {recent.map((exp) => (
              <ExperienceCard key={exp.id} experience={exp} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

export default Home
