"use client"

import { useRef, type RefObject } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

/**
 * Cameras successives, enchainees par le defilement.
 *
 * La page ne contient qu'une seule scene : c'est la camera qui se deplace
 * pendant qu'on descend. Chaque station correspond a une section de la page,
 * et l'interpolation entre deux stations suit la progression du scroll.
 */
export interface Station {
    /** Ou se place la camera. */
    position: [number, number, number]
    /** Ou elle regarde. */
    target: [number, number, number]
}

/**
 * Quatre stations, du gros plan au plan large.
 *
 * On s'eloigne en descendant : la page commence sur l'octet et finit sur
 * l'ensemble du dispositif. C'est le mouvement inverse d'un zoom avant, et il
 * accompagne un texte qui va lui aussi du detail au general.
 */
export const STATIONS: Station[] = [
    { position: [0, 0.6, 6.2], target: [0, 0.1, 0] },
    { position: [4.4, 1.9, 5.4], target: [0, 0.2, 0] },
    { position: [-4.8, 2.6, 6.0], target: [0, 0.4, 0] },
    { position: [0, 4.2, 10.5], target: [0, 0.2, 0] },
]

export function CameraRig({
    progress,
    enabled,
    pointerInfluence = 0.5,
}: {
    progress: RefObject<number>
    enabled: boolean
    pointerInfluence?: number
}) {
    // Objets reutilises : en allouer dans la boucle declencherait le
    // ramasse-miettes soixante fois par seconde.
    const scratch = useRef({
        position: new THREE.Vector3(...STATIONS[0].position),
        target: new THREE.Vector3(...STATIONS[0].target),
        desiredPosition: new THREE.Vector3(),
        desiredTarget: new THREE.Vector3(),
        a: new THREE.Vector3(),
        b: new THREE.Vector3(),
    })

    useFrame(({ camera, pointer }, delta) => {
        const s = scratch.current

        // Ou sommes-nous entre deux stations ?
        const t = THREE.MathUtils.clamp(progress.current ?? 0, 0, 1) * (STATIONS.length - 1)
        const index = Math.min(Math.floor(t), STATIONS.length - 2)
        const local = t - index

        // Lissage en cosinus : la camera repart et arrive sans a-coup, ce qu'un
        // enchainement lineaire ne donne pas.
        const eased = 0.5 - Math.cos(Math.PI * THREE.MathUtils.clamp(local, 0, 1)) / 2

        s.desiredPosition
            .fromArray(STATIONS[index].position)
            .lerp(s.b.fromArray(STATIONS[index + 1].position), eased)
        s.desiredTarget
            .fromArray(STATIONS[index].target)
            .lerp(s.a.fromArray(STATIONS[index + 1].target), eased)

        if (enabled) {
            // Le pointeur ne pilote pas la camera, il la fait respirer : une
            // derive de quelques dixiemes suffit a donner du volume sans
            // desorienter au defilement.
            s.desiredPosition.x += pointer.x * pointerInfluence
            s.desiredPosition.y += pointer.y * pointerInfluence * 0.6
        }

        // Amortissement exponentiel : meme douceur quel que soit le framerate,
        // contrairement a un lerp a facteur fixe.
        const factor = enabled ? 1 - Math.exp(-3.2 * delta) : 1
        s.position.lerp(s.desiredPosition, factor)
        s.target.lerp(s.desiredTarget, factor)

        camera.position.copy(s.position)
        camera.lookAt(s.target)
    })

    return null
}
