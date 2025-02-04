import { hexColorSchema } from '@/utils/color-validators'
import { useMemo } from 'react'
import { z } from 'zod'

export const colorsSchema = z.object({
  left: hexColorSchema,
  center: hexColorSchema,
  centerLeft: hexColorSchema,
  centerRight: hexColorSchema,
  right: hexColorSchema
})

type WavesColors = z.infer<typeof colorsSchema>

interface WavesProps {
  colors: WavesColors
}

export default function Waves({ colors }: WavesProps) {
  const validatedColors = useMemo(() => colorsSchema.parse(colors), [colors])

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 300">
      <defs>
        <linearGradient id="gradient-waves" x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%" style={{ stopColor: validatedColors.left }} />
          <stop
            offset="33%"
            style={{ stopColor: validatedColors.centerLeft }}
          />
          <stop
            offset="66%"
            style={{ stopColor: validatedColors.centerRight }}
          />
          <stop offset="100%" style={{ stopColor: validatedColors.right }} />
        </linearGradient>
      </defs>

      <path
        d="M0 300
           C 250 300, 250 250, 500 250
           C 750 250, 750 200, 1000 200
           L 1000 300 Z"
        fill="url(#gradient-waves)"
        opacity="0.7"
      />
    </svg>
  )
}
