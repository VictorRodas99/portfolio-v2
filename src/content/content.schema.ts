import { z } from 'astro:content'

const contentSchema = z.object({
  page: z.object({
    title: z.string(),
    description: z.string()
  }),
  hero: z.object({
    title: z.string(),
    subtitle: z.object({
      experience: z.string(),
      description: z.string()
    })
  }),
  titles: z.object({
    experience: z.string(),
    projects: z.string(),
    about: z.string()
  }),
  experiences: z.array(
    z.object({
      date: z.string(),
      title: z.string(),
      company: z.string(),
      description: z.string()
    })
  ),
  projects: z.record(
    z.string(),
    z.object({
      name: z.string(),
      description: z.string()
    })
  )
})

export type Content = z.infer<typeof contentSchema>

export default contentSchema
