import { useTranslation } from 'react-i18next'
import SubmitExperienceForm from '../components/SubmitExperienceForm'

/** Protected page wrapper for the submission form. */
function SubmitExperience() {
  const { t } = useTranslation()
  return (
    <div className="page narrow">
      <header className="page-head">
        <h1 className="page-title">{t('submit.pageTitle')}</h1>
        <p className="page-sub">{t('submit.pageSub')}</p>
      </header>
      <SubmitExperienceForm />
    </div>
  )
}

export default SubmitExperience
