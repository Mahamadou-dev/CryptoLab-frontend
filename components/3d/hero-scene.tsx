"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

const COLORS = {
    violet: new THREE.Color("#7e22ce"),
    rose: new THREE.Color("#ec4899"),
    magenta: new THREE.Color("#c026d3"),
    background: new THREE.Color("#0b0013"),
}

export function HeroScene() {
    const containerRef = useRef<HTMLDivElement>(null)
    const animationIdRef = useRef<number | null>(null)

    useEffect(() => {
        if (!containerRef.current) return

        const container = containerRef.current
        const scene = new THREE.Scene()
        scene.background = COLORS.background

        const camera = new THREE.PerspectiveCamera(70, container.clientWidth / container.clientHeight, 0.1, 100)
        camera.position.z = 5

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
        renderer.setSize(container.clientWidth, container.clientHeight)
        renderer.setPixelRatio(window.devicePixelRatio)
        container.appendChild(renderer.domElement)

        const ambient = new THREE.AmbientLight(COLORS.violet, 0.5)
        const pointLight = new THREE.PointLight(COLORS.rose, 2, 10)
        pointLight.position.set(2, 3, 3)
        scene.add(ambient, pointLight)

        // 💎 Sphère principale
        const geometry = new THREE.SphereGeometry(1, 64, 64)
        const material = new THREE.MeshStandardMaterial({
            color: COLORS.violet,
            emissive: COLORS.magenta,
            emissiveIntensity: 0.8,
            metalness: 0.9,
            roughness: 0.2,
        })
        const sphere = new THREE.Mesh(geometry, material)
        scene.add(sphere)

        // 🌌 Particules flottantes
        const particlesGeometry = new THREE.BufferGeometry()
        const particleCount = 300
        const positions = new Float32Array(particleCount * 3)
        for (let i = 0; i < particleCount * 3; i++) {
            positions[i] = (Math.random() - 0.5) * 10
        }
        particlesGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
        const particlesMaterial = new THREE.PointsMaterial({
            color: COLORS.rose,
            size: 0.04,
            transparent: true,
            opacity: 0.8,
        })
        const particles = new THREE.Points(particlesGeometry, particlesMaterial)
        scene.add(particles)

        const clock = new THREE.Clock()
        const animate = () => {
            const elapsed = clock.getElapsedTime()
            sphere.rotation.y = elapsed * 0.2
            sphere.rotation.x = Math.sin(elapsed * 0.1) * 0.2
            particles.rotation.y = elapsed * 0.05
            renderer.render(scene, camera)
            animationIdRef.current = requestAnimationFrame(animate)
        }
        animate()

        const handleResize = () => {
            camera.aspect = container.clientWidth / container.clientHeight
            camera.updateProjectionMatrix()
            renderer.setSize(container.clientWidth, container.clientHeight)
        }
        window.addEventListener("resize", handleResize)

        return () => {
            cancelAnimationFrame(animationIdRef.current!)
            window.removeEventListener("resize", handleResize)
            renderer.dispose()
            container.removeChild(renderer.domElement)
        }
    }, [])

    return <div ref={containerRef} className="w-full h-full animate-aurora" />
}
