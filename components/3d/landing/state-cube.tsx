"use client"

import { useEffect, useMemo, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

import type { Palette } from "./use-theme-palette"

/**
 * Le cube d'etat : 4 x 4 x 4 octets en volume.
 *
 * Ce n'est pas une decoration abstraite. C'est la matrice d'etat d'AES empilee
 * sur quatre tours : une onde de transformation la traverse de bas en haut, et
 * les octets qu'elle touche s'elevent, pivotent d'un quart de tour et
 * s'embrasent — l'image de la substitution appliquee tour par tour.
 *
 * Les 64 octets sont un seul `InstancedMesh` : un appel de dessin, pas 64.
 * L'emission est portee par une couleur d'instance, ce qui permet au bloom de
 * ne selectionner que les octets reellement actifs.
 */

const SIDE = 4
const COUNT = SIDE * SIDE * SIDE
const SPACING = 0.58
const OFFSET = ((SIDE - 1) * SPACING) / 2

interface Cell {
    home: THREE.Vector3
    /** Position le long de l'axe de balayage, dans [0, 1]. */
    phase: number
    /** Decalage propre : les octets ne reagissent pas tous a l'identique. */
    jitter: number
}

export function StateCube({
    palette,
    animated,
    speed = 0.32,
}: {
    palette: Palette
    animated: boolean
    speed?: number
}) {
    const meshRef = useRef<THREE.InstancedMesh>(null)
    const groupRef = useRef<THREE.Group>(null)

    const scratch = useMemo(
        () => ({
            matrix: new THREE.Matrix4(),
            color: new THREE.Color(),
            quat: new THREE.Quaternion(),
            axisY: new THREE.Vector3(0, 1, 0),
            position: new THREE.Vector3(),
            scale: new THREE.Vector3(),
        }),
        [],
    )

    // Un cube legerement biseaute accroche la lumiere sur ses aretes ; une boite
    // vive reste plate quel que soit l'eclairage.
    const geometry = useMemo(() => new THREE.BoxGeometry(1, 1, 1, 2, 2, 2), [])
    const outline = useMemo(
        () => new THREE.EdgesGeometry(new THREE.BoxGeometry(2.55, 2.55, 2.55)),
        [],
    )

    // R3F libere ce qu'il cree lui-meme ; ces geometries viennent d'ailleurs.
    useEffect(() => {
        return () => {
            geometry.dispose()
            outline.dispose()
        }
    }, [geometry, outline])

    const cells = useMemo<Cell[]>(() => {
        const list: Cell[] = []
        for (let x = 0; x < SIDE; x += 1) {
            for (let y = 0; y < SIDE; y += 1) {
                for (let z = 0; z < SIDE; z += 1) {
                    list.push({
                        home: new THREE.Vector3(
                            x * SPACING - OFFSET,
                            y * SPACING - OFFSET,
                            z * SPACING - OFFSET,
                        ),
                        phase: y / (SIDE - 1),
                        // Suite deterministe : identique a chaque rendu, donc
                        // aucun scintillement au remontage du composant.
                        jitter: ((x * 7 + y * 13 + z * 29) % 16) / 16,
                    })
                }
            }
        }
        return list
    }, [])

    const colors = useMemo(
        () => ({
            // Acier au repos, tinte a peine par la couleur du theme : l'accent
            // reste reserve a l'octet que l'onde traverse.
            calm: new THREE.Color("#8a8d96").lerp(new THREE.Color(palette.primary), 0.12),
            active: new THREE.Color(palette.secondary),
        }),
        [palette.primary, palette.secondary],
    )

    useFrame(({ clock }) => {
        const mesh = meshRef.current
        if (!mesh) return

        // En mouvement reduit, on compose une pose lisible une seule fois :
        // l'information demeure, l'agitation disparait.
        if (!animated && mesh.userData.settled) return
        const time = animated ? clock.elapsedTime * speed : 0.42

        const front = (time % 1.7) / 1.7

        for (let index = 0; index < COUNT; index += 1) {
            const cell = cells[index]

            // Proximite a l'onde : 1 quand elle traverse l'octet, 0 loin d'elle.
            const heat = Math.max(0, 1 - Math.abs(cell.phase - front) * 4.5)
            const eased = heat * heat * (3 - 2 * heat)

            const lift = eased * 0.3 * (0.6 + cell.jitter * 0.8)
            const scale = 0.4 + eased * 0.16

            scratch.scale.setScalar(scale)
            scratch.quat.setFromAxisAngle(scratch.axisY, eased * Math.PI * 0.5)
            scratch.position.set(cell.home.x, cell.home.y + lift, cell.home.z)
            scratch.matrix.compose(scratch.position, scratch.quat, scratch.scale)
            mesh.setMatrixAt(index, scratch.matrix)

            // La couleur d'instance sert d'emission : au-dela de 1, le bloom
            // s'en empare et l'octet actif devient une source lumineuse.
            scratch.color.copy(colors.calm).lerp(colors.active, eased)
            if (eased > 0.01) scratch.color.multiplyScalar(1 + eased * 1.1)
            mesh.setColorAt(index, scratch.color)
        }

        mesh.instanceMatrix.needsUpdate = true
        if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
        mesh.userData.settled = !animated

        if (groupRef.current && animated) {
            groupRef.current.rotation.y = clock.elapsedTime * 0.1
            groupRef.current.rotation.x = Math.sin(clock.elapsedTime * 0.17) * 0.09
        }
    })

    return (
        <group ref={groupRef} rotation={[0.22, 0.55, 0]}>
            <instancedMesh
                ref={meshRef}
                args={[geometry, undefined, COUNT]}
                castShadow
                receiveShadow
            >
                {/*
                    Metal brosse plutot que plastique brillant : c'est la
                    rugosite moyenne qui produit les reflets etires, et c'est
                    l'environnement — pas les lampes — qui les dessine.
                    `toneMapped={false}` laisse les octets actifs depasser 1
                    pour que le bloom les selectionne.
                */}
                <meshStandardMaterial
                    roughness={0.22}
                    metalness={0.92}
                    envMapIntensity={1.8}
                    toneMapped={false}
                />
            </instancedMesh>

            {/* Arete du volume : rappelle la grille qui structure tout le site. */}
            <lineSegments geometry={outline}>
                <lineBasicMaterial
                    color={palette.tertiary}
                    transparent
                    opacity={0.28}
                    toneMapped={false}
                />
            </lineSegments>
        </group>
    )
}
