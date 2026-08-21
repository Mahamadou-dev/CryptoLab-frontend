"use client"

import { useEffect, useMemo, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

import type { Palette } from "./use-theme-palette"

/**
 * L'anneau de substitution qui tourne autour du cube d'etat.
 *
 * Vingt-six barres disposees en cercle : l'alphabet du disque de Cesar. Une
 * onde en fait saillir quelques-unes a la fois — le decalage qui se propage.
 */

const BARS = 26
const RADIUS = 3.1

export function CipherRing({ palette, animated }: { palette: Palette; animated: boolean }) {
    const meshRef = useRef<THREE.InstancedMesh>(null)

    const scratch = useMemo(
        () => ({
            matrix: new THREE.Matrix4(),
            color: new THREE.Color(),
            quat: new THREE.Quaternion(),
            euler: new THREE.Euler(),
            position: new THREE.Vector3(),
            scale: new THREE.Vector3(),
        }),
        [],
    )

    const bars = useMemo(
        () =>
            Array.from({ length: BARS }, (_, index) => {
                const angle = (index / BARS) * Math.PI * 2
                return { angle, x: Math.cos(angle) * RADIUS, z: Math.sin(angle) * RADIUS }
            }),
        [],
    )

    const colors = useMemo(
        () => ({
            calm: new THREE.Color("#8a8d96").lerp(new THREE.Color(palette.tertiary), 0.18),
            active: new THREE.Color(palette.secondary),
        }),
        [palette.tertiary, palette.secondary],
    )

    useEffect(() => {
        // Premiere pose ecrite des le montage : sans elle, l'anneau apparaitrait
        // un instant empile a l'origine avant la premiere image animee.
        const mesh = meshRef.current
        if (mesh) mesh.userData.settled = false
    }, [])

    useFrame(({ clock }) => {
        const mesh = meshRef.current
        if (!mesh) return
        if (!animated && mesh.userData.settled) return

        const time = animated ? clock.elapsedTime : 1.1

        for (let index = 0; index < BARS; index += 1) {
            const bar = bars[index]
            // Onde qui parcourt l'anneau, resserree pour n'en eclairer qu'un arc.
            const wave = Math.sin(bar.angle * 3 - time * 1.6)
            const heat = Math.max(0, wave) ** 3

            scratch.position.set(bar.x, -1.6 + heat * 0.35, bar.z)
            scratch.euler.set(0, -bar.angle, 0)
            scratch.quat.setFromEuler(scratch.euler)
            scratch.scale.set(0.1, 0.24 + heat * 0.9, 0.1)
            scratch.matrix.compose(scratch.position, scratch.quat, scratch.scale)

            mesh.setMatrixAt(index, scratch.matrix)

            // Au-dela de 1, le bloom s'empare de la barre : seul l'arc actif
            // rayonne, le reste de l'anneau reste sobre.
            scratch.color.copy(colors.calm).lerp(colors.active, heat)
            if (heat > 0.01) scratch.color.multiplyScalar(1 + heat * 0.9)
            mesh.setColorAt(index, scratch.color)
        }

        mesh.instanceMatrix.needsUpdate = true
        if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
        mesh.userData.settled = !animated
    })

    return (
        <instancedMesh ref={meshRef} args={[undefined, undefined, BARS]} castShadow>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial
                roughness={0.3}
                metalness={0.85}
                envMapIntensity={1.5}
                toneMapped={false}
            />
        </instancedMesh>
    )
}
