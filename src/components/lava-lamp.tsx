import { Gradient } from '@/lib/gradient'
import { useEffect, useState } from 'react'
import '@/css/gradient.css'
import { cn } from '@/utils/cn'

export default function LavaLamp() {
  const [isGradientLoaded, setIsGradientLoaded] = useState(false)

  useEffect(() => {
    const gradient = new Gradient()
    gradient.initGradient('#gradient-canvas')

    setIsGradientLoaded(true)
  }, [])

  return (
    <canvas
      id="gradient-canvas"
      className={cn({
        'animate-fade-in': isGradientLoaded,
        hidden: !isGradientLoaded
      })}
      data-transition-in
    ></canvas>
  )
}
