"use client"

import { useEffect, useMemo, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

import type { Palette } from "./use-theme-palette"

/**
 * Colonnes d'octets qui montent lentement autour du cube.
 *
 * Le role est atmospherique : donner de la profondeur au volume et un sens de
 * circulation, sans jamais accrocher l'oeil plus que le cube lui-meme. Ce sont
 * de petites plaques, pas des points — une plaque prend la lumiere, un point
 * reste un pixel mort.
 *
 * Tout tient dans un seul `InstancedMesh`, et les plaques regardent la camera
 * pour rester lisibles quel que soit l'angle.
 */

const COUNT = 220
const RADIUS_MIN = 3.6
const RADIUS_MAX = 9
const HEIGHT = 14

interface Mote {
    radius: number
    angle: number
    /** Hauteur de depart, dans [0, 1]. */
    offset: number
    speed: number
    scale: number
}

export function ByteStream({ palette, animated }: { palette: Palette; animated: boolean }) {
    const meshRef = useRef<THREE.InstancedMesh>(null)

    const scratch = useMemo(
        () => ({
            matrix: new THREE.Matrix4(),
            color: new THREE.Color(),
            position: new THREE.Vector3(),
            scale: new THREE.Vector3(),
            quat: new THREE.Quaternion(),
        }),
        [],
    )

    const geometry = useMemo(() => new THREE.PlaneGeometry(0.075, 0.14), [])
    useEffect(() => () => geometry.dispose(), [geometry])

    // Distribution deterministe : un tirage aleatoire changerait a chaque
    // remontage, et le fond « sauterait » a la navigation.
    const motes = useMemo<Mote[]>(() => {
        const list: Mote[] = []
        for (let index = 0; index < COUNT; index += 1) {
            // Suite de Weyl : repartition reguliere sans amas, et sans Math.random.
            const golden = (index * 0.6180339887) % 1
            const second = (index * 0.7548776662) % 1
            list.push({
                radius: RADIUS_MIN + golden * (RADIUS_MAX - RADIUS_MIN),
                angle: second * Math.PI * 2,
                offset: (index * 0.4530199) % 1,
                speed: 0.16 + ((index * 13) % 7) / 40,
                scale: 0.55 + (((index * 17) % 11) / 11) * 0.9,
            })
        }
        return list
    }, [])

    const colors = useMemo(
        () => ({
            far: new THREE.Color(palette.primary),
            near: new THREE.Color(palette.secondary),
        }),
        [palette.primary, palette.secondary],
    )

    useFrame(({ clock, camera }) => {
        const mesh = meshRef.current
        if (!mesh) return
        if (!animated && mesh.userData.settled) return

        const time = animated ? clock.elapsedTime : 3
        // Les plaques font face a la camera : sans cela, elles disparaissent
        // des qu'on les regarde par la tranche.
        scratch.quat.copy(camera.quaternion)

        for (let index = 0; index < COUNT; index += 1) {
            const mote = motes[index]

            // Remontee en boucle : la partie fractionnaire ramene en bas.
            const climb = (mote.offset + time * mote.speed * 0.08) % 1
            const y = climb * HEIGHT - HEIGHT * 0.42
            const angle = mote.angle + time * 0.02

            scratch.position.set(
                Math.cos(angle) * mote.radius,
                y,
                Math.sin(angle) * mote.radius,
            )
            scratch.scale.setScalar(mote.scale)
            scratch.matrix.compose(scratch.position, scratch.quat, scratch.scale)
            mesh.setMatrixAt(index, scratch.matrix)

            // Les plus proches du centre sont les plus vives : la profondeur se
            // lit a la couleur autant qu'a la taille.
            const nearness = 1 - (mote.radius - RADIUS_MIN) / (RADIUS_MAX - RADIUS_MIN)
            // Fondu aux extremites, pour que rien n'apparaisse ni ne disparaisse net.
            const fade = Math.sin(climb * Math.PI)
            scratch.color.copy(colors.far).lerp(colors.near, nearness)
            scratch.color.multiplyScalar(0.25 + fade * nearness * 1.1)
            mesh.setColorAt(index, scratch.color)
        }

        mesh.instanceMatrix.needsUpdate = true
        if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
        mesh.userData.settled = !animated
    })

    return (
        <instancedMesh ref={meshRef} args={[geometry, undefined, COUNT]} frustumCulled={false}>
            <meshBasicMaterial
                transparent
                opacity={0.85}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
                toneMapped={false}
                side={THREE.DoubleSide}
            />
        </instancedMesh>
    )
}
