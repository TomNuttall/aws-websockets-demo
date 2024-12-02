import { useState, useEffect } from 'react'
import { DarkModeSwitch, defaultProperties } from 'react-toggle-dark-mode'

import './ThemeToggle.scss'

const ThemeToggle: React.FC = () => {
  const [darkTheme, setDarkTheme] = useState<boolean>(
    window.matchMedia('(prefers-color-scheme: dark)').matches,
  )
  const [noAnimate, setNoAnimate] = useState<boolean>(false)

  const onColorSchemeChange = (e: { matches: boolean }) => {
    setDarkTheme(e.matches)
  }

  const onMotionPreferenceChange = (e: { matches: boolean }) => {
    setNoAnimate(e.matches)
  }

  useEffect(() => {
    const colorScheme = window.matchMedia('(prefers-color-scheme: dark)')
    setDarkTheme(colorScheme.matches)

    const motionPreference = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    )
    setNoAnimate(motionPreference.matches)

    colorScheme.addEventListener('change', onColorSchemeChange)
    motionPreference.addEventListener('change', onMotionPreferenceChange)

    return () => {
      colorScheme.removeEventListener('change', onColorSchemeChange)
      motionPreference.removeEventListener('change', onMotionPreferenceChange)
    }
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute(
      'color-scheme',
      darkTheme ? 'dark' : 'light',
    )
  }, [darkTheme])

  const animationProperties = { ...defaultProperties }
  if (noAnimate) {
    animationProperties.springConfig = {
      mass: 0,
      tension: 0,
      friction: 0,
    }
  }

  return (
    <button
      className="theme-toggle"
      aria-label="Toggle theme"
      onClick={() => setDarkTheme(!darkTheme)}
    >
      <DarkModeSwitch
        checked={darkTheme}
        onChange={() => {}}
        animationProperties={animationProperties}
      />
    </button>
  )
}

export default ThemeToggle
