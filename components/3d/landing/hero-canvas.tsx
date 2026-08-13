"use client"

import { useEffect, useRef, useSyncExternalStore } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Environment, Lightformer } from "@react-three/drei"
import { useReducedMotion } from "framer-motion"
import * as THREE from "three"

import { CipherRing } from "./cipher-ring"
import { StateCube } from "./state-cube"
import { useThemePalette } from "./use-theme-palette"

/**
 * Scene d'accueil.
 *
 * Trois exigences la gouvernent, dans cet ordre :
 *
 * 1. Elle doit rester lisible — c'est une matrice d'etat traversee par un front
 *    de transformation, pas un economiseur d'ecran.
 * 2. Elle doit tenir 60 fps sur un portable d'etudiant : un seul appel de dessin
 *    par groupe d'objets, `devicePixelRatio` plafonne a 2, rendu suspendu des
 *    que l'onglet passe en arriere-plan.
 * 3. Elle doit pouvoir disparaitre : sans WebGL, avec `prefers-reduced-motion`,
 *    ou pour un lecteur d'ecran, la page reste entiere sans elle.
 */
export function HeroCanvas({ className }: { className?: string }) {
    const palette = useThemePalette()
    const reduceMotion = useReducedMotion()
    const supported = useWebGLSupport()

    // Sans WebGL, le degrade de fond de la page suffit : le contenu ne depend
    // pas de la scene.
    if (!supported) return null

    return (
        <div className={className} aria-hidden>
            <Canvas
                // Plafond a 2 : au-dela, on quadruple le nombre de pixels pour
                // une difference invisible et une chute de framerate certaine.
                dpr={[1, 2]}
                gl={{
                    antialias: true,
                    alpha: true,
                    powerPreference: "high-performance",
                    toneMapping: THREE.ACESFilmicToneMapping,
                    outputColorSpace: THREE.SRGBColorSpace,
                }}
                camera={{ position: [0, 1.4, 7.2], fov: 42 }}
                // `demand` : on ne redessine que sur invalidation, ce qui rend
                // le mode « mouvement reduit » reellement gratuit.
                frameloop={reduceMotion ? "demand" : "always"}
            >
                <PauseWhenHidden />

                <color attach="background" args={["#00000000"]} />

                {/* Eclairage par environnement : ce sont ces panneaux qui
                    dessinent les reflets sur les faces metalliques. Construits en
                    memoire, sans HDRI a telecharger — la scene reste hors-ligne. */}
                <Environment resolution={256}>
                    <Lightformer intensity={2.4} position={[4, 4, 2]} scale={[8, 8, 1]} color={palette.secondary} />
                    <Lightformer intensity={1.6} position={[-5, 1, -2]} scale={[6, 6, 1]} color={palette.primary} />
                    <Lightformer intensity={0.9} position={[0, -4, 3]} scale={[10, 4, 1]} color="#ffffff" />
                </Environment>

                <ambientLight intensity={0.35} />
                <directionalLight position={[4, 6, 3]} intensity={1.1} color={palette.secondary} />

                <ParallaxRig enabled={!reduceMotion}>
                    <StateCube palette={palette} animated={!reduceMotion} />
                    <CipherRing palette={palette} animated={!reduceMotion} />
                </ParallaxRig>
            </Canvas>
        </div>
    )
}

/**
 * WebGL est-il disponible ?
 *
 * La question se pose avant de monter le `<Canvas>` : R3F leve une exception si
 * le contexte est indisponible, et l'erreur remonterait jusqu'a la page. La
 * capacite du navigateur est une donnee exterieure a React et immuable pour la
 * duree de la session — d'ou `useSyncExternalStore` plutot qu'un effet, et une
 * sonde executee une seule fois.
 */
let webglProbe: boolean | null = null

function detectWebGL(): boolean {
    if (webglProbe !== null) return webglProbe
    try {
        const canvas = document.createElement("canvas")
        webglProbe = Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"))
    } catch {
        webglProbe = false
    }
    return webglProbe
}

/** Aucun abonnement : la reponse ne change pas en cours de session. */
const noopSubscribe = () => () => {}

function useWebGLSupport(): boolean {
    return useSyncExternalStore(
        noopSubscribe,
        detectWebGL,
        // Rendu serveur : pas de DOM, donc pas de scene.
        () => false,
    )
}

/**
 * Suspend la boucle de rendu quand l'onglet n'est plus visible.
 *
 * Sans cela, la scene continuerait a consommer GPU et batterie en arriere-plan
 * — le defaut exact que la version precedente du site avait avec ses boucles
 * `requestAnimationFrame` jamais annulees.
 */
function PauseWhenHidden() {
    const { setFrameloop, invalidate } = useThree()

    useEffect(() => {
        const onVisibility = () => {
            if (document.hidden) {
                setFrameloop("never")
            } else {
                setFrameloop("always")
                invalidate()
            }
        }

        document.addEventListener("visibilitychange", onVisibility)
        return () => document.removeEventListener("visibilitychange", onVisibility)
    }, [setFrameloop, invalidate])

    return null
}

/** Legere derive du groupe vers le pointeur : la scene repond sans distraire. */
function ParallaxRig({ enabled, children }: { enabled: boolean; children: React.ReactNode }) {
    const groupRef = useRef<THREE.Group>(null)

    useFrame(({ pointer }, delta) => {
        const group = groupRef.current
        if (!group || !enabled) return

        // Interpolation exponentielle amortie : le suivi garde la meme douceur
        // quel que soit le framerate, contrairement a un lerp a facteur fixe.
        const factor = 1 - Math.exp(-3 * delta)
        group.rotation.y += (pointer.x * 0.35 - group.rotation.y) * factor
        group.rotation.x += (-pointer.y * 0.2 - group.rotation.x) * factor
    })

    return <group ref={groupRef}>{children}</group>
}
