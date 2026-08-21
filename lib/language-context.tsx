"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { Language } from "./i18n"

interface LanguageContextType {
  language: Language
  setLanguage: (language: Language) => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en")

  useEffect(() => {
    // Synchronise React avec localStorage/la langue du navigateur : lisibles
    // seulement côté client, donc après le premier rendu.
    const stored = localStorage.getItem("language") as Language | null
    if (stored) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- synchronise React avec localStorage, lisible seulement après montage
      setLanguageState(stored)
    } else {
      const browserLang = navigator.language.split("-")[0]
      setLanguageState((browserLang === "fr" ? "fr" : "en") as Language)
    }
  }, [])

  const handleSetLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem("language", lang)
  }

  const value = {
    language,
    setLanguage: handleSetLanguage,
  }

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within LanguageProvider")
  }
  return context
}
