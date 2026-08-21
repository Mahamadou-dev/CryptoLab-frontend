"use client"

import { Canvas, useFrame, useThree } from "@react-three/fiber"
import {
    OrbitControls,
    Text3D,
    Center,
    useDetectGPU,
    Float,
} from "@react-three/drei"
import { Suspense, useMemo, useState, useEffect, useRef } from "react"
import { Vector3, Group, Mesh, Color, Points, BufferGeometry, Float32BufferAttribute, MeshStandardMaterial } from "three"
import * as THREE from "three"
// --- AJOUT I18N ---
import { useTranslation } from "@/lib/i18n"
import { useLanguage } from "@/lib/language-context"
import type { SimulationTrace } from "@/lib/api-client"

const FONT_URL = "/fonts/helvetiker_bold.typeface.json"
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

/** Étape de trace propre à César : une lettre d'entrée devient une lettre décalée. */
interface CaesarStep {
    current_char?: string
    output_char?: string
    description?: string
}

function isCaesarStep(step: unknown): step is Required<Pick<CaesarStep, "current_char" | "output_char">> {
    const s = step as CaesarStep
    return Boolean(s?.current_char && s?.output_char)
}

// --- HOOK D'OPTIMISATION ---
function usePerformanceOptimization() {
    const GPU = useDetectGPU()
    const { gl } = useThree()

    const quality = useMemo(() => {
        if (GPU.tier > 2) return {
            shadows: true,
            antialias: true,
            dpr: 1.5,
            particles: 25
        }
        if (GPU.tier > 0) return {
            shadows: false,
            antialias: true,
            dpr: 1,
            particles: 12
        }
        return {
            shadows: false,
            antialias: false,
            dpr: 0.8,
            particles: 6
        }
    }, [GPU.tier])

    useEffect(() => {
        gl.setPixelRatio(quality.dpr)
    }, [gl, quality.dpr])

    return quality
}

// --- PARTICLES SUBTILES ---
interface MagicParticlesProps {
    position: Vector3;
    color: string;
    count?: number;
}

function MagicParticles({ position, color, count = 15 }: MagicParticlesProps) {
    const particlesRef = useRef<Points>(null!)
    // Géométrie mutable détenue par une ref : Three.js mute ses tableaux
    // typés image par image pour la performance, un usage imperatif que le
    // modèle de pureté de React ne prévoit pas — c'est le cas d'usage documenté
    // de `useRef` (stocker une valeur mutable non liée au rendu). Elle n'est
    // jamais lue pendant le rendu React lui-même : `<primitive>` la reçoit via
    // une ref de rappel, pas en la dereferençant dans le JSX.
    const geometryRef = useRef<BufferGeometry>(new BufferGeometry())

    useEffect(() => {
        const positions = new Float32Array(count * 3)
        const sizes = new Float32Array(count)

        for (let i = 0; i < count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 1.5
            positions[i * 3 + 1] = (Math.random() - 0.5) * 1.5
            positions[i * 3 + 2] = (Math.random() - 0.5) * 1.5
            sizes[i] = Math.random() * 0.05 + 0.02
        }

        geometryRef.current.setAttribute('position', new Float32BufferAttribute(positions, 3))
        geometryRef.current.setAttribute('size', new Float32BufferAttribute(sizes, 1))
    }, [count])

    useFrame(({ clock }) => {
        if (!particlesRef.current) return

        const positionAttr = geometryRef.current.attributes.position as THREE.BufferAttribute | undefined
        if (!positionAttr) return
        const positions = positionAttr.array as Float32Array
        const time = clock.getElapsedTime()

        for (let i = 0; i < count; i++) {
            const ix = i * 3
            const iy = i * 3 + 1
            const iz = i * 3 + 2

            positions[ix] += Math.sin(time * 0.5 + i) * 0.003
            positions[iy] += Math.cos(time * 0.7 + i) * 0.003
            positions[iz] += Math.sin(time * 0.9 + i) * 0.003
        }

        positionAttr.needsUpdate = true
    })

    return (
        <points ref={particlesRef} position={position}>
            {/* eslint-disable-next-line react-hooks/refs -- geometrie Three.js mutee hors-rendu, jamais reassignee ; lecture de `.current` inevitable pour `<primitive>` */}
            <primitive object={geometryRef.current} />
            <pointsMaterial
                size={0.06}
                color={color}
                transparent
                opacity={0.4}
                sizeAttenuation
                alphaTest={0.1}
            />
        </points>
    )
}

// --- CADENAS ULTRA RÉALISTE ---
interface PadlockModelProps {
    isActive: boolean;
}

function PadlockModel({ isActive }: PadlockModelProps) {
    const group = useRef<Group>(null!)
    const lockBody = useRef<Mesh>(null!)
    const shackle = useRef<Group>(null!)
    const shackleArc = useRef<Mesh>(null!)

    // Matériaux haute qualité
    const materials = useMemo(() => ({
        body: new MeshStandardMaterial({
            color: "#4a5568",
            metalness: 0.95,
            roughness: 0.15,
            envMapIntensity: 1.2,
        }),
        bodyActive: new MeshStandardMaterial({
            color: "#cc22aa",
            metalness: 0.9,
            roughness: 0.1,
            emissive: new Color("#cc22aa").multiplyScalar(0.15),
        }),
        shackle: new MeshStandardMaterial({
            color: "#718096",
            metalness: 0.92,
            roughness: 0.18,
        }),
        shackleActive: new MeshStandardMaterial({
            color: "#8b5cf6",
            metalness: 0.88,
            roughness: 0.12,
            emissive: new Color("#8b5cf6").multiplyScalar(0.1),
        }),
        details: new MeshStandardMaterial({
            color: "#2d3748",
            metalness: 0.8,
            roughness: 0.25,
        }),
        keyhole: new MeshStandardMaterial({
            color: "#1a202c",
            metalness: 0.3,
            roughness: 0.9,
        })
    }), [])

    useFrame((_, delta) => {
        if (!group.current) return

        // Rotation très lente et subtile
        group.current.rotation.y += delta * 0.05

        // Animation de l'anneau - ouverture/fermeture réaliste
        if (shackle.current) {
            const targetRotation = isActive ? Math.PI * 0.15 : 0
            shackle.current.rotation.x = THREE.MathUtils.lerp(
                shackle.current.rotation.x,
                targetRotation,
                delta * 3
            )
        }

        // Pulse subtil du corps
        if (lockBody.current && isActive) {
            const pulse = 1 + Math.sin(Date.now() * 0.005) * 0.02
            lockBody.current.scale.setScalar(pulse)
        }

        // Changement de matériaux
        const bodyMaterial = isActive ? materials.bodyActive : materials.body
        const shackleMaterial = isActive ? materials.shackleActive : materials.shackle

        if (lockBody.current) lockBody.current.material = bodyMaterial
        if (shackleArc.current) shackleArc.current.material = shackleMaterial
    })

    return (
        <group ref={group} position={[0, 0.5, 0]} scale={1.2}>
            {/* Corps principal avec bords arrondis simulés */}
            <mesh ref={lockBody} castShadow>
                <boxGeometry args={[1.2, 1.6, 0.6]} />
                <primitive object={materials.body} />
            </mesh>

            {/* Détails sur le devant */}
            <mesh position={[0, 0.2, 0.31]} castShadow>
                <cylinderGeometry args={[0.4, 0.4, 0.08, 24]} />
                <primitive object={materials.details} />
            </mesh>

            {/* Trou de serrure */}
            <mesh position={[0, -0.1, 0.32]} castShadow>
                <cylinderGeometry args={[0.08, 0.08, 0.1, 12]} />
                <primitive object={materials.keyhole} />
            </mesh>

            {/* Détail de serrure */}
            <mesh position={[0, -0.3, 0.31]} castShadow>
                <boxGeometry args={[0.05, 0.25, 0.05]} />
                <primitive object={materials.details} />
            </mesh>

            {/* Anneau (shackle) - design réaliste */}
            <group ref={shackle} position={[0, 0.9, 0]}>
                <mesh ref={shackleArc} castShadow>
                    <torusGeometry args={[0.5, 0.08, 12, 24, Math.PI]} />
                    <primitive object={materials.shackle} />
                </mesh>

                {/* Branches de l'anneau */}
                <mesh position={[-0.5, -0.25, 0]} castShadow>
                    <cylinderGeometry args={[0.08, 0.08, 0.5, 12]} />
                    <primitive object={materials.shackle} />
                </mesh>
                <mesh position={[0.5, -0.25, 0]} castShadow>
                    <cylinderGeometry args={[0.08, 0.08, 0.5, 12]} />
                    <primitive object={materials.shackle} />
                </mesh>

                {/* Bases des branches */}
                <mesh position={[-0.5, -0.5, 0]} castShadow>
                    <cylinderGeometry args={[0.12, 0.12, 0.1, 12]} />
                    <primitive object={materials.details} />
                </mesh>
                <mesh position={[0.5, -0.5, 0]} castShadow>
                    <cylinderGeometry args={[0.12, 0.12, 0.1, 12]} />
                    <primitive object={materials.details} />
                </mesh>
            </group>

            {/* Effets magiques subtils */}
            {isActive && (
                <>
                    <MagicParticles position={new Vector3(0, 0.5, 0)} color="#8B5CF6" count={12} />
                    <pointLight
                        position={[0, 0.5, 0]}
                        intensity={0.3}
                        color="#8B5CF6"
                        distance={2}
                    />
                </>
            )}
        </group>
    )
}

// --- ALPHABET ÉLÉGANT ---
interface AlphabetDisplayProps {
    simulationData: SimulationTrace | null;
    currentStepIndex: number;
}

function AlphabetDisplay({ simulationData, currentStepIndex }: AlphabetDisplayProps) {
    const lettersRef = useRef<Group>(null!)

    const { activeChar, shiftedChar } = useMemo(() => {
        if (!simulationData?.steps?.length) return { activeChar: null, shiftedChar: null }

        const letterSteps = simulationData.steps.filter(isCaesarStep)
        const currentStep = letterSteps[currentStepIndex]

        if (!currentStep) return { activeChar: null, shiftedChar: null }

        return {
            activeChar: currentStep.current_char?.toUpperCase() ?? null,
            shiftedChar: currentStep.output_char?.toUpperCase() ?? null,
        }
    }, [simulationData, currentStepIndex])

    // Dérivé directement du rendu courant : pas besoin d'état ni d'effet.
    const activeIndices = useMemo(() => {
        const indices = new Set<number>()
        if (activeChar) {
            const startIndex = ALPHABET.indexOf(activeChar)
            if (startIndex !== -1) indices.add(startIndex)
        }
        if (shiftedChar) {
            const endIndex = ALPHABET.indexOf(shiftedChar)
            if (endIndex !== -1) indices.add(endIndex)
        }
        return indices
    }, [activeChar, shiftedChar])

    useFrame(({ clock }) => {
        if (!lettersRef.current) return

        const time = clock.getElapsedTime()

        lettersRef.current.children.forEach((letter, index) => {
            if (letter instanceof THREE.Mesh) {
                const isActive = activeIndices.has(index)
                const pulse = Math.sin(time * 2 + index * 0.3) * 0.05 + 1
                const float = Math.sin(time * 1.5 + index * 0.2) * 0.1

                letter.scale.setScalar(isActive ? pulse : 0.9)
                letter.position.y = isActive ? float : 0
            }
        })
    })

    return (
        <Float speed={0.3} rotationIntensity={0.2} floatIntensity={0.1}>
            <group ref={lettersRef} position={[0, -3.5, 0]}>
                {ALPHABET.split("").map((char, index) => {
                    const isActive = activeIndices.has(index)
                    const isStart = activeChar && ALPHABET.indexOf(activeChar) === index
                    const isEnd = shiftedChar && ALPHABET.indexOf(shiftedChar) === index

                    let color = "#d4cbcb"
                    if (isStart) color = "#cc22aa"
                    if (isEnd) color = "#ec4899"

                    return (
                        <Text3D
                            key={char}
                            font={FONT_URL}
                            size={0.3}
                            height={0.05}
                            position={[(index - 12.5) * 0.5, 0, 0]}
                            curveSegments={8}
                        >
                            {char}
                            <meshStandardMaterial
                                color={color}
                                emissive={color}
                                emissiveIntensity={isActive ? 0.6 : 0}
                                metalness={isActive ? 0.7 : 0.3}
                                roughness={isActive ? 0.2 : 0.6}
                            />
                        </Text3D>
                    )
                })}
            </group>
        </Float>
    )
}

// --- TEXTES MINIMALISTES ---
interface IOTextsProps {
    simulationData: SimulationTrace | null;
    currentStepIndex: number;
    t: ReturnType<typeof useTranslation>; // Ajout du traducteur
}

function IOTexts({ simulationData, currentStepIndex, t }: IOTextsProps) {
    const { plainText, cipherText } = useMemo(() => {
        if (!simulationData?.steps?.length) return { plainText: "", cipherText: "" }

        const firstStep = simulationData.steps[0] as CaesarStep
        const originalText = firstStep.description?.match(/'([^']+)'/)?.[1] || ""
        const plainToShow = originalText.substring(0, currentStepIndex + 1)

        const letterSteps = simulationData.steps.filter(isCaesarStep)
        const cipherToShow = letterSteps.slice(0, currentStepIndex + 1).map((s) => s.output_char).join('')

        return { plainText: plainToShow, cipherText: cipherToShow }
    }, [simulationData, currentStepIndex])

    return (
        <group>
            <Text3D
                font={FONT_URL}
                size={0.35}
                height={0.05}
                position={[-4, 2.2, 0]}
                curveSegments={8}
            >
                {t("viz.in", { plainText })}
                <meshStandardMaterial
                    color="#cc22aa"
                    emissive="#cc22aa"
                    emissiveIntensity={0.2}
                />
            </Text3D>

            <Text3D
                font={FONT_URL}
                size={0.35}
                height={0.05}
                position={[2.5, 2.2, 0]}
                curveSegments={8}
            >
                {t("viz.out", { cipherText })}
                <meshStandardMaterial
                    color="#ec4899"
                    emissive="#ec4899"
                    emissiveIntensity={0.2}
                />
            </Text3D>
        </group>
    )
}

// --- LETTRE ANIMÉE SUBTILE ---
interface AnimatedLetterProps {
    charIn: string;
    charOut: string;
    index: number;
    onComplete: () => void;
}

function AnimatedLetter({ charIn, charOut, index, onComplete }: AnimatedLetterProps) {
    const inRef = useRef<Group>(null!)
    const outRef = useRef<Group>(null!)
    const [phase, setPhase] = useState<"in" | "transform" | "out" | "done">("in")
    const progress = useRef(0)

    const startPos = useMemo(() => new Vector3(-4 + index * 0.3, 2.2, 0), [index])
    const lockPos = useMemo(() => new Vector3(0, 0.5, 0.5), [])
    const endPos = useMemo(() => new Vector3(2.5 + index * 0.3, 2.2, 0), [index])

    useFrame((_, delta) => {
        progress.current += delta * 1.5

        if (phase === "in" && inRef.current) {
            const t = Math.min(progress.current, 1)
            const curvePoint = new Vector3()
            curvePoint.x = THREE.MathUtils.lerp(startPos.x, lockPos.x, t)
            curvePoint.y = startPos.y + Math.sin(t * Math.PI)
            curvePoint.z = THREE.MathUtils.lerp(startPos.z, lockPos.z, t)

            inRef.current.position.copy(curvePoint)
            inRef.current.scale.setScalar(1 + t * 0.3)

            if (t >= 1) {
                setPhase("transform")
                progress.current = 0
            }
        } else if (phase === "transform") {
            if (progress.current >= 0.5) {
                inRef.current.visible = false
                outRef.current.visible = true
                setPhase("out")
                progress.current = 0
            }
        } else if (phase === "out" && outRef.current) {
            const t = Math.min(progress.current, 1)
            const curvePoint = new Vector3()
            curvePoint.x = THREE.MathUtils.lerp(lockPos.x, endPos.x, t)
            curvePoint.y = lockPos.y + Math.sin(t * Math.PI)
            curvePoint.z = THREE.MathUtils.lerp(lockPos.z, endPos.z, t)

            outRef.current.position.copy(curvePoint)
            outRef.current.scale.setScalar(1.3 - t * 0.3)

            if (t >= 1) {
                setPhase("done")
                onComplete()
            }
        }
    })

    return (
        <>
            <group ref={inRef} position={startPos}>
                <Text3D font={FONT_URL} size={0.25} height={0.04} curveSegments={8}>
                    {charIn}
                    <meshStandardMaterial color="#cc22aa" emissive="#cc22aa" emissiveIntensity={0.4} />
                </Text3D>
            </group>

            <group ref={outRef} position={lockPos} visible={false}>
                <Text3D font={FONT_URL} size={0.25} height={0.04} curveSegments={8}>
                    {charOut}
                    <meshStandardMaterial color="#ec4899" emissive="#ec4899" emissiveIntensity={0.4} />
                </Text3D>
            </group>
        </>
    )
}

// --- SCÈNE ÉLÉGANTE ---
interface SceneProps {
    simulationData: SimulationTrace | null;
}

function Scene({ simulationData }: SceneProps) {
    const { language } = useLanguage()
    const t = useTranslation(language)

    // Initialisés depuis `simulationData` : calculer la valeur de depart au
    // premier rendu (plutot qu'a 0 puis corriger en effet) evite un rendu
    // intercalaire et le `setState` synchrone que la regle interdit.
    const letterSteps = useMemo(() => {
        if (!simulationData?.steps?.length) return []
        return simulationData.steps.filter(isCaesarStep)
    }, [simulationData])

    const [stepIndex, setStepIndex] = useState(0)
    const [isRunning, setIsRunning] = useState(letterSteps.length > 0)
    const quality = usePerformanceOptimization()

    // Reagit aux changements de simulation posterieurs au premier rendu. C'est
    // le motif documente par React lui-meme ("Storing information from
    // previous renders") : comparer une ref a une prop pendant le rendu, puis
    // ajuster l'etat immediatement si elle a change. React re-execute le rendu
    // avant de commiter, sans jamais peindre l'etat intermediaire — mais la
    // regle experimentale du compilateur ne reconnait pas encore ce motif.
    const previousData = useRef(simulationData)
    /* eslint-disable react-hooks/refs -- lecture et ecriture de ref pendant le rendu, motif documente par React */
    if (previousData.current !== simulationData) {
        previousData.current = simulationData
        setStepIndex(0)
        setIsRunning(letterSteps.length > 0)
    }
    /* eslint-enable react-hooks/refs */

    const handleLetterComplete = () => {
        if (stepIndex < letterSteps.length - 1) {
            setStepIndex(stepIndex + 1)
        } else {
            setTimeout(() => setStepIndex(0), 2000)
        }
    }

    const activeStep = letterSteps[stepIndex]

    return (
        <Suspense fallback={null}>
            {/* Éclairage cinématique */}
            <ambientLight intensity={0.4} />
            <directionalLight
                position={[5, 8, 5]}
                intensity={0.8}
                castShadow={quality.shadows}
                shadow-mapSize={[1024, 1024]}
            />
            <pointLight position={[2, 3, 3]} intensity={0.4} color="#cc22aa" />
            <pointLight position={[-2, 3, -3]} intensity={0.4} color="#ec4899" />
            <hemisphereLight intensity={0.2} />

            {/* Éléments de la scène */}
            <PadlockModel isActive={isRunning && !!activeStep} />
            <AlphabetDisplay simulationData={simulationData} currentStepIndex={stepIndex} />
            <IOTexts simulationData={simulationData} currentStepIndex={stepIndex} t={t} />

            {/* Animation des lettres */}
            {isRunning && activeStep && (
                <AnimatedLetter
                    key={stepIndex}
                    charIn={activeStep.current_char.toUpperCase()}
                    charOut={activeStep.output_char.toUpperCase()}
                    index={stepIndex}
                    onComplete={handleLetterComplete}
                />
            )}

            {/* Contrôles smooth */}
            <OrbitControls
                enableZoom={true}
                enablePan={false}
                autoRotate={!isRunning}
                autoRotateSpeed={0.2}
                minDistance={6}
                maxDistance={15}
                dampingFactor={0.1}
                enableDamping
            />
        </Suspense>
    )
}

// --- CHARGEMENT STYLÉ ---
function LoadingFallback() {
    // Impossible d'utiliser le hook useLanguage/useTranslation ici directement
    // car Suspense doit avoir des enfants synchrones.
    // Le texte est donc en dur, mais il n'apparaît que très brièvement.
    return (
        <Center>
            <Text3D font={FONT_URL} size={0.3} height={0.05} curveSegments={8}>
                Chargement...
                <meshStandardMaterial color="#cc22aa" />
            </Text3D>
        </Center>
    )
}


// --- COMPOSANT PRINCIPAL ---
interface VizComponentProps {
    simulationData: SimulationTrace | null;
}

export function CaesarViz({ simulationData }: VizComponentProps) {
    const quality = useDetectGPU()

    const canvasConfig = useMemo(() => ({
        // REMARQUE : `alpha` est maintenant `true` pour la transparence
        antialias: quality.tier > 0,
        alpha: true,
        powerPreference: "high-performance" as const,
    }), [quality.tier])

    return (
        <Canvas
            camera={{ position: [0, 1, 8], fov: 40 }}
            gl={canvasConfig}
            style={{ width: '100%', height: '100%' }}
            dpr={Math.min(window.devicePixelRatio, quality.tier > 2 ? 1.5 : 1)}
        >
            {/* REMARQUE : La couleur de fond grise a été supprimée */}
            <Suspense fallback={<LoadingFallback />}>
                <Scene simulationData={simulationData} />
            </Suspense>
        </Canvas>
    )
}