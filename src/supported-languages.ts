const SUPPORTED_LANGUAGES = Object.freeze({
  spanish: 'es',
  english: 'en'
})

export const LANGUAGE_LABEL = Object.freeze({
  es: 'Español',
  en: 'English'
})

export const DEFAULT_LANGUAGE = SUPPORTED_LANGUAGES.spanish
export default SUPPORTED_LANGUAGES

export type Language =
  (typeof SUPPORTED_LANGUAGES)[keyof typeof SUPPORTED_LANGUAGES]
