"use client"

import React, { createContext, useContext, useEffect, useState } from "react"

type Theme = "light" | "dark" | "system"
// REMARQUE : Ajout des nouveaux thèmes
type ColorTheme =
    | "gemini"
    | "purple"
    | "ocean"
    | "solar"
    | "emerald"
    | "cyber"
    | "pink"
    | "blue"
    | "red"
    | "magenta"

interface ThemeContextType {
    theme: Theme
    setTheme: (theme: Theme) => void
    colorTheme: ColorTheme
    setColorTheme: (color: ColorTheme) => void
    resolvedTheme: "light" | "dark" // L'état résolu
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

// REMARQUE : Ajout des nouvelles classes de thèmes
const colorThemeClasses: Record<ColorTheme, string> = {
    gemini: "theme-gemini",     // (Violet/Rose)
    purple: "theme-purple",   // (Violet clair)
    ocean: "theme-ocean",       // (Bleu/Turquoise)
    solar: "theme-solar",       // (Orange/Jaune)
    emerald: "theme-emerald",   // (Vert/Citron)
    cyber: "theme-cyber",       // (Cyan/Rose vif)

    // --- Thèmes de base (maintenant implémentés) ---
    pink: "theme-pink",
    blue: "theme-blue",
    red: "theme-red",
    magenta: "theme-magenta",
}

// Fonction pour obtenir le thème système
function getSystemTheme(): "light" | "dark" {
    if (typeof window === "undefined") return "light" // Par défaut "light" sur le serveur
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = useState<Theme>("system") // "system" est un meilleur défaut
    const [colorTheme, setColorThemeState] = useState<ColorTheme>("gemini")

    // REMARQUE : `resolvedTheme` est maintenant un état pour éviter les erreurs SSR
    const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light")

    const [mounted, setMounted] = useState(false)

    /** 🧠 Chargement initial depuis localStorage **/
    useEffect(() => {
        const storedTheme = (localStorage.getItem("theme") as Theme | null) || "system"
        const storedColor = (localStorage.getItem("colorTheme") as ColorTheme | null) || "gemini"

        setThemeState(storedTheme)
        setColorThemeState(storedColor)
        setResolvedTheme(storedTheme === "system" ? getSystemTheme() : storedTheme)

        setMounted(true)
    }, [])

    /** 🎛️ Application du thème (dark/light) et des couleurs **/
    useEffect(() => {
        if (!mounted) return

        const root = document.documentElement

        // 1. Déterminer le thème résolu
        const currentResolved = theme === "system" ? getSystemTheme() : theme
        setResolvedTheme(currentResolved) // Mettre à jour l'état

        // 2. Application du mode (dark/light)
        root.classList.toggle("dark", currentResolved === "dark")

        // 3. Application des classes de couleur
        Object.values(colorThemeClasses).forEach(cls => root.classList.remove(cls))
        root.classList.add(colorThemeClasses[colorTheme])

        // 4. Stockage local
        localStorage.setItem("theme", theme)
        localStorage.setItem("colorTheme", colorTheme)

        // 5. Transition douce
        root.style.transition = "background-color 0.4s ease, color 0.4s ease"

    }, [theme, colorTheme, mounted])

    // Écouteur pour les changements du mode système
    useEffect(() => {
        if (theme !== "system" || !mounted) return

        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")

        const handleChange = () => {
            const newResolved = mediaQuery.matches ? "dark" : "light"
            setResolvedTheme(newResolved)
            document.documentElement.classList.toggle("dark", newResolved === "dark")
        }

        mediaQuery.addEventListener("change", handleChange)
        return () => mediaQuery.removeEventListener("change", handleChange)
    }, [theme, mounted])


    const value = {
        theme,
        setTheme: setThemeState,
        colorTheme,
        setColorTheme: setColorThemeState,
        resolvedTheme, // Fournit l'état résolu
    }

    // Affiche les enfants uniquement après le montage pour éviter le "flash"
    if (!mounted) {
        return null // Ou un loader
    }

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

/** Hook personnalisé pour accéder au contexte **/
export function useTheme() {
    const context = useContext(ThemeContext)
    if (!context) throw new Error("useTheme must be used within ThemeProvider")
    return context
}