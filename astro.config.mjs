// @ts-check
import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'
import react from '@astrojs/react'

import SUPPORTED_LANGUAGES from './src/supported-languages'

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind({
      applyBaseStyles: false
    }),
    react()
  ],
  i18n: {
    locales: Object.values(SUPPORTED_LANGUAGES),
    defaultLocale: SUPPORTED_LANGUAGES.spanish,
    routing: {
      prefixDefaultLocale: true
    }
  },
  devToolbar: {
    enabled: false
  }
})
