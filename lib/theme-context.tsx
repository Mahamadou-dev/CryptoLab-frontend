"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

type Theme = "light" | "dark" | "system"
type ColorTheme = "purple" | "red" | "blue" | "pink"

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  colorTheme: ColorTheme
  setColorTheme: (color: ColorTheme) => void
  resolvedTheme: "light" | "dark"
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

const colorThemeClasses: Record<ColorTheme, string> = {
  purple: "theme-purple",
  red: "theme-red",
  blue: "theme-blue",
  pink: "theme-pink",
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("system")
  const [colorTheme, setColorThemeState] = useState<ColorTheme>("purple")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const storedTheme = localStorage.getItem("theme") as Theme | null
    const storedColor = localStorage.getItem("colorTheme") as ColorTheme | null

    if (storedTheme) {
      setThemeState(storedTheme)
    }
    if (storedColor) {
      setColorThemeState(storedColor)
    }
  }, [])

  useEffect(() => {
    if (!mounted) return

    const root = document.documentElement
    let resolvedTheme: "light" | "dark" = theme as "light" | "dark"

    if (theme === "system") {
      resolvedTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
    }

    if (resolvedTheme === "dark") {
      root.classList.add("dark")
    } else {
      root.classList.remove("dark")
    }

    // Apply color theme
    Object.values(colorThemeClasses).forEach((className) => {
      root.classList.remove(className)
    })
    root.classList.add(colorThemeClasses[colorTheme])

    localStorage.setItem("theme", theme)
    localStorage.setItem("colorTheme", colorTheme)
  }, [theme, colorTheme, mounted])

  const resolvedTheme: "light" | "dark" =
    theme === "system"
      ? typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : (theme as "light" | "dark")

  const value = {
    theme,
    setTheme: setThemeState,
    colorTheme,
    setColorTheme: setColorThemeState,
    resolvedTheme,
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within ThemeProvider")
  }
  return context
}
