import {
  Object3D,
  MeshStandardMaterial,
  Mesh,
  Shape,
  ExtrudeGeometry
} from 'three'
import { Tween } from '@tweenjs/tween.js'

import type { Group } from '@tweenjs/tween.js'

/**
 * Rotates one side of the cube at a time
 */
export function tRotate({
  cube,
  delay,
  tweenGroup,
  cubesPerSide
}: {
  cube: ReturnType<typeof makeCubes>['children'][0]
  cubesPerSide: number
  tweenGroup: Group
  delay: number
}) {
  // rotate the wrapped cube 90 deg along y/z axis
  if (Math.random() > 0.5) {
    cube.rotateY(Math.PI / 2)
  } else {
    cube.rotateZ(Math.PI / 2)
  }

  // pick a random layer to rotate
  const sideIndex = Math.floor(Math.random() * cubesPerSide)
  const side = cube.children[sideIndex]

  // pick a random direction to rotate
  const angles = {
    x: Math.random() > 0.5 ? -Math.PI : Math.PI,
    y: 0,
    z: 0
  }

  // pick a random time to wait between rotations
  const pause = Math.random() * 1000

  new Tween(side.rotation, tweenGroup)
    .delay(pause)
    .to(
      {
        // @ts-ignore
        x: side.rotation._x + angles.x,
        // @ts-ignore
        y: side.rotation._y + angles.y,
        // @ts-ignore
        z: side.rotation._z + angles.z
      },
      delay
    )
    .onComplete(() => {
      setTimeout(
        () =>
          tRotate({
            cube,
            delay,
            tweenGroup,
            cubesPerSide
          }),
        delay
      )
    })
    .start()
}

export function makeCubes({
  cubesPerSide,
  cubeColor
}: { cubesPerSide?: number; cubeColor?: string } = {}) {
  const DEFAULT_CUBES_PER_SIDE = 3
  const DEFAULT_RUBIKS_CUBE_COLOR = 0x000000

  const numCubes = cubesPerSide ?? DEFAULT_CUBES_PER_SIDE
  const material = new MeshStandardMaterial({
    color: cubeColor ?? DEFAULT_RUBIKS_CUBE_COLOR,
    metalness: 1,
    roughness: 0.11
  })

  const cubes = new Object3D()

  // iterate over all dimensions
  const offset = (numCubes - 1) / 2
  for (let i = 0; i < numCubes; i++) {
    const layer = new Object3D()

    for (let j = 0; j < numCubes; j++) {
      for (let k = 0; k < numCubes; k++) {
        const geometry = createBoxWithRoundedEdges(1, 1, 1, 0.12, 20)

        const x = (i - offset) * 1.03
        const y = (j - offset) * 1.03
        const z = (k - offset) * 1.03

        geometry.translate(x, y, z)
        const cube = new Mesh(geometry, material)
        layer.add(cube)
      }
    }
    cubes.add(layer)
  }

  const innerWrapper = new Object3D()
  innerWrapper.add(cubes)

  const outerWrapper = new Object3D()
  outerWrapper.add(innerWrapper)

  return outerWrapper
}

export function createBoxWithRoundedEdges(
  width: number,
  height: number,
  depth: number,
  radius0: number,
  smoothness: number
) {
  let shape = new Shape()
  let eps = 0.00001
  let radius = radius0 - eps
  shape.absarc(eps, eps, eps, -Math.PI / 2, -Math.PI, true)
  shape.absarc(eps, height - radius * 2, eps, Math.PI, Math.PI / 2, true)
  shape.absarc(
    width - radius * 2,
    height - radius * 2,
    eps,
    Math.PI / 2,
    0,
    true
  )
  shape.absarc(width - radius * 2, eps, eps, 0, -Math.PI / 2, true)

  let geometry = new ExtrudeGeometry(shape, {
    depth: depth - radius0 * 2,
    bevelEnabled: true,
    bevelSegments: smoothness * 2,
    steps: 1,
    bevelSize: radius,
    bevelThickness: radius0,
    curveSegments: smoothness
  })

  geometry.center()

  return geometry
}

export function toRadians(angle: number) {
  return angle * (Math.PI / 180)
}
