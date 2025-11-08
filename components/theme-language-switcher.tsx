"use client"

import { useTheme } from "@/lib/theme-context"
import { useLanguage } from "@/lib/language-context"
import { useTranslation } from "@/lib/i18n"
import { Moon, Sun, Globe, Palette } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"

export function ThemeLanguageSwitcher() {
    // 1. Déclare le type ColorTheme pour correspondre au contexte
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

    const { theme, setTheme, colorTheme, setColorTheme } = useTheme()
    const { language, setLanguage } = useLanguage()
    const t = useTranslation(language)

    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    // 2. --- CORRECTION ---
    //    Liste complète de tous les thèmes de couleurs
    const colorOptions: { value: ColorTheme; label: string }[] = [
        { value: "gemini", label: t("color.gemini", "Gemini") },
        { value: "purple", label: t("color.purple", "Purple") },
        { value: "ocean", label: t("color.ocean", "Ocean") },
        { value: "solar", label: t("color.solar", "Solar") },
        { value: "emerald", label: t("color.emerald", "Emerald") },
        { value: "cyber", label: t("color.cyber", "Cyber") },
        { value: "pink", label: t("color.pink", "Pink") },
        { value: "blue", label: t("color.blue", "Blue") },
        { value: "red", label: t("color.red", "Red") },
        { value: "magenta", label: t("color.magenta", "Magenta") },
    ]

    return (
        <div className="flex items-center gap-2">
            {/* Color Theme Switcher (Maintenant complet) */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="outline"
                        size="icon"
                        className="glass rounded-lg bg-transparent"
                        style={{
                            backgroundColor: "var(--surface)",
                            borderColor: "var(--border-color)",
                        }}
                        aria-label="Select color theme"
                    >
                        <Palette className="w-4 h-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    {/* 3. Le map() fonctionne maintenant avec la liste complète */}
                    {colorOptions.map((option) => (
                        <DropdownMenuItem
                            key={option.value}
                            onClick={() => setColorTheme(option.value)}
                            className={colorTheme === option.value ? "bg-accent" : ""}
                        >
                            {option.label}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Theme Switcher (corrigé) */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="outline"
                        size="icon"
                        className="glass rounded-lg bg-transparent"
                        style={{
                            backgroundColor: "var(--surface)",
                            borderColor: "var(--border-color)",
                        }}
                        aria-label="Toggle theme"
                    >
                        {/* Logique de rendu corrigée pour éviter l'erreur d'hydratation */}
                        {!isMounted ? (
                            <Sun className="w-4 h-4" /> // Rendu par défaut
                        ) : theme === "dark" ||
                        (theme === "system" &&
                            window.matchMedia("(prefers-color-scheme: dark)").matches) ? (
                            <Moon className="w-4 h-4" />
                        ) : (
                            <Sun className="w-4 h-4" />
                        )}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setTheme("light")}>{t("theme.light", "Light")}</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("dark")}>{t("theme.dark", "Dark")}</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("system")}>{t("theme.system", "System")}</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Language Switcher (inchangé) */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="outline"
                        size="icon"
                        className="glass rounded-lg bg-transparent"
                        style={{
                            backgroundColor: "var(--surface)",
                            borderColor: "var(--border-color)",
                        }}
                        aria-label="Select language"
                    >
                        <Globe className="w-4 h-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setLanguage("en")}>English</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setLanguage("fr")}>Français</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}