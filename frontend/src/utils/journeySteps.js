// Journeys are stored as one free-text field (`stepsTaken`), but the redesign
// shows them as numbered steps. Authors separate steps with an arrow — the form
// placeholder suggests "→" and the seeded data uses "->", so both are accepted.

const STEP_SEPARATOR = /\s*(?:→|->|—>|>>)\s*/

/**
 * Splits a stepsTaken string into individual steps.
 * Returns [] for empty input, so callers can simply check `.length`.
 */
export function parseJourneySteps(stepsTaken) {
  if (!stepsTaken || typeof stepsTaken !== 'string') return []
  return stepsTaken
    .split(STEP_SEPARATOR)
    .map((step) => step.trim().replace(/[.;,]+$/, ''))
    .filter(Boolean)
}

/** True when the author actually used separators, i.e. we can render a timeline. */
export function hasMultipleSteps(stepsTaken) {
  return parseJourneySteps(stepsTaken).length > 1
}
