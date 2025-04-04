import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from '@/components/dropdown-menu'
import {
  MoonIcon,
  GearIcon,
  SunIcon,
  MonitorSettingsIcon
} from '@/components/icons'
import { SpainIcon, UnitedStatesIcon } from '@/components/icons/countries'
import type { Language } from '@/supported-languages'
import SUPPORTED_LANGUAGES, { LANGUAGE_LABEL } from '@/supported-languages'
import {
  setTheme,
  useSystemPreferenceTheme as _useSystemPreferenceTheme,
  type Theme,
  THEMES,
  getSavedTheme
} from '@/utils/dark-mode'
import { DropdownMenuGroup } from '@radix-ui/react-dropdown-menu'
import { useEffect, useMemo, useState, type SVGProps } from 'react'

const LanguageIcon = ({
  lang,
  ...props
}: { lang: Language } & SVGProps<SVGSVGElement>) => {
  if (lang === SUPPORTED_LANGUAGES.spanish) {
    return <SpainIcon {...props} />
  } else if (lang === SUPPORTED_LANGUAGES.english) {
    return <UnitedStatesIcon {...props} />
  }

  return null
}

const getTextBasedOnLocale = (lang: Language) => {
  if (!Object.values(SUPPORTED_LANGUAGES).includes(lang)) {
    throw new Error(`Unsupported language ${lang}`)
  }

  const text = {
    es: {
      label: 'Configuraciones',
      theme: {
        dark: 'Oscuro',
        light: 'Claro',
        system: 'Sistema'
      }
    },
    en: {
      label: 'Settings',
      theme: {
        dark: 'Dark',
        light: 'Light',
        system: 'System'
      }
    }
  }

  return text[lang]
}

const CurrentThemeIcon = ({
  theme,
  ...props
}: { theme: Theme | null } & SVGProps<SVGSVGElement>) => {
  if (!theme) {
    return <MonitorSettingsIcon {...props} />
  }

  if (theme === THEMES.dark) {
    return <MoonIcon {...props} />
  }

  return <SunIcon {...props} />
}

export default function HeaderSettings({
  currentLanguage
}: {
  currentLanguage: Language
}) {
  const text = useMemo(
    () => getTextBasedOnLocale(currentLanguage),
    [currentLanguage]
  )

  const [currentTheme, setCurrentTheme] = useState(getSavedTheme())
  const [themeLabel, setThemeLabel] = useState(text.theme.system)

  const toggledLanguage = useMemo(
    () =>
      currentLanguage === SUPPORTED_LANGUAGES.spanish
        ? SUPPORTED_LANGUAGES.english
        : SUPPORTED_LANGUAGES.spanish,
    [currentLanguage]
  )

  const toggledURL = useMemo(() => {
    const currentURL = new URL(window.location.href)
    currentURL.pathname = currentURL.pathname.replace(
      `/${currentLanguage}/`,
      `/${toggledLanguage}/`
    )

    return currentURL.toString()
  }, [currentLanguage, toggledLanguage])

  const handleClickOnTheme = (theme?: Theme) => {
    if (!theme) {
      setThemeLabel(text.theme.system)
      _useSystemPreferenceTheme()
      return
    }

    setThemeLabel(theme === THEMES.dark ? text.theme.dark : text.theme.light)
    setTheme(theme)
  }

  useEffect(() => {
    setCurrentTheme(getSavedTheme())
  }, [themeLabel])

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger>
        <GearIcon className="size-[18px]" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-light-primary dark:bg-secondary border-light-primary dark:border-primary text-soft-white border-none">
        <DropdownMenuLabel>{text.label}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer">
          <a href={toggledURL} className="flex gap-2 items-center">
            <LanguageIcon lang={toggledLanguage} className="size-4" />
            {LANGUAGE_LABEL[toggledLanguage] ?? null}
          </a>
        </DropdownMenuItem>
        <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <CurrentThemeIcon theme={currentTheme} />
              <span>{themeLabel}</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent className="bg-light-primary dark:bg-secondary text-soft-white border-light-primary border-none dark:border-primary">
                <DropdownMenuItem
                  onClick={() => handleClickOnTheme(THEMES.dark)}
                >
                  <MoonIcon />
                  <span>{text.theme.dark}</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleClickOnTheme(THEMES.light)}
                >
                  <SunIcon />
                  <span>{text.theme.light}</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleClickOnTheme()}>
                  <MonitorSettingsIcon />
                  <span>{text.theme.system}</span>
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
