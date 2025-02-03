const CLASS_FOR_DARK_MODE = 'dark'
const LOCAL_STORAGE_THEME_KEY = 'theme'

export const THEMES = Object.freeze({
  dark: 'dark',
  light: 'light'
})

export type Theme = (typeof THEMES)[keyof typeof THEMES]

export function getUserThemePreference() {
  const { body } = document
  const currentTheme = getSavedTheme()

  if (!currentTheme) {
    body.classList.toggle(
      CLASS_FOR_DARK_MODE,
      !(LOCAL_STORAGE_THEME_KEY in localStorage) &&
        window.matchMedia('(prefers-color-scheme: dark)').matches
    )
    return
  }

  if (currentTheme === THEMES.light) {
    return body.classList.remove(CLASS_FOR_DARK_MODE)
  }

  body.classList.add(CLASS_FOR_DARK_MODE)
}

export function useSystemPreferenceTheme() {
  localStorage.removeItem(LOCAL_STORAGE_THEME_KEY)
  getUserThemePreference()
}

export function getSavedTheme() {
  return localStorage.getItem(LOCAL_STORAGE_THEME_KEY) as Theme | null
}

export function setTheme(theme: Theme) {
  if (!Object.values(THEMES).includes(theme)) {
    throw new Error(`Incorrect theme, given ${theme}`)
  }

  localStorage.setItem(LOCAL_STORAGE_THEME_KEY, theme)
  getUserThemePreference()
}
