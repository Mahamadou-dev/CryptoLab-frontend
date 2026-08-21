"use client"

import { Canvas } from "@react-three/fiber"
import {
    OrbitControls,
    Text3D,
    Center,
} from "@react-three/drei"
import React, { Suspense, useMemo, useState, useEffect, useRef } from "react"
import { Vector3 } from "three"
import type { SimulationTrace } from "@/lib/api-client"

// Assurez-vous que ce fichier existe bien dans /public/fonts/
const FONT_URL = "/fonts/helvetiker_bold.typeface.json"
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

/** Une étape brute de la trace `/api/simulate/vigenere`. */
interface VigenereRawStep {
    current_char?: string
    key_char_used?: string
    output_char?: string
    intermediate_result?: string
    description: string
}

interface LetterStep {
    plain: string
    key: string
    out: string
    result: string
}

// --- COMPOSANT POUR LA GRILLE 26x26 ---
const TabulaRectaGrid = React.memo(
    ({
         activeRow,
         activeCol,
     }: {
        activeRow: number
        activeCol: number
    }) => {
        const grid = useMemo(() => {
            const letters = []
            for (let r = 0; r < 26; r++) {
                for (let c = 0; c < 26; c++) {
                    const char = ALPHABET[(c + r) % 26]
                    letters.push({
                        char,
                        key: `${r}-${c}`,
                        position: new Vector3((c - 12.5) * 1, -(r - 12.5) * 1, 0),
                    })
                }
            }
            return letters
        }, [])

        return (
            <group>
                {grid.map(({ char, key, position }, index) => {
                    const r = Math.floor(index / 26)
                    const c = index % 26

                    const isRow = r === activeRow
                    const isCol = c === activeCol
                    const isCell = isRow && isCol

                    let color = "#666"
                    if (isRow) color = "#8B5CF6" // Violet
                    if (isCol) color = "#8B5CF6" // Violet
                    if (isCell) color = "#EC4899" // Magenta

                    const scale = isCell ? 1.5 : 1
                    const intensity = isRow || isCol ? 0.8 : 0.1

                    return (
                        <Text3D
                            key={key}
                            font={FONT_URL}
                            size={0.5}
                            height={0.1}
                            position={position}
                            scale={scale}
                        >
                            {char}
                            <meshStandardMaterial
                                color={color}
                                emissive={color}
                                emissiveIntensity={intensity}
                            />
                        </Text3D>
                    )
                })}
            </group>
        )
    },
)
TabulaRectaGrid.displayName = "TabulaRectaGrid"

// --- COMPOSANT POUR LES TEXTES ENTRÉE/SORTIE ---
const IOTexts = React.memo(
    ({ plainText, cipherText, keyText }: { plainText: string; cipherText: string; keyText: string }) => {
        return (
            <group>
                {/* Texte en clair */}
                <Text3D
                    font={FONT_URL}
                    size={0.6}
                    height={0.1}
                    position={[-12, 16, 0]}
                >
                    {`Texte: ${plainText}`}
                    <meshStandardMaterial color="#8B5CF6" />
                </Text3D>
                {/* Mot-clé */}
                <Text3D
                    font={FONT_URL}
                    size={0.6}
                    height={0.1}
                    position={[0, 16, 0]}
                >
                    {`Clé: ${keyText}`}
                    <meshStandardMaterial color="#ffffff" />
                </Text3D>
                {/* Texte chiffré */}
                <Text3D
                    font={FONT_URL}
                    size={0.6}
                    height={0.1}
                    position={[-12, -16, 0]}
                >
                    {`Sortie: ${cipherText}`}
                    <meshStandardMaterial color="#EC4899" />
                </Text3D>
            </group>
        )
    },
)
IOTexts.displayName = "IOTexts"

// --- SCÈNE PRINCIPALE ---
function Scene({ simulationData }: { simulationData: SimulationTrace | null }) {
    const [currentStepIndex, setCurrentStepIndex] = useState(0)

    // 1. Extraire les données pertinentes de la simulation
    const { letterSteps, fullPlainText, fullKey } = useMemo(() => {
        if (!simulationData?.steps?.length) {
            return { letterSteps: [] as LetterStep[], fullPlainText: "", fullKey: "" }
        }

        const steps = simulationData.steps as VigenereRawStep[]

        // Extrait le texte original et la clé depuis l'étape 0
        const initStep = steps[0].description
        const fullPlainText = initStep.match(/Texte: '([^']*)'/)?.[1] || ""
        const fullKey = initStep.match(/Clé: '([^']*)'/)?.[1] || ""

        const letterSteps: LetterStep[] = steps
            .filter((s) => s.current_char && s.key_char_used)
            .map((s) => ({
                plain: s.current_char!.toUpperCase(),
                key: s.key_char_used!.toUpperCase(),
                out: (s.output_char ?? "").toUpperCase(),
                result: s.intermediate_result ?? "",
            }))
        return { letterSteps, fullPlainText, fullKey }
    }, [simulationData])

    // 2. Repart de zéro chaque fois qu'une nouvelle trace arrive — comparaison
    // à une ref pendant le rendu (motif documenté par React : "Storing
    // information from previous renders"), pas dans un effet.
    const previousSteps = useRef(letterSteps)
    /* eslint-disable react-hooks/refs -- lecture et ecriture de ref pendant le rendu, motif documente par React */
    if (previousSteps.current !== letterSteps) {
        previousSteps.current = letterSteps
        if (currentStepIndex !== 0) setCurrentStepIndex(0)
    }
    /* eslint-enable react-hooks/refs */

    // 3. Logique de l'animation (boucle)
    useEffect(() => {
        if (!letterSteps.length) return
        const interval = setInterval(() => {
            setCurrentStepIndex((prevIndex) => (prevIndex + 1) % letterSteps.length)
        }, 1500) // Change de lettre toutes les 1.5 secondes
        return () => clearInterval(interval)
    }, [letterSteps])

    // 3. Déterminer l'état actuel de l'animation
    const activeStep = letterSteps[currentStepIndex]
    const activeRow = activeStep ? ALPHABET.indexOf(activeStep.plain) : -1
    const activeCol = activeStep ? ALPHABET.indexOf(activeStep.key) : -1

    const plainText = fullPlainText.substring(0, currentStepIndex + 1)
    const keyText = fullKey.repeat(10).substring(0, currentStepIndex + 1) // Répète la clé
    const cipherText = activeStep ? activeStep.result : ""

    return (
        <Suspense fallback={null}>
            <Center>
                <group>
                    <TabulaRectaGrid activeRow={activeRow} activeCol={activeCol} />
                    <IOTexts plainText={plainText} cipherText={cipherText} keyText={keyText} />
                </group>
            </Center>
            <OrbitControls
                enableZoom={true}
                enablePan={true}
                autoRotate={!activeStep}
                autoRotateSpeed={0.8}
                minDistance={10}
                maxDistance={40}
            />
        </Suspense>
    )
}

// --- COMPOSANT PRINCIPAL WRAPPER ---
export function VigenereViz({ simulationData }: { simulationData: SimulationTrace | null }) {
    return (
        <Canvas camera={{ position: [0, 0, 30], fov: 50 }} gl={{ antialias: true }}>
            <ambientLight intensity={1.5} />
            <pointLight position={[10, 10, 10]} intensity={2} />
            <Scene simulationData={simulationData} />
        </Canvas>
    )
}