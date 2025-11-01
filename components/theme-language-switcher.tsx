"use client"

import { useTheme } from "@/lib/theme-context"
import { useLanguage } from "@/lib/language-context"
import { useTranslation } from "@/lib/i18n"
import { Moon, Sun, Globe, Palette } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

export function ThemeLanguageSwitcher() {
  const { theme, setTheme, colorTheme, setColorTheme } = useTheme()
  const { language, setLanguage } = useLanguage()
  const t = useTranslation(language)

  const colorOptions = [
    { value: "purple" as const, label: t("color.purple", "Purple") },
    { value: "red" as const, label: t("color.red", "Red") },
    { value: "blue" as const, label: t("color.blue", "Blue") },
    { value: "pink" as const, label: t("color.pink", "Pink") },
  ]

  return (
    <div className="flex items-center gap-2">
      {/* Color Theme Switcher */}
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

      {/* Theme Switcher */}
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
            {theme === "dark" ||
            (theme === "system" &&
              typeof window !== "undefined" &&
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

      {/* Language Switcher */}
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
