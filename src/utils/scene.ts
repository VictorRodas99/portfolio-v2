import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js'
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js'
import {
  BloomEffect,
  FXAAEffect,
  EffectComposer,
  EffectPass,
  RenderPass
} from 'postprocessing'

import { RectAreaLight, WebGLRenderer } from 'three'
import type { Scene, Camera } from 'three'

export function createLights() {
  RectAreaLightUniformsLib.init()
  const rectLightOne = new RectAreaLight(0xffffff, 90, 20, 20)

  rectLightOne.position.set(10, 15, 0)
  rectLightOne.rotation.x = Math.PI * 1.5
  rectLightOne.rotation.y = Math.PI / 4

  const rectLightTwo = new RectAreaLight(0xffffff, 10, 20, 20)
  rectLightTwo.position.set(0, -20, 0)
  rectLightTwo.rotation.x = Math.PI / 2

  return {
    rectLightOne,
    rectLightTwo,
    lightOneHelper: new RectAreaLightHelper(rectLightOne),
    lightTwoHelper: new RectAreaLightHelper(rectLightTwo)
  }
}

export function addRendering({
  scene,
  camera,
  container,
  size
}: {
  scene: Scene
  camera: Camera
  container: HTMLElement
  size?: { width: number; height: number }
}) {
  // Create the renderer
  const renderer = new WebGLRenderer({
    antialias: false,
    alpha: true,
    powerPreference: 'high-performance',
    stencil: false,
    depth: false
  })

  renderer.setSize(
    size?.width ?? window.innerWidth,
    size?.height ?? window.innerHeight
  )
  renderer.autoClear = false

  // const container = document.getElementById('canvasContainer')
  container?.appendChild(renderer.domElement)

  const bloomOptions = {
    luminanceThreshold: 0.9,
    luminanceSmoothing: 0.7,
    intensity: 0.8,
    radius: 0.1
  }
  const bloomPass = new BloomEffect(bloomOptions)
  const FXAAPass = new FXAAEffect()

  const composer = new EffectComposer(renderer)
  composer.setSize(
    size?.width ?? window.innerWidth,
    size?.height ?? window.innerHeight
  )
  composer.addPass(new RenderPass(scene, camera))
  composer.addPass(new EffectPass(camera, FXAAPass, bloomPass))

  return composer
}
