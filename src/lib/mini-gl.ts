import type {
  UniformTypeFn,
  Attribute,
  AttributeConstructor,
  CommonUniforms,
  Uniform,
  UniformConstructor,
  UniformType,
  PlaneGeometry,
  Material,
  Mesh,
  PlaneGeometryConstructor,
  MeshConstructor,
  MaterialConstructor
} from '@/types/gradient-shaders'

export default class MiniGL {
  width: number
  height: number

  canvas: HTMLCanvasElement
  gl: WebGLRenderingContext
  meshes: Mesh[]

  debug: (message: string, debugData?: any) => void
  lastDebugMsg: Date
  commonUniforms: CommonUniforms

  // Classes from properties
  Material: MaterialConstructor
  Uniform: UniformConstructor
  PlaneGeometry: PlaneGeometryConstructor
  Mesh: MeshConstructor
  Attribute: AttributeConstructor

  constructor(
    canvas: HTMLCanvasElement,
    width: number | null,
    height: number | null,
    debug = true
  ) {
    const miniGL = this
    const debugMode =
      document.location.search.toLowerCase().indexOf('debug=webgl') !== -1

    miniGL.canvas = canvas

    const canvasContext = miniGL.canvas.getContext('webgl', {
      antialias: true
    })

    if (!canvasContext) {
      throw new Error('Cannot get context from canvas!')
    }

    miniGL.gl = canvasContext
    miniGL.meshes = []

    const context = miniGL.gl

    if (width && height) {
      this.setSize(width, height)
    }

    miniGL.debug =
      debug && debugMode
        ? (message: string, debugData?: any) => {
            const currentTime = new Date()

            if (Number(currentTime) - Number(miniGL.lastDebugMsg) > 1000) {
              console.log('---')
            }

            const paddedMessage = message.padEnd(32)

            console.log(currentTime.toLocaleString(), paddedMessage, debugData)

            miniGL.lastDebugMsg = currentTime
          }
        : () => {}

    Object.defineProperties(miniGL, {
      Material: {
        enumerable: false,
        value: class {
          uniforms: CommonUniforms
          uniformInstances: {
            uniform: Uniform
            location: WebGLUniformLocation | null
          }[]

          vertexSource: string
          fragmentSource: string

          vertexShader: WebGLShader
          fragmentShader: WebGLShader
          program: WebGLProgram

          constructor(
            vertexShaders: string,
            fragments: string,
            uniforms: CommonUniforms
          ) {
            const material = this

            material.uniforms = uniforms
            material.uniformInstances = []

            const prefix =
              '\n              precision highp float;\n            '

            this.vertexSource = `\n              ${prefix}\n              attribute vec4 position;\n              attribute vec2 uv;\n              attribute vec2 uvNorm;\n              ${this.getUniformVariableDeclarations(miniGL.commonUniforms, 'vertex')}\n              ${this.getUniformVariableDeclarations(uniforms, 'vertex')}\n              ${vertexShaders}\n            `
            this.fragmentSource = `\n              ${prefix}\n              ${this.getUniformVariableDeclarations(miniGL.commonUniforms, 'fragment')}\n              ${this.getUniformVariableDeclarations(uniforms, 'fragment')}\n              ${fragments}\n            `

            // Compile shaders and link program
            this.vertexShader = this.getShaderByType(
              context.VERTEX_SHADER,
              this.vertexSource
            )
            this.fragmentShader = this.getShaderByType(
              context.FRAGMENT_SHADER,
              this.fragmentSource
            )

            const program = context.createProgram()

            if (!program) {
              throw new Error('Cannot create new program from Material class')
            }

            this.program = program
            context.attachShader(this.program, this.vertexShader)
            context.attachShader(this.program, this.fragmentShader)
            context.linkProgram(this.program)

            if (
              !context.getProgramParameter(this.program, context.LINK_STATUS)
            ) {
              console.error(context.getProgramInfoLog(this.program))
            }

            context.useProgram(this.program)

            // Attach common and material uniforms
            this.attachUniforms(undefined, miniGL.commonUniforms)
            this.attachUniforms(undefined, material.uniforms)
          }

          getShaderByType(type: number, source: string): WebGLShader {
            const shader = context.createShader(type)

            if (!shader) {
              throw new Error('Cannot create new Shader')
            }

            context.shaderSource(shader, source)
            context.compileShader(shader)

            if (!context.getShaderParameter(shader, context.COMPILE_STATUS)) {
              console.error(context.getShaderInfoLog(shader))
            }

            miniGL.debug('Material.compilerShaderSource: ', source)

            return shader
          }

          getUniformVariableDeclarations(
            uniforms: CommonUniforms,
            type: UniformType
          ) {
            const declarations = Object.entries(uniforms)
              .map(([uniform, value]: [string, Uniform]) =>
                value.getDeclaration(uniform, type)
              )
              .join('\n')

            return declarations
          }

          attachUniforms(name: string | undefined, uniforms: any) {
            const material = this

            if (name === undefined) {
              Object.entries(uniforms).forEach(([name, uniform]) => {
                material.attachUniforms(name, uniform)
              })
            } else if (uniforms.type === 'array') {
              uniforms.value.forEach((uniform: any, i: any) => {
                material.attachUniforms(`${name}[${i}]`, uniform)
              })
            } else if (uniforms.type === 'struct') {
              Object.entries(uniforms.value).forEach(([uniform, i]) => {
                material.attachUniforms(`${name}.${uniform}`, i)
              })
            } else {
              miniGL.debug('Material.attachUniforms: ', {
                name: name,
                uniform: uniforms
              })

              material.uniformInstances.push({
                uniform: uniforms,
                location: context.getUniformLocation(material.program, name)
              })
            }
          }
        }
      },
      Uniform: {
        enumerable: false,
        value: class {
          type: UniformType
          typeFn: string
          value: any

          options: {
            type?: UniformType
            value: any
            transpose?: boolean
            excludeFrom?: string
          }

          constructor(options: {
            type?: UniformType
            value: any
            transpose?: boolean
            excludedFrom?: string
          }) {
            this.type = options.type ?? 'float'
            this.value = options.value

            this.options = options
            this.typeFn = this.getTypeFunction()
            this.update()
          }

          getTypeFunction(): UniformTypeFn {
            const typeMap: Record<string, UniformTypeFn> = {
              float: '1f',
              int: '1i',
              vec2: '2fv',
              vec3: '3fv',
              vec4: '4fv',
              mat4: 'Matrix4fv'
            }

            const finalType = typeMap[this.type] || '1f'

            return finalType
          }

          update(value?) {
            if (this.value !== undefined) {
              context[`uniform${this.typeFn}`](
                value,
                this.typeFn.indexOf('Matrix') === 0
                  ? this.options.transpose
                  : this.value,
                this.typeFn.indexOf('Matrix') === 0 ? this.value : null
              )
            }
          }

          getDeclaration(name: string, type: UniformType, length: number) {
            const uniform = this
            const lengthDeclaration = length > 0 ? `[${length}]` : ''

            if (uniform.options.excludeFrom === type) {
              return ''
            }

            if (uniform.type === 'array') {
              const uniformDeclaration = uniform.value[0].getDeclaration(
                name,
                type,
                uniform.value.length
              )

              return `${uniformDeclaration}\nconst int ${name}_length = ${uniform.value.length};`
            }

            if (uniform.type === 'struct') {
              let nameWithoutPrefix = name.replaceAll('u_', '')
              nameWithoutPrefix =
                nameWithoutPrefix.charAt(0).toUpperCase() +
                nameWithoutPrefix.slice(1)

              const structsDeclaration = Object.entries(uniform.value)
                .map(([name, uniform]) =>
                  (uniform as Uniform)
                    .getDeclaration(name, type)
                    .replace(/^uniform/, '')
                )
                .join('')

              return `uniform struct ${nameWithoutPrefix} {\n 
                              ${structsDeclaration} \n} ${name}${lengthDeclaration};`
            }

            return `uniform ${uniform.type} ${name}${lengthDeclaration};`
          }
        }
      },
      PlaneGeometry: {
        enumerable: false,
        value: class {
          attributes: {
            position: Attribute
            uv: Attribute
            uvNorm: Attribute
            index: Attribute
          }

          width: number
          height: number
          xSegCount: number
          ySegCount: number
          vertexCount: number
          quadCount: number
          orientation: string

          constructor(
            width?: number,
            height?: number,
            xSegCount?: number,
            ySegCount?: number,
            orientation?: string
          ) {
            context.createBuffer()

            this.attributes = {
              position: new miniGL.Attribute({
                target: context.ARRAY_BUFFER,
                size: 3
              }),
              uv: new miniGL.Attribute({
                target: context.ARRAY_BUFFER,
                size: 2
              }),
              uvNorm: new miniGL.Attribute({
                target: context.ARRAY_BUFFER,
                size: 2
              }),
              index: new miniGL.Attribute({
                target: context.ELEMENT_ARRAY_BUFFER,
                size: 3,
                type: context.UNSIGNED_SHORT
              })
            }

            this.setTopology(xSegCount, ySegCount)
            this.setSize(width, height, orientation)
          }

          setTopology(xSegCount = 1, ySegCount = 1) {
            this.xSegCount = xSegCount
            this.ySegCount = ySegCount
            this.vertexCount = (xSegCount + 1) * (ySegCount + 1)
            this.quadCount = xSegCount * ySegCount * 2

            this.attributes.uv.values = new Float32Array(2 * this.vertexCount)
            this.attributes.uvNorm.values = new Float32Array(
              2 * this.vertexCount
            )
            this.attributes.index.values = new Uint16Array(3 * this.quadCount)

            for (let yIndex = 0; yIndex <= ySegCount; yIndex++) {
              for (let xIndex = 0; xIndex <= xSegCount; xIndex++) {
                const i = yIndex * (xSegCount + 1) + xIndex

                this.attributes.uv.values[2 * i] = xIndex / xSegCount
                this.attributes.uv.values[2 * i + 1] = 1 - yIndex / ySegCount

                this.attributes.uvNorm.values[2 * i] =
                  (xIndex / xSegCount) * 2 - 1
                this.attributes.uvNorm.values[2 * i + 1] =
                  1 - (yIndex / ySegCount) * 2

                if (xIndex < xSegCount && yIndex < ySegCount) {
                  const s = yIndex * xSegCount + xIndex
                  const indexBase = 6 * s
                  this.attributes.index.values[indexBase] = i
                  this.attributes.index.values[indexBase + 1] =
                    i + 1 + xSegCount
                  this.attributes.index.values[indexBase + 2] = i + 1
                  this.attributes.index.values[indexBase + 3] = i + 1
                  this.attributes.index.values[indexBase + 4] =
                    i + 1 + xSegCount
                  this.attributes.index.values[indexBase + 5] =
                    i + 2 + xSegCount
                }
              }
            }

            this.attributes.uv.update()
            this.attributes.uvNorm.update()
            this.attributes.index.update()

            miniGL.debug('Geometry.setTopology: ', {
              uv: this.attributes.uv,
              uvNorm: this.attributes.uvNorm,
              index: this.attributes.index
            })
          }

          setSize(width = 1, height = 1, orientation = 'xz') {
            const geometry = this

            geometry.width = width
            geometry.height = height
            geometry.orientation = orientation

            if (
              !geometry.attributes.position.values ||
              geometry.attributes.position.values.length !==
                3 * geometry.vertexCount
            ) {
              geometry.attributes.position.values = new Float32Array(
                3 * geometry.vertexCount
              )
            }

            const halfWidth = width / -2
            const halfHeight = height / -2
            const segmentWidth = width / geometry.xSegCount
            const segmentHeight = height / geometry.ySegCount

            for (let yIndex = 0; yIndex <= geometry.ySegCount; yIndex++) {
              const yPos = halfHeight + yIndex * segmentHeight

              for (let xIndex = 0; xIndex <= geometry.xSegCount; xIndex++) {
                const xPos = halfWidth + xIndex * segmentWidth
                const vertexIndex = yIndex * (geometry.xSegCount + 1) + xIndex

                geometry.attributes.position.values[
                  3 * vertexIndex + 'xyz'.indexOf(orientation[0])
                ] = xPos
                geometry.attributes.position.values[
                  3 * vertexIndex + 'xyz'.indexOf(orientation[1])
                ] = -yPos
              }
            }

            geometry.attributes.position.update()

            miniGL.debug('Geometry.setSize: ', {
              position: this.attributes.position
            })
          }
        }
      },
      Mesh: {
        enumerable: false,
        value: class {
          geometry: PlaneGeometry
          material: Material // Material class
          wireframe: boolean
          attributeInstances: { attribute: Attribute; location: number }[]

          constructor(geometry: PlaneGeometry, material: Material) {
            this.geometry = geometry
            this.material = material

            this.wireframe = false
            this.attributeInstances = []

            // something's wrong in the second iteration, it must give 2 in location but gives -1
            // position attribute gives different values
            Object.entries(this.geometry.attributes).forEach(
              ([attrName, attribute]) => {
                const location = attribute.attach(
                  attrName,
                  this.material.program
                )
                this.attributeInstances.push({ attribute, location })
              }
            )

            miniGL.meshes.push(this)
            miniGL.debug('Mesh constructor: ', { mesh: this })
          }

          draw() {
            const context = miniGL.gl

            context.useProgram(this.material.program)

            this.material.uniformInstances.forEach(({ uniform, location }) => {
              uniform.update(location)
            })

            this.attributeInstances.forEach(({ attribute, location }) => {
              attribute.use(location)
            })

            const drawMode = this.wireframe ? context.LINES : context.TRIANGLES
            const indexLength = this.geometry.attributes.index.values.length
            context.drawElements(
              drawMode,
              indexLength,
              context.UNSIGNED_SHORT,
              0
            )
          }

          remove() {
            miniGL.meshes = miniGL.meshes.filter((mesh) => mesh !== this)
          }
        }
      },
      Attribute: {
        enumerable: false,
        value: class {
          type: number
          normalized: boolean
          buffer: WebGLBuffer | null
          size: number
          values: any
          target: number

          constructor({
            type = context.FLOAT,
            normalized = false,
            buffer = context.createBuffer(),
            size,
            values,
            target = context.ARRAY_BUFFER
          }) {
            this.type = type
            this.normalized = normalized
            this.buffer = buffer
            this.size = size
            this.values = values
            this.target = target

            this.update()
          }

          update() {
            if (this.values !== undefined) {
              context.bindBuffer(this.target, this.buffer)
              context.bufferData(this.target, this.values, context.STATIC_DRAW)
            }
          }

          attach(attributeName: string, program: WebGLProgram) {
            const location = context.getAttribLocation(program, attributeName)

            if (this.target === context.ARRAY_BUFFER) {
              context.enableVertexAttribArray(location)
              context.vertexAttribPointer(
                location,
                this.size,
                this.type,
                this.normalized,
                0,
                0
              )
            }

            return location
          }

          use(location: number) {
            context.bindBuffer(this.target, this.buffer)

            if (this.target === context.ARRAY_BUFFER) {
              context.enableVertexAttribArray(location)
              context.vertexAttribPointer(
                location,
                this.size,
                this.type,
                this.normalized,
                0,
                0
              )
            }
          }
        }
      }
    })

    const matrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]

    miniGL.commonUniforms = {
      projectionMatrix: new miniGL.Uniform({
        type: 'mat4',
        value: matrix
      }),
      modelViewMatrix: new miniGL.Uniform({
        type: 'mat4',
        value: matrix
      }),
      resolution: new miniGL.Uniform({
        type: 'vec2',
        value: [1, 1]
      }),
      aspectRatio: new miniGL.Uniform({
        type: 'float',
        value: 1
      })
    }
  }

  setSize(width = 640, height = 480) {
    this.width = width
    this.height = height

    this.canvas.width = width
    this.canvas.height = height

    this.gl.viewport(0, 0, width, height)

    this.commonUniforms.resolution.value = [width, height]
    this.commonUniforms.aspectRatio.value = width / height

    this.debug('MiniGL.setSize: ', { width, height })
  }

  setOrthographicCamera(
    left = 0,
    right = 0,
    top = 0,
    bottom = -2000,
    near = 2000
  ) {
    this.commonUniforms.projectionMatrix.value = [
      2 / this.width,
      0,
      0,
      0,
      0,
      2 / this.height,
      0,
      0,
      0,
      0,
      2 / (near - bottom),
      0,
      left,
      right,
      top,
      1
    ]

    this.debug(
      'setOrthographicCamera: ',
      this.commonUniforms.projectionMatrix.value
    )
  }

  render() {
    this.gl.clearColor(0, 0, 0, 0)
    this.gl.clearDepth(1)
    this.meshes.forEach((mesh) => mesh.draw())
  }
}
