"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Difficulty } from "@/lib/algorithms"
// --- AJOUTS I18N ---
import { useLanguage } from "@/lib/language-context"
import { useTranslation } from "@/lib/i18n"
// --- FIN AJOUTS ---

// ❌ L'ancien mapping en dur est supprimé.
// const difficultyLabels: Record<Difficulty, string> = { ... }

// ✅ Le mapping des couleurs est correct et utilise les clés i18n.
const difficultyColors: Record<Difficulty, string> = {
    "difficulty.beginner": "bg-green-500/20 text-green-300 border border-green-500/30",
    "difficulty.intermediate": "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30",
    "difficulty.advanced": "bg-red-500/20 text-red-300 border border-red-500/30",
}

interface AlgorithmCardProps {
    id: string
    name: string // C'est une clé i18n (ex: "algo.caesar.name")
    description: string // C'est une clé i18n
    difficulty: Difficulty // C'est une clé i18n
    icon: string
    href: string
    featured?: boolean
}

export function AlgorithmCard({
                                  id,
                                  name,
                                  description,
                                  difficulty,
                                  icon,
                                  href,
                                  featured = false,
                              }: AlgorithmCardProps) {
    // --- AJOUTS I18N ---
    const { language } = useLanguage()
    const t = useTranslation(language)
    // --- FIN AJOUTS ---

    return (
        <Link href={href}>
            <div
                className={cn(
                    "glass group h-full p-6 rounded-2xl cursor-pointer glow-accent transition-all duration-300 flex flex-col hover:shadow-xl",
                    featured && "md:col-span-2 lg:col-span-2",
                )}
            >
                {/* Icône principale */}
                <div
                    className={cn(
                        "inline-flex items-center justify-center rounded-xl mb-4 w-fit p-3 transition-all duration-300",
                        "bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 border border-accent-primary/30 group-hover:border-accent-primary/60",
                    )}
                >
                    <div className={cn("text-gradient font-bold", featured ? "text-5xl" : "text-4xl")}>{icon}</div>
                </div>

                {/* Nom & Description */}
                <h2
                    className={cn(
                        "font-bold mb-2 group-hover:text-accent-primary transition-colors duration-200",
                        featured ? "text-2xl" : "text-xl",
                    )}
                >
                    {/* CORRIGÉ: Traduit la clé de nom */}
                    {t(name)}
                </h2>
                <p className="text-sm text-foreground-secondary mb-4 flex-grow">
                    {/* CORRIGÉ: Traduit la clé de description */}
                    {t(description)}
                </p>

                {/* Niveau de difficulté + flèche */}
                <div className="flex items-center justify-between pt-4 border-t border-border-color/20">
                  <span
                      className={cn(
                          "text-xs px-3 py-1.5 rounded-full font-medium whitespace-nowrap",
                          difficultyColors[difficulty], // Le mapping de couleur est correct
                      )}
                  >
                    {/* CORRIGÉ: Traduit la clé de difficulté (supprime difficultyLabels) */}
                      {t(difficulty)}
                  </span>
                    <ArrowRight className="w-4 h-4 text-accent-primary opacity-0 group-hover:opacity-100 transition-all duration-200 group-hover:translate-x-1" />
                </div>
            </div>
        </Link>
    )
}