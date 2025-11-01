"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

export function HeroScene() {
  const containerRef = useRef<HTMLDivElement>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })

    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0x000000, 0)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    containerRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    camera.position.z = 5

    // Create gradient mesh
    const geometry = new THREE.IcosahedronGeometry(2, 8)
    const material = new THREE.MeshPhongMaterial({
      color: 0xb8336a,
      emissive: 0x6b1b40,
      wireframe: false,
      shininess: 100,
    })
    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

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
    let animationId: number
    const animate = () => {
      animationId = requestAnimationFrame(animate)
      mesh.rotation.x += 0.001
      mesh.rotation.y += 0.002
      renderer.render(scene, camera)
    }

    animate()

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      cancelAnimationFrame(animationId)
      if (containerRef.current?.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement)
      }
      geometry.dispose()
      material.dispose()
      renderer.dispose()
    }
  }, [])

  return <div ref={containerRef} className="absolute inset-0" />
}
