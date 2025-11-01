"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

export function EncryptionFlowViz() {
  const containerRef = useRef<HTMLDivElement>(null)

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

    camera.position.z = 8

    // Create flowing particles for encryption visualization
    const particleCount = 1000
    const particles = new THREE.BufferGeometry()
    const positions = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 20
      positions[i + 1] = (Math.random() - 0.5) * 20
      positions[i + 2] = (Math.random() - 0.5) * 20
    }

    particles.setAttribute("position", new THREE.BufferAttribute(positions, 3))

    const material = new THREE.PointsMaterial({
      color: 0x00d9ff,
      size: 0.1,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.6,
    })

    const points = new THREE.Points(particles, material)
    scene.add(points)

    // Lighting
    const light = new THREE.PointLight(0xb8336a, 1.5)
    light.position.set(10, 10, 10)
    scene.add(light)

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2)
    scene.add(ambientLight)

    // Animation loop
    let time = 0
    const animate = () => {
      requestAnimationFrame(animate)
      time += 0.001

      const positionAttribute = particles.getAttribute("position")
      const positionsArray = positionAttribute.array as Float32Array

      for (let i = 0; i < positionAttribute.count; i++) {
        const i3 = i * 3
        positionsArray[i3] += Math.sin(time + i) * 0.02
        positionsArray[i3 + 1] += Math.cos(time + i) * 0.02
      }

      positionAttribute.needsUpdate = true

      points.rotation.x += 0.0001
      points.rotation.y += 0.0002

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
      containerRef.current?.removeChild(renderer.domElement)
    }
  }, [])

  return <div ref={containerRef} className="absolute inset-0" />
}
