"use client"

import React, { Suspense, useMemo, useState, useEffect, useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Text3D, Center, Plane } from "@react-three/drei"
import { Vector3, Mesh } from "three"
import type { SimulationTrace } from "@/lib/api-client"

const FONT_URL = "/fonts/helvetiker_bold.typeface.json"
const FONT_PROPS = { font: FONT_URL, size: 0.6, height: 0.1 }

/** Une étape brute de la trace `/api/simulate/railfence`. */
interface RailfenceStep {
    phase?: string
    current_pos?: [number, number]
    intermediate_result?: string
    description: string
}

// --------------------- GRILLE STATIQUE ---------------------
const StaticGrid = React.memo(({ matrix, offsets }: { matrix: string[][], offsets: { x: number, y: number } }) => {
    if (!matrix?.length) return null

    return (
        <group>
            {matrix.map((row, r) =>
                row.map((char, c) => (
                    <group
                        key={`${r}-${c}`}
                        position={new Vector3((c - offsets.x) * 1.5, -(r - offsets.y) * 1.5, 0)}
                    >
                        <Text3D {...FONT_PROPS} size={0.8} position={[-0.3, -0.3, 0.1]}>
                            {char}
                            <meshStandardMaterial color={"#aaa"} emissive={"#111"} emissiveIntensity={0.2} />
                        </Text3D>
                    </group>
                )),
            )}
        </group>
    )
})
StaticGrid.displayName = "StaticGrid"

// --------------------- HIGHLIGHT DYNAMIQUE ---------------------
const DynamicHighlight = React.memo(
    ({ matrix, activePos, phase }: { matrix: string[][], activePos: [number, number], phase: "Écriture" | "Lecture" }) => {
        const highlightRef = useRef<Mesh>(null!)
        const { offsets } = useMemo(() => {
            if (!matrix?.length) return { offsets: { x: 0, y: 0 } }
            const rows = matrix.length
            const cols = matrix[0].length
            return { offsets: { x: (cols - 1) / 2, y: (rows - 1) / 2 } }
        }, [matrix])

        const targetPos = useMemo(() => {
            const [r, c] = activePos
            if (r === -1 || c === -1) return new Vector3(0, 0, -100)
            return new Vector3((c - offsets.x) * 1.5, -(r - offsets.y) * 1.5, 0.12)
        }, [activePos, offsets])

        useFrame((_, delta) => {
            if (!highlightRef.current) return
            if (targetPos.z === -100) {
                highlightRef.current.visible = false
                return
            }
            highlightRef.current.visible = true
            highlightRef.current.position.lerp(targetPos, delta * 5) // mouvement plus doux
        })

        return (
            <Plane ref={highlightRef} args={[1.3, 1.3]}>
                <meshStandardMaterial
                    color={phase === 'Écriture' ? "#8B5CF6" : "#EC4899"}
                    opacity={0.35}
                    transparent
                    emissive={phase === 'Écriture' ? "#6D28D9" : "#BE185D"}
                    emissiveIntensity={0.3}
                />
            </Plane>
        )
    }
)
DynamicHighlight.displayName = "DynamicHighlight"

// --------------------- TEXTES IO ---------------------
const IOTexts = React.memo(
    ({
         fullInput,
         currentOutput,
         phase,
         inputIndex,
         yPos,
         xPos,
     }: {
        fullInput: string
        currentOutput: string
        phase: "Écriture" | "Lecture"
        inputIndex: number
        yPos: number
        xPos: number
    }) => {
        const inputText =
            phase === "Écriture" ? fullInput.substring(inputIndex) : ""
        const outputText = phase === "Lecture" ? currentOutput : ""

        return (
            <group>
                <Text3D {...FONT_PROPS} size={0.7} position={[0, yPos, 0]}>
                    <Center>
                        {phase === "Écriture"
                            ? "Phase 1 : Écriture (Verticale)"
                            : "Phase 2 : Lecture (Horizontale)"}
                    </Center>
                    <meshStandardMaterial
                        color={phase === "Écriture" ? "#8B5CF6" : "#EC4899"}
                    />
                </Text3D>

                {/* Entrée */}
                <Text3D {...FONT_PROPS} size={0.5} position={[xPos, 3, 0]}>
                    {"ENTRÉE (Texte paddé)"}
                    <meshStandardMaterial color="#8B5CF6" />
                </Text3D>
                <Text3D {...FONT_PROPS} position={[xPos, 2.2, 0]}>
                    {inputText}
                    <meshStandardMaterial color="#fff" />
                </Text3D>

                {/* Sortie */}
                <Text3D {...FONT_PROPS} size={0.5} position={[xPos, -2.2, 0]}>
                    {"SORTIE (Texte chiffré)"}
                    <meshStandardMaterial color="#EC4899" />
                </Text3D>
                <Text3D {...FONT_PROPS} position={[xPos, -3, 0]}>
                    {outputText}
                    <meshStandardMaterial color="#fff" />
                </Text3D>
            </group>
        )
    }
)
IOTexts.displayName = "IOTexts"

// --------------------- SCÈNE PRINCIPALE ---------------------
function Scene({ simulationData }: { simulationData: SimulationTrace | null }) {
    const [currentStepIndex, setCurrentStepIndex] = useState(0)
    const [phase, setPhase] = useState<"Écriture" | "Lecture">("Écriture")

    const { matrix, writeSteps, readSteps, fullInput } = useMemo(() => {
        if (!simulationData?.steps?.length) {
            return { matrix: null as string[][] | null, writeSteps: [] as RailfenceStep[], readSteps: [] as RailfenceStep[], fullInput: "" }
        }

        const steps = simulationData.steps as RailfenceStep[]
        const matrix = (simulationData.matrix as string[][] | undefined) || []
        const writeSteps = steps.filter((s) => s.phase === "Écriture")
        const readSteps = steps.filter((s) => s.phase === "Lecture")
        return {
            matrix,
            writeSteps,
            readSteps,
            fullInput: (simulationData.input_text as string | undefined) || "",
        }
    }, [simulationData])

    const { offsets, yPos, xPos } = useMemo(() => {
        if (!matrix?.length) return { offsets: { x: 0, y: 0 }, yPos: 4, xPos: -10 }
        const rows = matrix.length
        const cols = matrix[0].length
        return {
            offsets: { x: (cols - 1) / 2, y: (rows - 1) / 2 },
            yPos: (rows / 2) * 1.5 + 2,
            xPos: -((cols - 1) / 2) * 1.5 - 10,
        }
    }, [matrix])

    // ---------- LOGIQUE D'ANIMATION ----------
    useEffect(() => {
        if (!writeSteps.length && !readSteps.length) return

        const totalWrite = writeSteps.length
        const totalRead = readSteps.length
        const total = totalWrite + totalRead

        let step = 0
        let phaseLocal: "Écriture" | "Lecture" = "Écriture"

        const interval = setInterval(() => {
            if (step < totalWrite) {
                phaseLocal = "Écriture"
            } else if (step < total) {
                phaseLocal = "Lecture"
            } else {
                // Pause 2s avant de recommencer
                clearInterval(interval)
                setTimeout(() => {
                    setCurrentStepIndex(0)
                    setPhase("Écriture")
                }, 2000)
                return
            }
            setCurrentStepIndex(step)
            setPhase(phaseLocal)
            step++
        }, 700) // 🕐 vitesse plus lisible (0.7s/étape)

        return () => clearInterval(interval)
    }, [writeSteps.length, readSteps.length])

    if (!matrix?.length)
        return (
            <Text3D font={FONT_URL} size={0.8} height={0.1}>
                <Center>Lancez une simulation pour voir la grille...</Center>
                <meshStandardMaterial color="#888" />
            </Text3D>
        )

    // ---------- EXTRACTION DE L'ÉTAPE COURANTE ----------
    let activeStep
    let activePos: [number, number] = [-1, -1]
    let currentOutput = ""
    let inputIndex = 0

    if (phase === "Écriture") {
        activeStep = writeSteps[currentStepIndex]
        if (activeStep?.current_pos) {
            activePos = [activeStep.current_pos[0], activeStep.current_pos[1]]
            inputIndex = currentStepIndex
        }
    } else {
        const readIndex = currentStepIndex - writeSteps.length
        activeStep = readSteps[readIndex]
        if (activeStep?.current_pos) {
            activePos = [activeStep.current_pos[0], activeStep.current_pos[1]]
            currentOutput = activeStep.intermediate_result ?? ""
            inputIndex = fullInput.length
        }
    }

    return (
        <Suspense fallback={null}>
            <group>
                <StaticGrid matrix={matrix} offsets={offsets} />
                <DynamicHighlight matrix={matrix} phase={phase} activePos={activePos} />
                <IOTexts
                    phase={phase}
                    yPos={yPos}
                    xPos={xPos}
                    fullInput={fullInput}
                    currentOutput={currentOutput}
                    inputIndex={inputIndex}
                />
            </group>

            <OrbitControls enableZoom enablePan enableDamping dampingFactor={0.1} minDistance={15} maxDistance={40} />
            <Center />
        </Suspense>
    )
}

// --------------------- COMPOSANT PRINCIPAL ---------------------
export function RailFenceViz({ simulationData }: { simulationData: SimulationTrace | null }) {
    return (
        <Canvas camera={{ position: [0, 0, 25], fov: 50 }}>
            <ambientLight intensity={1.2} />
            <pointLight position={[10, 10, 10]} intensity={2} />
            <Scene simulationData={simulationData} />
        </Canvas>
    )
}