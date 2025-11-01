"use client"

import { useEffect, useRef, useCallback } from "react"
import * as THREE from "three"

interface UseThreeSceneProps {
  onSceneReady?: (scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer) => void
  backgroundColor?: number
  backgroundAlpha?: number
}

export function useThreeScene({ onSceneReady, backgroundColor = 0x000000, backgroundAlpha = 0 }: UseThreeSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const animationIdRef = useRef<number | null>(null)

  const cleanup = useCallback(() => {
    if (animationIdRef.current) {
      cancelAnimationFrame(animationIdRef.current)
    }
    if (rendererRef.current && containerRef.current) {
      containerRef.current.removeChild(rendererRef.current.domElement)
      rendererRef.current.dispose()
    }
  }, [])

  useEffect(() => {
    if (!containerRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000,
    )
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })

    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    renderer.setClearColor(backgroundColor, backgroundAlpha)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    containerRef.current.appendChild(renderer.domElement)

    sceneRef.current = scene
    rendererRef.current = renderer
    cameraRef.current = camera

    camera.position.z = 5

    // Call the setup callback
    if (onSceneReady) {
      onSceneReady(scene, camera, renderer)
    }

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return
      const width = containerRef.current.clientWidth
      const height = containerRef.current.clientHeight
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      cleanup()
    }
  }, [backgroundColor, backgroundAlpha, onSceneReady, cleanup])

  return { containerRef, scene: sceneRef.current, camera: cameraRef.current, renderer: rendererRef.current }
}
