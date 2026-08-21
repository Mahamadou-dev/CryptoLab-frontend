"use client"

import { Suspense, useEffect, useSyncExternalStore } from "react"
import { Canvas, useThree } from "@react-three/fiber"
import { Environment, Lightformer, MeshReflectorMaterial } from "@react-three/drei"
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing"
import { useReducedMotion } from "framer-motion"
import * as THREE from "three"

import { ByteStream } from "./byte-stream"
import { CameraRig } from "./camera-rig"
import { CipherRing } from "./cipher-ring"
import { StateCube } from "./state-cube"
import { useScrollProgress } from "./scroll-progress"
import { useThemePalette } from "./use-theme-palette"

/**
 * La chambre forte : scene unique, persistante sur toute la page d'accueil.
 *
 * Elle n'est pas remontee entre les sections — c'est la camera qui se deplace
 * au fil du defilement, ce qui evite de reconstruire le contexte WebGL et
 * donne l'impression d'un seul espace continu.
 *
 * Trois exigences la gouvernent, dans cet ordre :
 *
 * 1. Elle doit signifier quelque chose. Le cube est la matrice d'etat d'AES,
 *    l'anneau est l'alphabet du disque de Cesar. Rien n'est decoratif au hasard.
 * 2. Elle doit tenir sur un portable d'etudiant : instanciation GPU, dpr
 *    plafonne, rendu suspendu hors ecran.
 * 3. Elle doit pouvoir disparaitre. Sans WebGL, en mouvement reduit, ou pour un
 *    lecteur d'ecran, la page reste entiere sans elle.
 */
export function VaultScene({ className }: { className?: string }) {
    const palette = useThemePalette()
    const reduceMotion = useReducedMotion()
    const supported = useWebGLSupport()
    const progress = useScrollProgress()

    // Sans WebGL, le degrade de fond de la page suffit : le contenu ne depend
    // pas de la scene.
    if (!supported) return null

    const animated = !reduceMotion

    return (
        <div className={className} aria-hidden>
            <Canvas
                // Plafond a 2 : au-dela, on quadruple le nombre de pixels pour
                // une difference invisible et une chute de framerate certaine.
                dpr={[1, 2]}
                shadows
                gl={{
                    antialias: true,
                    alpha: true,
                    powerPreference: "high-performance",
                    toneMapping: THREE.ACESFilmicToneMapping,
                    outputColorSpace: THREE.SRGBColorSpace,
                }}
                camera={{ position: [0, 0.6, 6.2], fov: 40, near: 0.1, far: 60 }}
            >
                <PauseWhenHidden />
                <CameraRig progress={progress} enabled={animated} />

                {/* Brume : elle eloigne le fond et fait respirer la profondeur.
                    Sans elle, les octets lointains restent aussi nets que le
                    cube et l'echelle s'effondre. */}
                <fogExp2 attach="fog" args={[new THREE.Color(palette.background), 0.055]} />

                <Suspense fallback={null}>
                    {/*
                        L'eclairage vient d'un environnement construit en
                        memoire, pas d'un HDRI telecharge : la scene reste
                        hors-ligne et ne coute aucun octet de reseau. Ce sont ces
                        panneaux qui dessinent les reflets etires sur le metal —
                        des lampes ponctuelles ne produiraient que des taches.
                    */}
                    <Environment resolution={256}>
                        {/* Studio neutre : deux grands panneaux presque blancs
                            dessinent les reflets etires sur le metal. La couleur
                            du theme n'intervient qu'en rim light discret — c'est
                            l'accent qui signe la scene, pas un bain de neon. */}
                        <Lightformer
                            intensity={2.6}
                            position={[5, 5, 2]}
                            scale={[9, 9, 1]}
                            color="#f4f4f6"
                        />
                        <Lightformer
                            intensity={1.6}
                            position={[-6, 2, -3]}
                            scale={[7, 7, 1]}
                            color="#dfe1e6"
                        />
                        {/* Bande etroite au ras du sol : c'est elle qui trace la
                            ligne brillante sur l'arete superieure des octets. */}
                        <Lightformer
                            intensity={1.2}
                            position={[0, -3, 4]}
                            scale={[12, 1.6, 1]}
                            color="#ffffff"
                        />
                        <Lightformer
                            intensity={0.55}
                            position={[0, 7, -6]}
                            scale={[10, 6, 1]}
                            color={palette.tertiary}
                        />
                    </Environment>

                    <ambientLight intensity={0.3} />
                    <directionalLight
                        position={[5, 8, 4]}
                        intensity={1.1}
                        color="#f8f7fb"
                        castShadow
                        shadow-mapSize={[1024, 1024]}
                        shadow-camera-near={1}
                        shadow-camera-far={24}
                        shadow-bias={-0.0005}
                    />

                    <VaultFloor palette={palette} />

                    <group position={[0, 0.35, 0]}>
                        <StateCube palette={palette} animated={animated} />
                        <CipherRing palette={palette} animated={animated} />
                    </group>

                    <ByteStream palette={palette} animated={animated} />

                    <PostProcessing animated={animated} />
                </Suspense>
            </Canvas>
        </div>
    )
}

/**
 * Sol poli.
 *
 * Le reflet fait la moitie du realisme : il ancre les objets dans un lieu au
 * lieu de les laisser flotter dans le vide. `blur` et `mixStrength` sont
 * volontairement moderes — un miroir parfait ferait maquette, pas chambre forte.
 */
function VaultFloor({ palette }: { palette: { background: string; primary: string } }) {
    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.15, 0]} receiveShadow>
            <planeGeometry args={[60, 60]} />
            <MeshReflectorMaterial
                // Resolution volontairement basse : le reflet est flou de toute
                // facon, et c'est la passe la plus couteuse de la scene.
                resolution={512}
                mixBlur={1}
                mixStrength={9}
                blur={[380, 110]}
                depthScale={1.1}
                minDepthThreshold={0.4}
                maxDepthThreshold={1.35}
                roughness={0.9}
                metalness={0.35}
                color={palette.background}
                mirror={0.18}
            />
        </mesh>
    )
}

/**
 * Post-traitement.
 *
 * Le bloom ne decore pas : il ne s'empare que de ce qui depasse la luminance
 * 1, c'est-a-dire des seuls octets que l'onde de transformation traverse. Le
 * halo devient donc un signal — il designe ce qui est en train de changer.
 *
 * La vignette resserre le regard vers le centre, ou se trouve le cube.
 */
function PostProcessing({ animated }: { animated: boolean }) {
    // En mouvement reduit, on garde le rendu physique mais on allege : le bloom
    // reste (c'est de l'eclairage, pas du mouvement), la vignette aussi.
    return (
        <EffectComposer enableNormalPass={false} multisampling={animated ? 4 : 0}>
            <Bloom
                luminanceThreshold={1.1}
                luminanceSmoothing={0.3}
                intensity={animated ? 0.45 : 0.3}
                mipmapBlur
                radius={0.5}
            />
            <Vignette offset={0.28} darkness={0.45} eskil={false} />
        </EffectComposer>
    )
}

/**
 * WebGL est-il disponible ?
 *
 * La question se pose avant de monter le `<Canvas>` : R3F leve une exception si
 * le contexte est indisponible, et l'erreur remonterait jusqu'a la page. La
 * capacite du navigateur est une donnee exterieure a React et immuable pour la
 * duree de la session — d'ou `useSyncExternalStore` plutot qu'un effet.
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
