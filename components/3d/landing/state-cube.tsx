"use client"

import { useEffect, useMemo, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

import type { Palette } from "./use-theme-palette"

/**
 * Le cube d'etat : 4 x 4 x 4 octets en volume.
 *
 * Ce n'est pas une decoration abstraite. C'est la matrice d'etat d'AES empilee
 * sur quatre tours : un plan de balayage la traverse, et les octets qu'il touche
 * changent de couleur et se decalent — l'image de la transformation appliquee
 * tour par tour.
 *
 * Les 64 cubes sont un seul `InstancedMesh` : un appel de dessin, pas 64.
 */

const SIDE = 4
const COUNT = SIDE * SIDE * SIDE
const SPACING = 0.62
const OFFSET = ((SIDE - 1) * SPACING) / 2

interface CellData {
    home: THREE.Vector3
    /** Position du cube le long de l'axe de balayage, dans [0, 1]. */
    phase: number
    /** Decalage propre, pour que les octets ne bougent pas tous a l'identique. */
    jitter: number
}

export function StateCube({
    palette,
    animated,
    speed = 0.35,
}: {
    palette: Palette
    animated: boolean
    speed?: number
}) {
    const meshRef = useRef<THREE.InstancedMesh>(null)
    const groupRef = useRef<THREE.Group>(null)

    // Objets reutilises a chaque image : en allouer dans useFrame declencherait
    // le ramasse-miettes 60 fois par seconde.
    const scratch = useMemo(
        () => ({
            matrix: new THREE.Matrix4(),
            color: new THREE.Color(),
            quat: new THREE.Quaternion(),
            axis: new THREE.Vector3(0, 1, 0),
            position: new THREE.Vector3(),
            scale: new THREE.Vector3(),
        }),
        [],
    )

    // Geometrie du contour, construite une fois : la recreer a chaque rendu
    // fuirait de la memoire GPU.
    const outline = useMemo(() => new THREE.EdgesGeometry(new THREE.BoxGeometry(2.7, 2.7, 2.7)), [])

    // R3F libere ce qu'il a lui-meme cree ; cette geometrie vient d'ailleurs,
    // c'est donc a nous de la rendre.
    useEffect(() => () => outline.dispose(), [outline])

    const cells = useMemo<CellData[]>(() => {
        const list: CellData[] = []
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
                        // pas de scintillement au remontage du composant.
                        jitter: ((x * 7 + y * 13 + z * 29) % 16) / 16,
                    })
                }
            }
        }
        return list
    }, [])

    const colors = useMemo(
        () => ({
            calm: new THREE.Color(palette.primary),
            active: new THREE.Color(palette.secondary),
        }),
        [palette.primary, palette.secondary],
    )

    useFrame(({ clock }) => {
        const mesh = meshRef.current
        if (!mesh) return

        // En mouvement reduit, on dessine une seule fois une pose lisible plutot
        // que d'animer : l'information reste, l'agitation disparait.
        const time = animated ? clock.elapsedTime * speed : 0.42
        if (!animated && mesh.userData.settled) return

        // Front de balayage qui remonte le cube en boucle.
        const front = (time % 1.6) / 1.6

        for (let index = 0; index < COUNT; index += 1) {
            const cell = cells[index]

            // Proximite au front : 1 quand le plan traverse l'octet, 0 loin de lui.
            const distance = Math.abs(cell.phase - front)
            const heat = Math.max(0, 1 - distance * 5)

            const lift = heat * 0.28 * (0.6 + cell.jitter * 0.8)
            const scale = 0.42 + heat * 0.22

            scratch.scale.setScalar(scale)
            scratch.quat.setFromAxisAngle(scratch.axis, heat * Math.PI * 0.5)
            scratch.position.set(cell.home.x, cell.home.y + lift, cell.home.z)
            scratch.matrix.compose(scratch.position, scratch.quat, scratch.scale)
            mesh.setMatrixAt(index, scratch.matrix)
            mesh.setColorAt(index, scratch.color.copy(colors.calm).lerp(colors.active, heat))
        }

        mesh.instanceMatrix.needsUpdate = true
        if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
        mesh.userData.settled = !animated

        if (groupRef.current && animated) {
            groupRef.current.rotation.y = clock.elapsedTime * 0.12
            groupRef.current.rotation.x = Math.sin(clock.elapsedTime * 0.2) * 0.12
        }
    })

    return (
        <group ref={groupRef} rotation={[0.25, 0.6, 0]}>
            <instancedMesh ref={meshRef} args={[undefined, undefined, COUNT]} castShadow>
                <boxGeometry args={[1, 1, 1]} />
                {/* PBR plutot que Phong : c'est la rugosite et le metal qui
                    donnent du relief, pas le nombre de lampes. */}
                <meshStandardMaterial roughness={0.28} metalness={0.65} envMapIntensity={1.4} />
            </instancedMesh>

            {/* Arete du volume : rappelle la grille qui structure tout le site. */}
            <lineSegments geometry={outline}>
                <lineBasicMaterial color={palette.tertiary} transparent opacity={0.35} />
            </lineSegments>
        </group>
    )
}
