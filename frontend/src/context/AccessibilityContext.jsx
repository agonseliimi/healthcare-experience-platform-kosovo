import { createContext, useContext, useLayoutEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'healthpath_accessibility_preferences'

const AccessibilityContext = createContext(null)

function systemDefaults() {
  return {
    theme: window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
    fontSize: 'default',
    highContrast: false,
    reduceMotion: window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false,
  }
}

function loadPreferences() {
  const defaults = systemDefaults()

  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
    if (!saved || typeof saved !== 'object') return defaults

    return {
      theme: saved.theme === 'dark' ? 'dark' : saved.theme === 'light' ? 'light' : defaults.theme,
      fontSize: ['default', 'large', 'xlarge'].includes(saved.fontSize) ? saved.fontSize : 'default',
      highContrast: Boolean(saved.highContrast),
      reduceMotion: Boolean(saved.reduceMotion),
    }
  } catch {
    return defaults
  }
}

export function AccessibilityProvider({ children }) {
  const [preferences, setPreferences] = useState(loadPreferences)

  useLayoutEffect(() => {
    const root = document.documentElement
    root.dataset.theme = preferences.theme
    root.dataset.fontSize = preferences.fontSize
    root.dataset.contrast = preferences.highContrast ? 'high' : 'standard'
    root.dataset.reduceMotion = preferences.reduceMotion ? 'true' : 'false'
    root.style.colorScheme = preferences.theme

    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences))
  }, [preferences])

  const value = useMemo(() => ({
    ...preferences,
    setTheme: (theme) => setPreferences((current) => ({ ...current, theme })),
    setFontSize: (fontSize) => setPreferences((current) => ({ ...current, fontSize })),
    setHighContrast: (highContrast) => setPreferences((current) => ({ ...current, highContrast })),
    setReduceMotion: (reduceMotion) => setPreferences((current) => ({ ...current, reduceMotion })),
    resetPreferences: () => setPreferences(systemDefaults()),
  }), [preferences])

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  )
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext)
  if (!context) throw new Error('useAccessibility must be used inside AccessibilityProvider')
  return context
}
