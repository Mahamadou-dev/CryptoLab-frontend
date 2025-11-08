"use client"

import { useState, useMemo } from "react"
import { Navigation } from "@/components/navigation"
import { PageHeader } from "@/components/page-header"
import { AlgorithmCategory } from "@/components/algorithm-category"
import { algorithms, categoryInfo, AlgorithmType } from "@/lib/algorithms"
import { useLanguage } from "@/lib/language-context"
import { useTranslation } from "@/lib/i18n"
import { Input } from "@/components/ui/input" // Import du composant Input
import { Button } from "@/components/ui/button" // Import du composant Button
import { Search } from "lucide-react"
import { cn } from "@/lib/utils" // REMARQUE : 'cn' est requis pour les styles de boutons

// On définit les clés des catégories + "all"
const categories: ("all" | AlgorithmType)[] = ["all", ...Object.keys(categoryInfo) as AlgorithmType[]]

export default function SimulationsPage() {
    const { language } = useLanguage()
    const t = useTranslation(language)

    // --- NOUVEAUX ÉTATS POUR LE FILTRAGE ---
    const [searchTerm, setSearchTerm] = useState("")
    const [activeCategory, setActiveCategory] = useState<"all" | AlgorithmType>("all")

    // --- FILTRAGE ET REGROUPEMENT DES ALGORITHMES ---
    const filteredGrouped = useMemo(() => {
        // ... (logique de filtrage inchangée) ...
        // 1. Filtrer par catégorie active
        const byCategory =
            activeCategory === "all"
                ? algorithms
                : algorithms.filter((algo) => algo.category === activeCategory)

        // 2. Filtrer par terme de recherche (sur le nom ou la description)
        const bySearchTerm = byCategory.filter(
            (algo) =>
                algo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                algo.description.toLowerCase().includes(searchTerm.toLowerCase()),
        )

        // 3. Regrouper les résultats filtrés
        return bySearchTerm.reduce(
            (acc, algo) => {
                if (!acc[algo.category]) {
                    acc[algo.category] = []
                }
                acc[algo.category].push(algo)
                return acc
            },
            {} as Record<string, typeof algorithms>,
        )
    }, [searchTerm, activeCategory]) // Recalculer si ces états changent

    const hasResults = Object.keys(filteredGrouped).length > 0

    return (
        // REMARQUE : Le fond est déjà géré par globals.css (via `body`)
        <main className="min-h-screen">
            <Navigation />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

                {/* REMARQUE : Remplacement de PageHeader par un en-tête stylisé "Gemini" */}
                <div className="mb-12 pt-8">
                    <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-gradient">
                        {t("simulations.title", "Laboratoires de Simulation")}
                    </h1>
                    <p className="text-lg text-foreground-secondary">
                        {t("simulations.description", "Choisissez un algorithme pour l'explorer de manière interactive.")}
                    </p>
                </div>

                {/* --- NOUVELLE SECTION DE FILTRES --- */}
                <div className="sticky top-16 z-40 backdrop-blur-lg pt-6 pb-8 mb-12 border-b border-[var(--border-color)] bg-[var(--surface)]" style={{ top: "4rem" }}>
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Barre de recherche (Assurez-vous que le placeholder utilise aussi une clé si possible) */}
                        <div className="relative flex-grow">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-tertiary" />
                            <Input
                                type="text"
                                // CORRECTION ICI : Utilisation d'une clé i18n pour le placeholder
                                placeholder={t("simulations.search.placeholder", "Rechercher un algorithme...")}
                                className="w-full pl-10 glass"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* Boutons de Catégorie */}
                        <div className="flex-none flex gap-2 overflow-x-auto pb-2">
                            {categories.map((category) => {
                                const isActive = activeCategory === category
                                return (
                                    <Button
                                        key={category}
                                        variant={null}
                                        onClick={() => setActiveCategory(category)}
                                        className={cn(
                                            "rounded-lg whitespace-nowrap transition-all",
                                            isActive
                                                ? "btn-gemini text-white"
                                                : "glass text-foreground-secondary hover:text-[var(--color-rose)]"
                                        )}
                                    >
                                        {/* CORRECTION ICI : Il faut utiliser t() autour du nom de la catégorie */}
                                        {category === "all"
                                            ? t("simulations.all", "Tous")
                                            : t(categoryInfo[category].name)}
                                    </Button>
                                )
                            })}
                        </div>
                    </div>
                </div>
                {/* --- FIN DE LA SECTION DE FILTRES --- */}


                {/* --- LISTE DES RÉSULTATS --- */}
                {hasResults ? (
                    <div className="space-y-16">
                        {Object.entries(filteredGrouped).map(([category, algos]) => (
                            <AlgorithmCategory key={category} category={category as AlgorithmType} algorithms={algos} />
                        ))}
                    </div>
                ) : (
                    // Message si aucun résultat n'est trouvé
                    <div className="text-center py-16">
                        {/* REMARQUE : Titre "Aucun résultat" stylisé avec .text-gradient */}
                        <p className="text-2xl font-semibold text-gradient mb-2">
                            {t("simulations.noResults.title", "Aucun résultat trouvé")}
                        </p>
                        <p className="text-foreground-secondary mt-2">
                            {t("simulations.noResults.description", "Essayez de modifier votre recherche ou de changer de catégorie.")}
                        </p>
                    </div>
                )}
            </div>
        </main>
    )
}