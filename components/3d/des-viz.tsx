// Fichier : components/3d/des-viz.tsx
"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import {
    OrbitControls,
    Text3D,
    Center,
    RoundedBox,
    Cylinder,
    Torus,
} from "@react-three/drei"
import React, { Suspense, useMemo, useState, useEffect, useRef } from "react"
import { Vector3, MathUtils, Group, Mesh } from "three"
import * as THREE from "three"
// --- AJOUT I18N ---
import { useTranslation } from "@/lib/i18n"
import { useLanguage } from "@/lib/language-context"

// Assurez-vous que ce fichier de police existe bien dans /public/fonts/
const FONT_URL = "/fonts/helvetiker_bold.typeface.json"

// --- MODÈLE DE CADENAS (similaire à César) ---
function PadlockModel() {
    const group = useRef<Group>(null!)
    // Rotation lente
    useFrame((_, delta) => {
        group.current.rotation.y += delta * 0.1
    })

    return (
        <group ref={group} position={[0, 1, 0]} scale={1.8}>
            {/* Corps */}
            <RoundedBox args={[2, 1.5, 0.5]} radius={0.15} smoothness={4}>
                <meshStandardMaterial color="#aaa" metalness={0.9} roughness={0.2} />
            </RoundedBox>
            {/* Trou de serrure */}
            <mesh position={[0, -0.25, 0.255]}>
                <Cylinder args={[0.1, 0.1, 0.1, 32]} rotation={[Math.PI / 2, 0, 0]} />
                <meshStandardMaterial color="#222" metalness={1} roughness={0.1} />
            </mesh>
            <mesh position={[0, -0.4, 0.255]}>
                <boxGeometry args={[0.05, 0.2, 0.1]} />
                <meshStandardMaterial color="#222" metalness={1} roughness={0.1} />
            </mesh>
            {/* Anse */}
            <Torus
                args={[0.6, 0.1, 16, 32, Math.PI]}
                position={[0, 1, 0]}
                rotation={[0, 0, Math.PI]}
            >
                <meshStandardMaterial color="#888" metalness={0.9} roughness={0.3} />
            </Torus>
            <Cylinder args={[0.1, 0.1, 0.5, 16]} position={[-0.6, 0.75, 0]}>
                <meshStandardMaterial color="#888" metalness={0.9} roughness={0.3} />
            </Cylinder>
            <Cylinder args={[0.1, 0.1, 0.5, 16]} position={[0.6, 0.75, 0]}>
                <meshStandardMaterial color="#888" metalness={0.9} roughness={0.3} />
            </Cylinder>
        </group>
    )
}

// --- TEXTES ENTRÉE/SORTIE ---
const IOTexts = React.memo(({ plainText, cipherText, t }: { plainText: string, cipherText: string, t: (key: string, vars?: any) => string }) => {
    return (
        <group>
            <Text3D font={FONT_URL} size={0.6} height={0.1} position={[-15, 5, 0]}>
                {t("viz.des.input", { plainText })}
                <meshStandardMaterial color="#8B5CF6" />
            </Text3D>
            <Text3D font={FONT_URL} size={0.6} height={0.1} position={[2, 5, 0]}>
                {t("viz.des.output", { cipherText })}
                <meshStandardMaterial color="#EC4899" />
            </Text3D>
        </group>
    )
})
IOTexts.displayName = "IOTexts"


// --- BLOC 3D ANIMÉ ---
function AnimatedBlock({
                           textIn,
                           textOut,
                           onComplete,
                       }: {
    textIn: string
    textOut: string
    onComplete: () => void
}) {
    const inRef = useRef<Group>(null!)
    const outRef = useRef<Group>(null!)
    const padlockRef = useRef<Group>(null!) // Référence au cadenas
    const [phase, setPhase] = useState<"in" | "transform" | "out" | "done">("in")
    const progress = useRef(0)

    // Positions
    const startPos = useMemo(() => new Vector3(-8, 5, 0), [])
    const lockPos = useMemo(() => new Vector3(0, 1, 0.5), [])
    const endPos = useMemo(() => new Vector3(8, 5, 0), [])

    useFrame((state, delta) => {
        progress.current += delta

        if (phase === "in" && inRef.current) {
            inRef.current.position.lerp(lockPos, delta * 3)
            if (inRef.current.position.distanceTo(lockPos) < 0.1) {
                inRef.current.visible = false
                setPhase("transform")
                progress.current = 0
            }
        } else if (phase === "transform") {
            // Fait pulser le cadenas 16 fois (pour les 16 rounds)
            const pulseSpeed = 16
            const scale = 1.8 + Math.sin(progress.current * pulseSpeed * 2) * 0.2 // Pulse plus fort
            if (padlockRef.current) {
                padlockRef.current.scale.set(scale, scale, scale)
            }

            // Après la "transformation" (dure 2 secondes)
            if (progress.current > 2) {
                outRef.current.visible = true
                setPhase("out")
                progress.current = 0
                if (padlockRef.current) {
                    padlockRef.current.scale.set(1.8, 1.8, 1.8) // Reset scale
                }
            }
        } else if (phase === "out" && outRef.current) {
            outRef.current.position.lerp(endPos, delta * 3)
            if (outRef.current.position.distanceTo(endPos) < 0.1) {
                setPhase("done")
                onComplete()
            }
        }
    })

    return (
        <>
            {/* Cadenas (maintenant à l'intérieur de l'animation) */}
            <group ref={padlockRef}>
                <PadlockModel />
            </group>

            {/* Bloc entrant */}
            <group ref={inRef} position={startPos} >
                <Text3D font={FONT_URL} size={0.6} height={0.2}>
                    {textIn}
                    <meshStandardMaterial color="#8B5CF6" />
                </Text3D>
            </group>

            {/* Bloc sortant (commence à la position du cadenas) */}
            <group ref={outRef} position={lockPos} visible={false}>
                <Text3D font={FONT_URL} size={0.6} height={0.2}>
                    {textOut}
                    <meshStandardMaterial color="#EC4899" />
                </Text3D>
            </group>
        </>
    )
}

// --- SCÈNE PRINCIPALE ---
function Scene({ simulationData }: { simulationData: any }) {
    const { language } = useLanguage()
    const t = useTranslation(language)

    const [isRunning, setIsRunning] = useState(false)

    const { plainText, cipherText } = useMemo(() => {
        if (!simulationData) {
            return { plainText: t("viz.textDefault"), cipherText: "..." }
        }

        // CORRECTION: 'simulationData' contient maintenant les étapes ('steps')
        // ET le résultat de 'execute' ('finalOutput')

        // 1. Trouve le texte d'origine dans les étapes de simulation
        const plainText =
            simulationData.steps?.[0]?.description.match(/'([^']+)'/)?.[1] || "CryptoLab"

        // 2. Trouve le texte chiffré (tronqué)
        const cipherHex = (simulationData.final_result_hex || ".....")
        const cipherText = cipherHex.substring(0, 8) + "..."

        return { plainText, cipherText }
    }, [simulationData, t]) // Ajout de 't'

    // Gérer le redémarrage
    useEffect(() => {
        if (simulationData) {
            setIsRunning(true)
        }
    }, [simulationData])

    const handleAnimationComplete = () => {
        // Boucle
        setTimeout(() => {
            setIsRunning(true)
        }, 2000) // Pause de 2s
        setIsRunning(false)
    }

    return (
        <Suspense fallback={null}>

            <IOTexts plainText={plainText} cipherText={cipherText} t={t} />

            {isRunning ? (
                <AnimatedBlock
                    key={Date.now()} // Force le re-montage
                    textIn={plainText}
                    textOut={cipherText}
                    onComplete={handleAnimationComplete}
                />
            ) : (
                <PadlockModel /> // Affiche juste le cadenas statique
            )}

            <OrbitControls
                enableZoom={true}
                autoRotate={!isRunning}
                autoRotateSpeed={0.5}
            />
        </Suspense>
    )
}

export function DesViz({ simulationData }: { simulationData: any }) {
    return (
        <Canvas camera={{ position: [0, 2, 18], fov: 60 }}>
            <ambientLight intensity={1.5} />
            <directionalLight position={[5, 10, 5]} intensity={2} />
            <directionalLight position={[-5, -10, -5]} intensity={1} />
            <Scene simulationData={simulationData} />
        </Canvas>
    )
}