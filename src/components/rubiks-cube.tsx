import { useEffect, useRef, useState } from 'react'
import { Scene, PerspectiveCamera, Quaternion, Euler } from 'three'
import { Group } from '@tweenjs/tween.js'

import { makeCubes, toRadians, tRotate } from '@/utils/rubiks-cube.tools'
import { createLights, addRendering } from '@/utils/scene'
import { cn } from '@/utils/cn'

/**
 * @param size The size of the cube in px
 * @param color The color of the cube in hex
 */
export default function RubiksCube({
  size = 400,
  color
}: {
  size: number
  color?: string
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const isDraggingRef = useRef(false)
  const previousMousePositionRef = useRef({ x: 0, y: 0 })
  const [isCubeRendered, setIsCubeRendered] = useState(false)

  useEffect(() => {
    if (!containerRef.current) return

    const CAMERA_Z_POSITION = 5
    const CUBES_PER_SIDE = 3
    const SCENE_SIZE = {
      width: size,
      height: size
    }
    const TWEEN_GROUP = new Group()

    // Create the scene
    const scene = new Scene()
    const { rectLightOne, rectLightTwo, lightOneHelper, lightTwoHelper } =
      createLights()

    scene.add(rectLightOne)
    scene.add(rectLightTwo)
    scene.add(lightOneHelper)
    scene.add(lightTwoHelper)

    // Create the camera
    const camera = new PerspectiveCamera(
      75,
      SCENE_SIZE.width / SCENE_SIZE.height,
      0.1,
      1000
    )

    const composer = addRendering({
      scene,
      camera,
      container: containerRef.current,
      size: SCENE_SIZE
    })

    const cube = makeCubes({
      cubesPerSide: CUBES_PER_SIDE,
      cubeColor: color ?? '#121212'
    })
    scene.add(cube)

    setIsCubeRendered(true)

    tRotate({
      cube: cube.children[0].children[0],
      cubesPerSide: CUBES_PER_SIDE,
      delay: 2000,
      tweenGroup: TWEEN_GROUP
    })

    camera.position.z = CAMERA_Z_POSITION

    // Event handlers
    const handleMouseDown = () => {
      isDraggingRef.current = true
    }

    const handleMouseMove = (event: MouseEvent) => {
      const deltaMove = {
        x: event.offsetX - previousMousePositionRef.current.x,
        y: event.offsetY - previousMousePositionRef.current.y
      }

      if (isDraggingRef.current) {
        const deltaRotationQuaternion = new Quaternion().setFromEuler(
          new Euler(
            toRadians(deltaMove.y * 1),
            toRadians(deltaMove.x * 1),
            0,
            'XYZ'
          )
        )

        cube.quaternion.multiplyQuaternions(
          deltaRotationQuaternion,
          cube.quaternion
        )
      }

      previousMousePositionRef.current = {
        x: event.offsetX,
        y: event.offsetY
      }
    }

    const handleMouseUp = () => {
      isDraggingRef.current = false
    }

    containerRef.current.addEventListener('mousedown', handleMouseDown)
    containerRef.current.addEventListener('mousemove', handleMouseMove)
    containerRef.current.addEventListener('mouseup', handleMouseUp)

    let lastFrameTime = performance.now() / 1000
    let totalTimeGlobal = 0

    function animate() {
      const currentTime = performance.now() / 1000
      const deltaTime = currentTime - lastFrameTime
      totalTimeGlobal += deltaTime
      lastFrameTime = currentTime

      cube.children[0].rotation.x += 0.005
      cube.children[0].rotation.y += 0.005
      cube.children[0].rotation.z += 0.005

      TWEEN_GROUP.update()
      composer.render()

      requestAnimationFrame(animate)
    }

    const animationId = requestAnimationFrame(animate)

    // Cleanup
    return () => {
      cancelAnimationFrame(animationId)
      containerRef.current?.removeEventListener('mousedown', handleMouseDown)
      containerRef.current?.removeEventListener('mousemove', handleMouseMove)
      containerRef.current?.removeEventListener('mouseup', handleMouseUp)
    }
  }, [])

  return (
    <div
      className={cn(
        'absolute top-32 right-72 size-[400px] grid place-items-center',
        `size-[${size}px]`
      )}
    >
      <div className="relative transform-gpu md:w-[50px] hidden items-center justify-center lg:flex before:from-green-100 before:to-yellow-100 before:absolute before:left-0 before:top-0 before:block before:h-full before:w-full before:rounded-full before:bg-gradient-to-br before:blur-[150px] before:content-['']">
        <div
          ref={containerRef}
          className={cn(
            'size-[400px] relative',
            `size-[${size}px] transition-all`,
            {
              'lg:animate-scale-up': isCubeRendered
            },
            {
              hidden: !isCubeRendered
            }
          )}
        >
          <div
            style={{
              // @ts-ignore
              '& canvas': {
                display: 'block',
                position: 'absolute',
                zIndex: 100,
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)'
              }
            }}
          ></div>
        </div>
      </div>
    </div>
  )
}
