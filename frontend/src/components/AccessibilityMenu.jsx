import { useEffect, useId, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAccessibility } from '../context/AccessibilityContext'

const FONT_OPTIONS = [
  { value: 'default', label: 'accessibility.fontDefault', sample: 'A' },
  { value: 'large', label: 'accessibility.fontLarge', sample: 'A+' },
  { value: 'xlarge', label: 'accessibility.fontExtraLarge', sample: 'A++' },
]

function AccessibilityMenu() {
  const { t } = useTranslation()
  const {
    theme,
    fontSize,
    highContrast,
    reduceMotion,
    setTheme,
    setFontSize,
    setHighContrast,
    setReduceMotion,
    resetPreferences,
  } = useAccessibility()
  const [open, setOpen] = useState(false)
  const containerRef = useRef(null)
  const triggerRef = useRef(null)
  const closeRef = useRef(null)
  const panelId = useId()

  useEffect(() => {
    if (!open) return undefined

    closeRef.current?.focus()

    function handlePointerDown(event) {
      if (!containerRef.current?.contains(event.target)) setOpen(false)
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setOpen(false)
        triggerRef.current?.focus()
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  return (
    <div className="accessibility-menu" ref={containerRef}>
      <button
        ref={triggerRef}
        type="button"
        className="accessibility-trigger"
        aria-label={t('accessibility.openSettings')}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((current) => !current)}
      >
        <span aria-hidden="true">Aa</span>
      </button>

      {open && (
        <section id={panelId} className="accessibility-panel" role="dialog" aria-labelledby={`${panelId}-title`}>
          <div className="accessibility-panel-head">
            <div>
              <span className="accessibility-eyebrow">HealthPath</span>
              <h2 id={`${panelId}-title`} className="accessibility-title">{t('accessibility.title')}</h2>
            </div>
            <button
              ref={closeRef}
              type="button"
              className="accessibility-close"
              aria-label={t('accessibility.close')}
              onClick={() => {
                setOpen(false)
                triggerRef.current?.focus()
              }}
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>

          <fieldset className="accessibility-fieldset">
            <legend>{t('accessibility.fontSize')}</legend>
            <div className="font-size-options">
              {FONT_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`font-size-option ${fontSize === option.value ? 'is-active' : ''}`}
                  aria-pressed={fontSize === option.value}
                  onClick={() => setFontSize(option.value)}
                >
                  <span className={`font-sample font-sample--${option.value}`} aria-hidden="true">{option.sample}</span>
                  <span>{t(option.label)}</span>
                </button>
              ))}
            </div>
          </fieldset>

          <div className="accessibility-switches">
            <label className="accessibility-switch-row">
              <span><strong>{t('accessibility.darkMode')}</strong><small>{t('accessibility.darkModeHint')}</small></span>
              <input type="checkbox" role="switch" checked={theme === 'dark'}
                onChange={(event) => setTheme(event.target.checked ? 'dark' : 'light')} />
              <span className="switch-control" aria-hidden="true" />
            </label>

            <label className="accessibility-switch-row">
              <span><strong>{t('accessibility.highContrast')}</strong><small>{t('accessibility.highContrastHint')}</small></span>
              <input type="checkbox" role="switch" checked={highContrast}
                onChange={(event) => setHighContrast(event.target.checked)} />
              <span className="switch-control" aria-hidden="true" />
            </label>

            <label className="accessibility-switch-row">
              <span><strong>{t('accessibility.reduceMotion')}</strong><small>{t('accessibility.reduceMotionHint')}</small></span>
              <input type="checkbox" role="switch" checked={reduceMotion}
                onChange={(event) => setReduceMotion(event.target.checked)} />
              <span className="switch-control" aria-hidden="true" />
            </label>
          </div>

          <button type="button" className="accessibility-reset" onClick={resetPreferences}>
            {t('accessibility.reset')}
          </button>
        </section>
      )}
    </div>
  )
}

export default AccessibilityMenu
