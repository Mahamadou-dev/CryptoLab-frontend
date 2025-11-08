// Fichier: components/3d/playfair-viz.tsx
"use client"

import React, { Suspense, useMemo, useState, useEffect, useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import {
    OrbitControls,
    Text3D,
    Center,
    Plane,
    Line,
} from "@react-three/drei"
import { Group, Vector3, Color } from "three"
import * as THREE from "three"
// --- AJOUT I18N ---
import { useTranslation } from "@/lib/i18n"
import { useLanguage } from "@/lib/language-context"

// Assurez-vous que ce fichier existe bien dans /public/fonts/
const FONT_URL = "/fonts/helvetiker_bold.typeface.json"

// --- COMPOSANT 1: GRILLE STATIQUE ---
const StaticGrid = React.memo(({ matrix }: { matrix: string[][] }) => {
    return (
        <group>
            {matrix.map((row, r) =>
                row.map((char, c) => (
                    <group
                        key={`${r}-${c}`}
                        position={new Vector3((c - 2) * 2.5, -(r - 2) * 2.5, 0)}
                    >
                        <Text3D
                            font={FONT_URL}
                            size={1}
                            height={0.1}
                            position={[-0.4, -0.4, 0.1]}
                        >
                            {char}
                            <meshStandardMaterial
                                color={"#666"}
                                emissive={"#000"}
                                emissiveIntensity={0.1}
                            />
                        </Text3D>
                    </group>
                )),
            )}
        </group>
    )
})
StaticGrid.displayName = "StaticGrid"

// --- COMPOSANT 2: SURBRILLANCES DYNAMIQUES ---
const DynamicHighlights = React.memo(
    ({
         coords,
         ruleKey, // Clé de traduction pour la règle
     }: {
        coords: {
            in: [number, number][]
            out: [number, number][]
        }
        ruleKey: string
    }) => {
        const { in: inCoords, out: outCoords } = coords

        // Calcule les points du rectangle
        const linePoints = useMemo(() => {
            if (ruleKey !== "viz.playfair.rectangle" || inCoords.length < 2) return []
            const [r1, c1] = inCoords[0]
            const [r2, c2] = inCoords[1]
            if (r1 < 0 || c1 < 0 || r2 < 0 || c2 < 0) return []

            const p1 = new Vector3((c1 - 2) * 2.5, -(r1 - 2) * 2.5, 0.1)
            const p2 = new Vector3((c2 - 2) * 2.5, -(r1 - 2) * 2.5, 0.1)
            const p3 = new Vector3((c2 - 2) * 2.5, -(r2 - 2) * 2.5, 0.1)
            const p4 = new Vector3((c1 - 2) * 2.5, -(r2 - 2) * 2.5, 0.1)
            return [p1, p2, p3, p4, p1]
        }, [ruleKey, inCoords])

        // Crée une grille de 25 "slots" pour les highlights
        const highlights = []
        for (let r = 0; r < 5; r++) {
            for (let c = 0; c < 5; c++) {
                const isInput = inCoords.some(
                    (coord) => coord[0] === r && coord[1] === c,
                )
                const isOutput = outCoords.some(
                    (coord) => coord[0] === r && coord[1] === c,
                )
                const isRow =
                    ruleKey === "viz.playfair.sameRow" && inCoords.some((coord) => coord[0] === r)
                const isCol =
                    ruleKey === "viz.playfair.sameColumn" && inCoords.some((coord) => coord[1] === c)

                if (isInput || isOutput || isRow || isCol) {
                    let color = "#6924fd" // Violet (Entrée, Ligne, Colonne)
                    if (isOutput) color = "#fa077e" // Magenta (Sortie)

                    highlights.push(
                        <Plane
                            key={`${r}-${c}`}
                            args={[2.2, 2.2]} // Légèrement plus grand pour ne pas chevaucher le texte
                            position={new Vector3((c - 2) * 2.5, -(r - 2) * 2.5, -0.05)}
                        >
                            <meshStandardMaterial
                                color={color}
                                opacity={0.3}
                                transparent
                            />
                        </Plane>,
                    )
                }
            }
        }

        return (
            <group>
                {highlights}
                {ruleKey === "viz.playfair.rectangle" && linePoints.length > 0 && (
                    <Line points={linePoints} color="#EC4899" lineWidth={3} />
                )}
            </group>
        )
    },
)
DynamicHighlights.displayName = "DynamicHighlights"

// --- COMPOSANT 3: TEXTES (Corrigé avec Highlighting) ---
const IOTexts = React.memo(
    ({
         digrams,
         currentStep,
         currentStepIndex,
         t, // Traducteur
     }: {
        digrams: string[]
        currentStep: any
        currentStepIndex: number
        t: (key: string) => string
    }) => {
        const output = currentStep ? currentStep.result : ""
        const rule = currentStep ? currentStep.rule : t("viz.playfair.waiting")

        // Calcule la position X de départ pour chaque digramme
        const digramPositions = useMemo(() => {
            let x = -12;
            return digrams.map(d => {
                const pos = x;
                // Calcule la "largeur" du digramme + un espace
                const width = (d.length * 0.6 * 0.8) + 0.7; // (taille * lettres * facteur) + espace
                x += width;
                return pos;
            });
        }, [digrams]);

        return (
            <group>
                {/* Titre "ENTRÉE" */}
                <Text3D font={FONT_URL} size={0.5} height={0.1} position={[-12, 8.8, 0]}>
                    {t("viz.playfair.input")}
                    <meshStandardMaterial color="#8B5CF6" />
                </Text3D>

                {/* --- CORRECTION : Affiche TOUS les digrammes et colore l'actif --- */}
                <group position={[0, 8, 0]}>
                    {digrams.map((digram, index) => {
                        const isActive = index === currentStepIndex
                        const isProcessed = index < currentStepIndex

                        let color = "#ffffff" // Défaut (restant)
                        if (isProcessed) color = "#afaaaa" // Traité (gris)
                        if (isActive) color = "#6d31ff" // Actif (Violet)

                        return (
                            <Text3D
                                key={index}
                                font={FONT_URL}
                                size={0.6}
                                height={0.1}
                                position={[digramPositions[index], 0, 0]}
                            >
                                {digram}
                                <meshStandardMaterial
                                    color={color}
                                    emissive={color}
                                    emissiveIntensity={isActive ? 0.5 : 0.1}
                                />
                            </Text3D>
                        )
                    })}
                </group>
                {/* --- FIN CORRECTION --- */}

                {/* Titre "SORTIE" */}
                <Text3D font={FONT_URL} size={0.5} height={0.1} position={[-12, -7.2, 0]}>
                    {t("viz.playfair.output")}
                    <meshStandardMaterial color="#EC4899" />
                </Text3D>
                <Text3D font={FONT_URL} size={0.6} height={0.1} position={[-12, -8, 0]}>
                    {output}
                    <meshStandardMaterial color="#ffffff" />
                </Text3D>

                {/* Titre "RÈGLE" */}
                <Text3D font={FONT_URL} size={0.5} height={0.1} position={[8, 0.8, 0]}>
                    {t("viz.playfair.rule")}
                    <meshStandardMaterial color="#ffffff" />
                </Text3D>
                <Text3D font={FONT_URL} size={0.6} height={0.1} position={[8, 0, 0]}>
                    {rule}
                    <meshStandardMaterial
                        color={rule === t("viz.playfair.errorParsing") ? "red" : "#ffffff"}
                    />
                </Text3D>
            </group>
        )
    },
)
IOTexts.displayName = "IOTexts"

// --- SCÈNE PRINCIPALE ---
function Scene({ simulationData }: { simulationData: any }) {
    const { language } = useLanguage()
    const t = useTranslation(language)

    const [currentStepIndex, setCurrentStepIndex] = useState(0)

    // Parse les données une seule fois
    const { matrix, digrams, encryptionSteps } = useMemo(() => {
        if (!simulationData?.steps?.length) {
            return { matrix: [], digrams: [], encryptionSteps: [] }
        }

        const matrixStep = simulationData.steps.find(
            (s: any) => s.phase === "Matrix Generation" && s.matrix,
        )
        const matrix = matrixStep ? matrixStep.matrix : []

        // S'assure de gérer les espaces dans les digrammes
        const formatStep = simulationData.steps.find(
            (s: any) => s.phase === "Message Formatting" && s.intermediate_result,
        )
        // Recrée les digrammes à partir du message formaté (qui inclut les espaces)
        const digrams = formatStep
            ? formatStep.intermediate_result.match(/(\S\S|\s)/g) || []
            : []

        const encryptionSteps = simulationData.steps
            .filter((s: any) => s.phase === "Encryption" && s.input_digram)
            .map((s: any) => {
                // Regex pour trouver " 'A' est en (R, C) "
                const inRegex = /'([^']*)' est en \((-?\d+), (-?\d+)\)/g
                const inMatches = [...s.description.matchAll(inRegex)]

                // Regex pour trouver " -> 'Q' (R,C) "
                const outRegex = /-> '([^']*)' \((\-?\d+),(\-?\d+)\)/g
                const outMatches = [...s.description.matchAll(outRegex)]

                if (inMatches.length < 2 || outMatches.length < 2) {
                    // Gère les caractères non-valides (comme les espaces)
                    if (s.input_digram.trim() === "") {
                        return {
                            in: s.input_digram, out: s.output_digram, result: s.intermediate_result,
                            coords: { in: [], out: [], rule: "viz.playfair.spaceKept" },
                            rule: t("viz.playfair.spaceKept"),
                        }
                    }
                    console.error("Impossible de parser la description:", s.description)
                    return {
                        in: s.input_digram,
                        out: s.output_digram,
                        result: s.intermediate_result,
                        coords: { in: [], out: [], rule: "viz.playfair.errorParsing" },
                        rule: t("viz.playfair.errorParsing"),
                    }
                }

                const inCoords = [
                    [parseInt(inMatches[0][2]), parseInt(inMatches[0][3])],
                    [parseInt(inMatches[1][2]), parseInt(inMatches[1][3])],
                ]

                const outCoords = [
                    [parseInt(outMatches[0][2]), parseInt(outMatches[0][3])],
                    [parseInt(outMatches[1][2]), parseInt(outMatches[1][3])],
                ]

                let rule = t("viz.playfair.unknown")
                let ruleKey = "viz.playfair.unknown"
                if (s.description.includes("Même ligne")) {
                    rule = t("viz.playfair.sameRow")
                    ruleKey = "viz.playfair.sameRow"
                }
                if (s.description.includes("Même colonne")) {
                    rule = t("viz.playfair.sameColumn")
                    ruleKey = "viz.playfair.sameColumn"
                }
                if (s.description.includes("Rectangle")) {
                    rule = t("viz.playfair.rectangle")
                    ruleKey = "viz.playfair.rectangle"
                }
                if (inCoords.some((coord: number[]) => coord[0] === -1)) {
                    rule = t("viz.playfair.charIgnored")
                    ruleKey = "viz.playfair.charIgnored"
                }


                return {
                    in: s.input_digram,
                    out: s.output_digram,
                    result: s.intermediate_result,
                    coords: { in: inCoords, out: outCoords },
                    ruleKey: ruleKey, // Envoie la clé
                    rule: rule, // Envoie la chaîne traduite
                }
            })

        return { matrix, digrams, encryptionSteps }
    }, [simulationData, t]) // Ajout de 't' comme dépendance

    // Logique de l'animation (boucle)
    useEffect(() => {
        if (!encryptionSteps.length) {
            setCurrentStepIndex(0)
            return
        }
        // Nettoie l'intervalle précédent
        const interval = setInterval(() => {
            setCurrentStepIndex(
                (prevIndex) => (prevIndex + 1) % encryptionSteps.length,
            )
        }, 2000) // Change de digramme toutes les 2 secondes
        return () => clearInterval(interval)
    }, [encryptionSteps]) // Dépend uniquement de encryptionSteps

    const activeStep = encryptionSteps[currentStepIndex]

    if (matrix.length === 0) {
        return (
            <Text3D font={FONT_URL} size={0.8} height={0.1}>
                <Center>{t("viz.playfair.runToSeeGrid")}</Center>
                <meshStandardMaterial color="#888" />
            </Text3D>
        )
    }

    return (
        <Suspense fallback={null}>
            <Center>
                <group>
                    {/* Le "visualisateur" léger qui se met à jour */}
                    <DynamicHighlights
                        coords={
                            activeStep
                                ? activeStep.coords
                                : { in: [], out: [] }
                        }
                        ruleKey={activeStep ? activeStep.ruleKey : ""}
                    />
                    {/* La grille lourde qui ne bouge pas */}
                    <StaticGrid matrix={matrix} />
                    {/* Les textes qui se mettent à jour */}
                    <IOTexts
                        digrams={digrams}
                        currentStep={activeStep}
                        currentStepIndex={currentStepIndex} // <-- Passe l'index ici
                        t={t} // Passe le traducteur
                    />
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
export function PlayfairViz({ simulationData }: { simulationData: any }) {
    return (
        <Canvas camera={{ position: [0, 0, 25], fov: 50 }} gl={{ antialias: true }}>
            <ambientLight intensity={1.5} />
            <pointLight position={[10, 10, 10]} intensity={2} />
            <Scene simulationData={simulationData} />
        </Canvas>
    )
}