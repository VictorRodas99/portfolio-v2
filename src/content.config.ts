import { defineCollection } from 'astro:content'
import contentSchema from './content/content.schema'

const englishContent = defineCollection({
  type: 'data',
  schema: contentSchema
})

const spanishContent = defineCollection({
  type: 'data',
  schema: contentSchema
})

export const collections = {
  en: englishContent,
  es: spanishContent
}
