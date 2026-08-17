"use client"

import { useEffect, useRef } from "react"

/**
 * Progression du defilement de la page, dans [0, 1].
 *
 * Volontairement hors de React : la valeur change a chaque image, et la faire
 * transiter par un `useState` provoquerait un rendu React par frame. On expose
 * une reference mutable, lue directement dans la boucle de rendu de Three.js.
 *
 * `scrollY` est lu dans un ecouteur passif et rangé tel quel ; le lissage est
 * fait cote scene, ou l'on connait le delta de temps.
 */
export function useScrollProgress() {
    const progress = useRef(0)

    useEffect(() => {
        const read = () => {
            const scrollable = document.documentElement.scrollHeight - window.innerHeight
            // Page trop courte pour defiler : on reste a l'ouverture.
            progress.current = scrollable > 0 ? window.scrollY / scrollable : 0
        }

        read()
        window.addEventListener("scroll", read, { passive: true })
        window.addEventListener("resize", read)

        return () => {
            window.removeEventListener("scroll", read)
            window.removeEventListener("resize", read)
        }
    }, [])

    return progress
}
