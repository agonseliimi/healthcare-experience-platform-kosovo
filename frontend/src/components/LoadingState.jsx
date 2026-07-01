/** Simple, reusable loading indicator. */
function LoadingState({ message = 'Loading...' }) {
  return (
    <div className="state-box" role="status" aria-live="polite">
      <div className="spinner" aria-hidden="true" />
      <p className="state-text">{message}</p>
    </div>
  )
}

export default LoadingState
