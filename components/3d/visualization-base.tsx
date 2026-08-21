"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

interface VisualizationBaseProps {
    setup: (scene: THREE.Scene, camera: THREE.PerspectiveCamera) => (() => void) | void
    className?: string
    backgroundColor?: number
    backgroundAlpha?: number
}

export function VisualizationBase({
                                      setup,
                                      className = "",
                                      backgroundColor = 0x000000,
                                      backgroundAlpha = 0,
                                  }: VisualizationBaseProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const sceneRef = useRef<THREE.Scene | null>(null)
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
    const animationIdRef = useRef<number | null>(null)
    const cleanupRef = useRef<(() => void) | null>(null)

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

        // Call setup function
        cleanupRef.current = setup(scene, camera) || null

        // Animation loop
        const animate = () => {
            animationIdRef.current = requestAnimationFrame(animate)
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

        // Copié au moment du montage : au démontage, `containerRef.current`
        // peut déjà valoir `null` (React l'efface avant d'exécuter le nettoyage).
        const container = containerRef.current

        return () => {
            window.removeEventListener("resize", handleResize)
            if (cleanupRef.current) cleanupRef.current()
            if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current)
            if (rendererRef.current && container) {
                try {
                    container.removeChild(rendererRef.current.domElement)
                } catch {
                    // Déjà retiré du DOM.
                }
                rendererRef.current.dispose()
            }
        }
    }, [setup, backgroundColor, backgroundAlpha])

    return <div ref={containerRef} className={`absolute inset-0 w-full h-full ${className}`} />
}