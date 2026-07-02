import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getExperienceForEdit } from '../api/api'
import SubmitExperienceForm from '../components/SubmitExperienceForm'
import LoadingState from '../components/LoadingState'
import ErrorState from '../components/ErrorState'

/**
 * Protected page for editing an experience the current user owns.
 *
 * Loads the experience with the authenticated endpoint so owners can also edit
 * their own non-published (e.g. HIDDEN) posts. The backend enforces that only
 * the owner (or an admin) may actually save changes.
 */
function EditExperience() {
  const { id } = useParams()
  const [experience, setExperience] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      setExperience(await getExperienceForEdit(id))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [id])

  return (
    <div className="page narrow">
      <header className="page-head">
        <h1 className="page-title">Edit Your Experience</h1>
        <p className="page-sub">
          Update the details below. Changes stay anonymous by default and never include
          personal identifiers.
        </p>
      </header>

      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message={error} onRetry={load} />
      ) : (
        <SubmitExperienceForm experience={experience} />
      )}
    </div>
  )
}

export default EditExperience
