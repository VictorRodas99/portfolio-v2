export type UniformTypeFn = '1f' | '1i' | '2fv' | '3fv' | '4fv' | 'Matrix4fv'

export type ShaderType = 'float' | 'int' | 'vec2' | 'vec3' | 'vec4' | 'mat4'

export type UniformType =
  | ShaderType
  | 'array'
  | 'struct'
  | 'vertex'
  | 'fragment'

export interface Uniform {
  type?: UniformType
  value?: any
  transpose?: boolean
  excludeFrom?: string
  getTypeFunction(): UniformTypeFn
  getDeclaration: (name: string, type: UniformType) => string
  update(value?)
}

export interface UniformConstructor {
  new (options: {
    type?: UniformType
    value?: any
    transpose?: boolean
    excludeFrom?: string
  }): Uniform
}

export interface CommonUniforms {
  projectionMatrix: Uniform
  modelViewMatrix: Uniform
  resolution: Uniform
  aspectRatio: Uniform
}

export type AttributeTarget =
  | WebGLRenderingContext['ARRAY_BUFFER']
  | WebGLRenderingContext['ELEMENT_ARRAY_BUFFER']

export interface AttributeProperties {
  buffer: WebGLBuffer
  normalized: boolean
  size: number
  target: number
  type: number
  value: Uint16Array | Float32Array
}

export interface PlaneGeometry {
  width: number
  height: number
  xSegCount: number
  ySegCount: number
  vertexCount: number
  quadCount: number
  orientation: string
  attributes: {
    position: Attribute
    uv: Attribute
    uvNorm: Attribute
    index: Attribute
  }
  setTopology(xSegCount?: number, ySegCount?: number): void
  setSize(width?: number, height?: number, orientation?: string): void
}

export interface PlaneGeometryConstructor {
  new (
    width?: number,
    heigth?: number,
    xSegCount?: number,
    ySegCount?: number,
    orientation?: string
  ): PlaneGeometry
}

interface MaterialUniform {
  type: ShaderType
  value: any
}

export interface Material {
  uniforms: { u_time: { value: number } }
  uniformInstances: {
    uniform: Uniform
    location: WebGLUniformLocation | null
  }[]
  vertexSource: string
  fragmentSource: string
  vertexShader: WebGLShader
  fragmentShader: WebGLShader
  program: WebGLProgram
  attachUniforms(name: string | undefined, uniforms: Uniform | CommonUniforms)
  getShaderByType(type: number, source: string): WebGLShader
  getUniformVariableDeclarations(
    uniforms: Record<string, Uniform> | CommonUniforms,
    type: UniformType
  ): string
}

export interface MaterialConstructor {
  new (
    vertexShaders: string,
    fragments: string,
    uniforms?: Record<string, MaterialUniform | Uniform>
  ): Material
}

export interface Mesh {
  geometry: PlaneGeometry
  material: Material
  wireframe: boolean
  attributeInstances: { attribute: Attribute; location: number }[]
  draw(): void
  remove(): void
}

export interface MeshConstructor {
  new (geometry: PlaneGeometry, material: Material): Mesh
}

export interface AttributeOptions {
  type?: number
  size: number
  normalized?: boolean
  buffer?: WebGLBuffer | null
  values?: Float32Array | Uint16Array
  target: AttributeTarget
}

export interface Attribute extends AttributeOptions {
  buffer: WebGLBuffer
  normalized: boolean
  size: number
  target: number
  type: number
  value: Uint16Array | Float32Array
  values: Float32Array | Uint16Array
  update(): void
  attach(attributeName: string, program: WebGLProgram): number
  use(location: number): void
}

export interface AttributeConstructor {
  new (options: AttributeOptions): Attribute
}
