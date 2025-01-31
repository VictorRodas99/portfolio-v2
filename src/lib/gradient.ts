import MiniGL from './mini-gl'
import { shaderFiles } from '@/shaders/shader-definitions'
import type {
  Material,
  Mesh,
  PlaneGeometry,
  Uniform
} from '@/types/gradient-shaders'

interface Gradient {
  element: HTMLCanvasElement
  cssVarRetries: number
  maxCssVarRetries: number
  angle: number
  isLoadedClass: boolean
  isScrolling: boolean

  scrollingTimeout: number | undefined
  scrollingRefreshDelay: number
  isIntersecting: boolean

  shaderFiles: {
    vertex: string
    noise: string
    blend: string
    fragment: string
  }
  vertexShader: string
  sectionColors: number[][] | number[]
  computedCanvasStyle: CSSStyleDeclaration
  conf: {
    presetName: string
    wireframe: boolean
    zoom: number
    rotation: number
    playing: boolean
    density: number[]
  }
  uniforms: {
    u_time: Uniform
    u_shadow_power: Uniform
    u_darken_top: Uniform
    u_active_colors: Uniform
    u_global: Uniform
    u_vertDeform: Uniform
    u_baseColor: Uniform
    u_waveLayers: Uniform
  }

  t: number
  last: number
  width: number
  minWidth: number
  height: number
  xSegCount: number | undefined
  ySegCount: number | undefined

  mesh: Mesh | undefined
  material: Material
  geometry: PlaneGeometry
  minigl: MiniGL
  scrollObserver: undefined

  amp: number
  seed: number
  freqX: number
  freqY: number
  freqDelta: number

  activeColors: number[]
  isMetaKey: boolean
  isGradientLegendVisible: boolean
  isMouseDown: boolean
}

/**
 * Normalizes a hexadecimal color code into an array of normalized RGB values
 */
function normalizeColor(hexCode: number) {
  return [
    ((hexCode >> 16) & 255) / 255,
    ((hexCode >> 8) & 255) / 255,
    (255 & hexCode) / 255
  ]
}

/**
 * Finally initializing the Gradient class, assigning a canvas to it and calling `Gradient.connect()`
 *
 * Basic implementation:
 * ```js
 * import { Gradient } from './Gradient.js'
 *
 * // Create your instance
 * const gradient = new Gradient()
 *
 * // Call `initGradient` with the selector to your canvas
 * gradient.initGradient('#gradient-canvas')
 * ```
 */
class Gradient implements Gradient {
  constructor() {
    this.element
    this.cssVarRetries = 0
    this.maxCssVarRetries = 200
    this.angle = 0
    this.isLoadedClass = false
    this.isScrolling = false
    this.scrollingTimeout = undefined
    this.scrollingRefreshDelay = 200
    this.isIntersecting = false
    this.shaderFiles
    this.vertexShader
    this.sectionColors
    this.computedCanvasStyle
    this.conf = {
      playing: false,
      density: [],
      presetName: '',
      rotation: 0,
      wireframe: false,
      zoom: 0
    }
    this.uniforms
    this.t = 1253106
    this.last = 0
    this.width
    this.minWidth = 1111
    this.height = 600
    this.xSegCount = undefined
    this.ySegCount = undefined
    this.mesh = undefined
    this.material
    this.geometry
    this.minigl
    this.scrollObserver = undefined
    this.amp = 320
    this.seed = 5
    this.freqX = 14e-5
    this.freqY = 29e-5
    this.freqDelta = 1e-5
    this.activeColors = [1, 1, 1, 1]
    this.isMetaKey = false
    this.isGradientLegendVisible = false
    this.isMouseDown = false
  }

  initGradient(selector: string) {
    const possibleCanvas = document.querySelector(selector)

    if (possibleCanvas instanceof HTMLCanvasElement) {
      this.element = possibleCanvas
      this.connect()

      return this
    }

    throw new Error(
      `Did not provide canvas element, given selector = ${selector}`
    )
  }

  connect() {
    this.shaderFiles = shaderFiles

    this.conf = {
      presetName: '',
      wireframe: false,
      density: [0.06, 0.16],
      zoom: 1,
      rotation: 0,
      playing: true
    }

    if (document.querySelectorAll('canvas').length < 1) {
      console.log('DID NOT LOAD HERO STRIPE CANVAS')
    } else {
      this.minigl = new MiniGL(this.element, null, null, true)

      requestAnimationFrame(() => {
        this.computedCanvasStyle = getComputedStyle(this.element)
        this.waitForCssVars()
      })
    }
  }

  disconnect() {
    // if(this.scrollObserver) {
    //   window.removeEventListener('scroll', this.handleScroll)
    //   window.removeEventListener('mousedown', this.handleMouseDown)
    //   window.removeEventListener('mouseup', this.handleMouseUp)
    //   window.removeEventListener('keydown', this.handleKeyDown)
    //   this.scrollObserver.disconnect()
    // }
  }

  initMaterial() {
    this.uniforms = {
      u_time: new this.minigl.Uniform({
        value: 0
      }),
      u_shadow_power: new this.minigl.Uniform({
        value: 5
      }),
      u_darken_top: new this.minigl.Uniform({
        value: '' === this.element.dataset.jsDarkenTop
      }),
      u_active_colors: new this.minigl.Uniform({
        value: this.activeColors,
        type: 'vec4'
      }),
      u_global: new this.minigl.Uniform({
        value: {
          noiseFreq: new this.minigl.Uniform({
            value: [this.freqX, this.freqY],
            type: 'vec2'
          }),
          noiseSpeed: new this.minigl.Uniform({
            value: 5e-6
          })
        },
        type: 'struct'
      }),
      u_vertDeform: new this.minigl.Uniform({
        value: {
          incline: new this.minigl.Uniform({
            value: Math.sin(this.angle) / Math.cos(this.angle)
          }),
          offsetTop: new this.minigl.Uniform({
            value: -0.5
          }),
          offsetBottom: new this.minigl.Uniform({
            value: -0.5
          }),
          noiseFreq: new this.minigl.Uniform({
            value: [3, 4],
            type: 'vec2'
          }),
          noiseAmp: new this.minigl.Uniform({
            value: this.amp
          }),
          noiseSpeed: new this.minigl.Uniform({
            value: 10
          }),
          noiseFlow: new this.minigl.Uniform({
            value: 3
          }),
          noiseSeed: new this.minigl.Uniform({
            value: this.seed
          })
        },
        type: 'struct',
        excludeFrom: 'fragment'
      }),
      u_baseColor: new this.minigl.Uniform({
        value: this.sectionColors[0],
        type: 'vec3',
        excludeFrom: 'fragment'
      }),
      u_waveLayers: new this.minigl.Uniform({
        value: [],
        excludeFrom: 'fragment',
        type: 'array'
      })
    }

    for (let e = 1; e < this.sectionColors.length; e++) {
      this.uniforms.u_waveLayers.value.push(
        new this.minigl.Uniform({
          value: {
            color: new this.minigl.Uniform({
              value: this.sectionColors[e],
              type: 'vec3'
            }),
            noiseFreq: new this.minigl.Uniform({
              value: [
                2 + e / this.sectionColors.length,
                3 + e / this.sectionColors.length
              ],
              type: 'vec2'
            }),
            noiseSpeed: new this.minigl.Uniform({ value: 11 + 0.3 * e }),
            noiseFlow: new this.minigl.Uniform({ value: 6.5 + 0.3 * e }),
            noiseSeed: new this.minigl.Uniform({ value: this.seed + 10 * e }),
            noiseFloor: new this.minigl.Uniform({ value: 0.1 }),
            noiseCeil: new this.minigl.Uniform({ value: 0.63 + 0.07 * e })
          },
          type: 'struct'
        })
      )
    }

    this.vertexShader = [
      this.shaderFiles.noise,
      this.shaderFiles.blend,
      this.shaderFiles.vertex
    ].join('\n\n')

    return new this.minigl.Material(
      this.vertexShader,
      this.shaderFiles.fragment,
      this.uniforms
    )
  }

  initMesh() {
    this.material = this.initMaterial()
    this.geometry = new this.minigl.PlaneGeometry()

    this.mesh = new this.minigl.Mesh(this.geometry, this.material)
  }

  shouldSkipFrame(timestamp: number) {
    if (!this.conf) {
      return
    }

    if (typeof timestamp === 'string') {
      timestamp = parseInt(timestamp, 10)
    }

    return (
      !!window.document.hidden ||
      !this.conf.playing ||
      timestamp % 2 === 0 ||
      false
    )
  }

  updateFrequency(changeAmount: number) {
    this.freqX += changeAmount
    this.freqY += changeAmount
  }

  toggleColor(index: number) {
    this.activeColors[index] = this.activeColors[index] === 0 ? 1 : 0
  }

  showGradientLegend() {
    if (this.width > this.minWidth) {
      this.isGradientLegendVisible = true
      document.body.classList.add('isGradientLegendVisible')
    }
  }

  hideGradientLegend() {
    this.isGradientLegendVisible = false
    document.body.classList.remove('isGradientLegendVisible')
  }

  handleScroll() {
    clearTimeout(this.scrollingTimeout)
    this.scrollingTimeout = setTimeout(
      this.handleScrollEnd,
      this.scrollingRefreshDelay
    )

    if (this.isGradientLegendVisible) {
      this.hideGradientLegend()
    }

    if (this.conf && this.conf.playing) {
      this.isScrolling = true
      this.pause()
    }
  }

  handleScrollEnd() {
    this.isScrolling = false

    if (this.isIntersecting) {
      this.play()
    }
  }

  resize() {
    if (!this.minigl || !this.mesh) {
      console.error('The MiniGL or the mesh class was not created yet')
      return
    }

    if (!this.conf) {
      throw new Error('Config not created yet')
    }

    this.width = window.innerWidth
    this.minigl.setSize(this.width, this.height)
    this.minigl.setOrthographicCamera()

    this.xSegCount = Math.ceil(this.width * this.conf.density[0])
    this.ySegCount = Math.ceil(this.height * this.conf.density[1])

    this.mesh.geometry.setTopology(this.xSegCount, this.ySegCount)
    this.mesh.geometry.setSize(this.width, this.height)
  }

  handleMouseDown(event: MouseEvent) {
    if (this.isGradientLegendVisible) {
      this.isMetaKey = event.metaKey
      this.isMouseDown = true

      if (!this.conf?.playing) {
        requestAnimationFrame(this.animate.bind(this))
      }
    }
  }

  handleMouseUp() {
    this.isMouseDown = false
  }

  animate(timestamp: number) {
    if (!this.mesh) {
      throw new Error('No mesh initialized')
    }

    if (!this.shouldSkipFrame(timestamp) || this.isMouseDown) {
      this.t += Math.min(timestamp - this.last, 1000 / 15)
      this.last = timestamp

      if (this.isMouseDown) {
        let mouseDelta = 160

        if (this.isMetaKey) {
          mouseDelta = -160
        }

        this.t += mouseDelta
      }

      this.mesh.material.uniforms.u_time.value = this.t
      this.minigl.render()
    }

    if (/*this.isIntersecting &&*/ this.conf.playing || this.isMouseDown) {
      requestAnimationFrame(this.animate.bind(this))
    }
  }

  addIsLoadedClass() {
    if (!this.isLoadedClass /* && this.isIntersecting */) {
      this.isLoadedClass = true
      this.element?.classList.add('isLoaded')

      setTimeout(() => {
        this.element?.parentElement?.classList.add('isLoaded')
      }, 3000)
    }
  }

  pause() {
    this.conf.playing = false
  }

  play() {
    requestAnimationFrame(this.animate.bind(this))
    this.conf.playing = true
  }

  init() {
    this.initGradientColors()
    this.initMesh()
    this.resize()
    requestAnimationFrame(this.animate.bind(this))

    window.addEventListener('resize', this.resize.bind(this))
  }

  /**
   * Waiting for the css variables to become available, usually on page load before we can continue.
   * Using default colors assigned in `Gradient.sectionColors` if no variables have been found after `maxCssVarRetries`
   */
  waitForCssVars() {
    const gradientColor1 =
      this.computedCanvasStyle.getPropertyValue('--gradient-color-1')

    if (this.computedCanvasStyle && gradientColor1.includes('#')) {
      this.init()
      this.addIsLoadedClass()
    } else {
      this.cssVarRetries += 1
      if (this.cssVarRetries > this.maxCssVarRetries) {
        this.sectionColors = [16711680, 16711680, 16711935, 65280, 255]
        this.init()
      } else {
        requestAnimationFrame(() => this.waitForCssVars.bind(this)())
      }
    }
  }

  /**
   * Initializes the four section colors by retrieving them from css variables
   */
  initGradientColors() {
    const cssPropertyNames = [
      '--gradient-color-1',
      '--gradient-color-2',
      '--gradient-color-3',
      '--gradient-color-4'
    ]

    const expandedHexCodes = cssPropertyNames
      .map((cssPropertyName) => {
        let hex = this.computedCanvasStyle
          .getPropertyValue(cssPropertyName)
          .trim()

        // Check if shorthand hex value was used and double the length so the conversion in normalizeColor will work
        if (hex.length === 4) {
          const expandedHex = hex
            .substring(1)
            .split('')
            .map((char) => char + char)
            .join('')

          return parseInt(expandedHex.substring(1), 16)
          // hex = `#${expandedHex}`
        }

        // return hex && `0x${hex.substring(1)}`
        return parseInt(hex.substring(1), 16)
      })
      .filter(Boolean)

    this.sectionColors = expandedHexCodes.map(normalizeColor)
  }
}

export { Gradient }
