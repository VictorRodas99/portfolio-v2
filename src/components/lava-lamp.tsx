import { Gradient } from '@/lib/gradient'
import { useEffect } from 'react'
import '@/css/gradient.css'

export default function LavaLamp() {
  useEffect(() => {
    const gradient = new Gradient()
    gradient.initGradient('#gradient-canvas')
  }, [])

  return <canvas id="gradient-canvas" data-transition-in></canvas>
}
