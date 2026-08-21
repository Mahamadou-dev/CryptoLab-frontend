"use client"

import { type Algorithm, type AlgorithmType, categoryInfo } from "@/lib/algorithms"
import { AlgorithmCard } from "./algorithm-card"
import { SectionGrid } from "./section-grid"
// --- AJOUTS I18N ---
import { useLanguage } from "@/lib/language-context"
import { useTranslation } from "@/lib/i18n"
// --- FIN AJOUTS ---

interface AlgorithmCategoryProps {
    category: AlgorithmType
    algorithms: Algorithm[]
}

export function AlgorithmCategory({ category, algorithms }: AlgorithmCategoryProps) {
    // --- AJOUTS I18N ---
    const { language } = useLanguage()
    const t = useTranslation(language)
    // --- FIN AJOUTS ---

    const info = categoryInfo[category]

    // TRADUCTION DES CLES
    const categoryName = t(info.name)
    const categoryDescription = t(info.description)

    return (
        <div className="space-y-6">
            <div>
                {/* Categorie : un seul accent, sans degrade — le label monospace
                    (voix des donnees, pas du texte editorial) suffit a distinguer
                    la famille sans lui inventer sa propre couleur. */}
                <div className="inline-block px-4 py-1 rounded-full bg-accent-primary/10 border border-accent-primary/30 mb-3">
                    <span className="text-sm font-semibold font-mono text-accent-primary">
                        {categoryName}
                    </span>
                </div>
                <h2 className="text-2xl font-bold mb-2 text-gradient">{categoryName}</h2>
                {/* CORRIGÉ */}
                <p className="text-foreground-secondary max-w-2xl">{categoryDescription}</p>
            </div>

            <SectionGrid cols="4">
                {algorithms.map((algo) => (
                    // Cet enfant doit aussi être corrigé (voir Fichier 2)
                    <AlgorithmCard key={algo.id} {...algo} href={`/simulations/${algo.id}`} />
                ))}
            </SectionGrid>
        </div>
    )
}