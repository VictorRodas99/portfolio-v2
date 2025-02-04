import { z } from 'zod'

export const hexColorSchema = z
  .string()
  .regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, {
    message: 'Invalid hex color format'
  })
