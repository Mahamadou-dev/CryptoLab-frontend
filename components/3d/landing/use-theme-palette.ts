"use client"

import { useEffect, useState } from "react"

/**
 * Lit la palette du theme actif depuis les variables CSS.
 *
 * Three.js ne comprend pas `var(--color-primary)` : il lui faut une couleur
 * concrete. Plutot que de figer des valeurs en double dans le code de la scene,
 * on les extrait du DOM — la scene suit ainsi le changement de theme.
 */
export interface Palette {
    primary: string
    secondary: string
    tertiary: string
}

const FALLBACK: Palette = {
    primary: "#7e22ce",
    secondary: "#ec4899",
    tertiary: "#c026d3",
}

export function useThemePalette(): Palette {
    // Le rendu serveur n'a pas de DOM : on part du repli, puis on corrige au
    // montage. Sans cela, l'hydratation differerait entre serveur et client.
    const [palette, setPalette] = useState<Palette>(FALLBACK)

    useEffect(() => {
        const read = () => {
            const styles = getComputedStyle(document.documentElement)
            const pick = (name: string, fallback: string) =>
                styles.getPropertyValue(name).trim() || fallback

            setPalette({
                primary: pick("--color-primary", FALLBACK.primary),
                secondary: pick("--color-secondary", FALLBACK.secondary),
                tertiary: pick("--color-tertiary", FALLBACK.tertiary),
            })
        }

        read()

        // Le theme se change en basculant une classe sur <html>.
        const observer = new MutationObserver(read)
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class", "data-theme"],
        })
        return () => observer.disconnect()
    }, [])

    return palette
}
