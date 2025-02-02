import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/dropdown-menu'
import MoonIcon from '@/components/icons/moon'
import GearIcon from '@/components/icons/settings'
import SpainIcon from '@/components/icons/spain'
import UnitedStatesIcon from '@/components/icons/united-states'
import type { Language } from '@/supported-languages'
import SUPPORTED_LANGUAGES, { LANGUAGE_LABEL } from '@/supported-languages'
import { useMemo, type SVGProps } from 'react'

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

export default function HeaderSettings({
  currentLanguage
}: {
  currentLanguage: Language
}) {
  const label = useMemo(
    () =>
      currentLanguage === SUPPORTED_LANGUAGES.spanish
        ? 'Configuraciones'
        : 'Settings',
    [currentLanguage]
  )

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

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger>
        <GearIcon className="size-[18px]" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-secondary border-primary text-soft-white">
        <DropdownMenuLabel>{label}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer">
          <a href={toggledURL} className="flex gap-2 items-center">
            <LanguageIcon lang={toggledLanguage} className="size-4" />
            {LANGUAGE_LABEL[toggledLanguage] ?? null}
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">
          <MoonIcon />
          Oscuro
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
