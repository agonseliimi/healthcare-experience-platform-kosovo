// Finds journeys a reader is likely to want next.
//
// Symptoms come first, because that is how people arrive: someone with chest
// pain wants other chest-pain journeys, whatever speciality they ended up in.
// Speciality and city act as a fallback so the panel is never empty for a
// journey whose author recorded no symptoms.

function normalise(value) {
  return String(value ?? '').trim().toLowerCase()
}

/**
 * Scores one candidate against the journey being viewed.
 * Shared symptoms dominate; speciality and city only break ties.
 */
function score(current, candidate) {
  const mine = new Set((current.symptoms ?? []).map(normalise).filter(Boolean))
  const theirs = (candidate.symptoms ?? []).map(normalise).filter(Boolean)
  const sharedSymptoms = theirs.filter((symptom) => mine.has(symptom)).length

  let points = sharedSymptoms * 10
  if (normalise(candidate.category) === normalise(current.category)) points += 3
  if (normalise(candidate.city) === normalise(current.city)) points += 1

  return points
}

/**
 * @param current the journey being viewed
 * @param all     every journey we have loaded
 * @param limit   how many to return
 */
export function findSimilarJourneys(current, all, limit = 3) {
  if (!current || !Array.isArray(all)) return []

  return all
    .filter((candidate) => candidate.id !== current.id)
    .map((candidate) => ({ candidate, points: score(current, candidate) }))
    .filter(({ points }) => points > 0)
    .sort((a, b) => b.points - a.points || (b.candidate.likes ?? 0) - (a.candidate.likes ?? 0))
    .slice(0, limit)
    .map(({ candidate }) => candidate)
}
