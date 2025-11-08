"use client"

import { Navigation } from "@/components/navigation"
// import { PageHeader } from "@/components/page-header" // Non utilisé dans cette version
import { LearnCard } from "@/components/learn-card"
import { useLanguage } from "@/lib/language-context"
import { algorithms } from "@/lib/algorithms"
import { useTranslation } from "@/lib/i18n"

export default function LearnPage() {
    const { language } = useLanguage()
    const t = useTranslation(language)

    // Mapper les difficultés aux catégories (pour la nouvelle structure)
    // Les clés de cet objet DOIVENT correspondre aux valeurs de 'difficulty' dans lib/algorithms.ts
    const difficultyMap = {
        "difficulty.beginner": {
            nameKey: "learn.level.beginner",
            color: "bg-[var(--color-violet)]/10 text-[var(--color-violet)] border border-[var(--color-violet)]/20",
        },
        "difficulty.intermediate": {
            nameKey: "learn.level.intermediate",
            color: "bg-[var(--color-magenta)]/10 text-[var(--color-magenta)] border border-[var(--color-magenta)]/20",
        },
        "difficulty.advanced": {
            nameKey: "learn.level.advanced",
            color: "bg-[var(--color-rose)]/10 text-[var(--color-rose)] border border-[var(--color-rose)]/20",
        },
    }

    return (
        <main className="min-h-screen">
            <Navigation />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

                {/* En-tête */}
                <div className="mb-12 pt-8">
                    <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-gradient">
                        {t("learn.title")}
                    </h1>
                    <p className="text-lg text-foreground-secondary">
                        {t("learn.description")}
                    </p>
                </div>

                {/* Structure basée sur la difficulté */}
                <div className="space-y-12">
                    {(Object.entries(difficultyMap) as [string, { nameKey: string, color: string }][]).map(([levelKey, { nameKey, color }]) => {
                        // Filtrer les algorithmes pour ce niveau de difficulté
                        // CAST nécessaire ici si TS se plaint encore, mais devrait aller avec le bon lib/algorithms.ts
                        const levelAlgos = algorithms.filter(a => a.difficulty === levelKey);

                        if (levelAlgos.length === 0) return null

                        return (
                            <section className="space-y-6" key={levelKey}>
                                <div className="flex items-center gap-3">
                                    <div className={`inline-block px-4 py-1 rounded-full ${color}`}>
                                        <span className="text-sm font-semibold">
                                            {/* Traduit le niveau de difficulté (ex: "Débutant") */}
                                            {t(levelKey)}
                                        </span>
                                    </div>
                                    {/* Traduit le titre de la section (ex: "Commencez ici") */}
                                    <h2 className="text-2xl font-bold">{t(nameKey)}</h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {levelAlgos.map((algo) => (
                                        <LearnCard
                                            key={algo.id}
                                            id={algo.id}
                                            // IMPORTANT : On traduit le nom et la description ICI avant de les passer
                                            title={t(algo.name)}
                                            excerpt={t(algo.description)}
                                            // On passe la clé brute de difficulté pour que LearnCard puisse gérer ses styles si besoin
                                            category={algo.difficulty}
                                            icon={algo.icon}
                                            href={`/learn/${algo.id}`}
                                        />
                                    ))}
                                </div>
                            </section>
                        )
                    })}
                </div>
            </div>
        </main>
    )
}