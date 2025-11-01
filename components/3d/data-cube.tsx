"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

interface DataCubeProps {
  rotationSpeed?: number
  size?: number
  color?: number
}

export function DataCube({ rotationSpeed = 0.005, size = 2, color = 0xb8336a }: DataCubeProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const meshRef = useRef<THREE.Mesh>(null)

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
    renderer.setClearColor(0x000000, 0)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    containerRef.current.appendChild(renderer.domElement)

    camera.position.z = 5

    // Create cube
    const geometry = new THREE.BoxGeometry(size, size, size)
    const material = new THREE.MeshPhongMaterial({
      color: color,
      emissive: color,
      wireframe: false,
      shininess: 100,
    })
    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)
    meshRef.current = mesh

    // Lighting
    const light1 = new THREE.PointLight(0x00d9ff, 1.5)
    light1.position.set(5, 5, 5)
    scene.add(light1)

    const light2 = new THREE.PointLight(0xff006e, 1)
    light2.position.set(-5, -5, 5)
    scene.add(light2)

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3)
    scene.add(ambientLight)

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate)
      mesh.rotation.x += rotationSpeed
      mesh.rotation.y += rotationSpeed * 1.5
      renderer.render(scene, camera)
    }

    animate()

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
      if (containerRef.current?.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [rotationSpeed, size, color])

  return <div ref={containerRef} className="w-full h-full" />
}
