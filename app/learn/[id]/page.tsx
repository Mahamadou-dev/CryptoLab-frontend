"use client"

import { Navigation } from "@/components/navigation"
// --- IMPORTS MIS À JOUR ---
import { useParams } from "next/navigation"
// On importe les définitions d'algorithmes pour l'ordre et les métadonnées (icône, difficulté)
import { algorithms, Difficulty } from "@/lib/algorithms"
// On importe notre nouveau fichier de contenu internationalisé
import { i18nContent } from "@/lib/i18n-content"
// --- FIN DES IMPORTS MIS À JOUR ---
import { KeyPoints } from "@/components/key-points"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"
import { ProgressBar } from "@/components/progress-bar"
import { InteractiveQuiz } from "@/components/interactive-quiz"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, Zap, Trophy, Lightbulb, FileWarning } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { useLanguage } from "@/lib/language-context"
import { useTranslation } from "@/lib/i18n"
import React from "react"
import ReactMarkdown from "react-markdown"
import { cn } from "@/lib/utils"

export default function LearnArticlePage() {
    const { language } = useLanguage()
    const t = useTranslation(language)

    const params = useParams()
    const id = Array.isArray(params.id) ? params.id[0] : params.id as string

    // --- NOUVELLE LOGIQUE DE CHARGEMENT DU CONTENU ---
    // 1. Récupère tout le contenu (articles + quiz) pour la langue actuelle
    const currentLangContent = i18nContent[language]

    // 2. Trouve l'article et le quiz spécifiques par ID
    const article = currentLangContent.articles[id]
    const quiz = currentLangContent.quizzes[id] || []

    // 3. Récupère les métadonnées de l'algorithme (icône, catégorie technique) depuis lib/algorithms.ts
    const algorithm = algorithms.find((a) => a.id === id)

    // 4. Logique de navigation (Précédent/Suivant) basée sur l'ordre dans algorithms.ts
    const articleIds = algorithms.map(a => a.id)
    const currentIndex = articleIds.findIndex((aId) => aId === id)
    const prevArticleId = currentIndex > 0 ? articleIds[currentIndex - 1] : null
    const nextArticleId = currentIndex < articleIds.length - 1 ? articleIds[currentIndex + 1] : null

    // Récupère les titres traduits des articles précédent/suivant
    const prevArticleTitle = prevArticleId ? currentLangContent.articles[prevArticleId]?.title : ""
    const nextArticleTitle = nextArticleId ? currentLangContent.articles[nextArticleId]?.title : ""
    // --- FIN DE LA NOUVELLE LOGIQUE ---

    if (!article || !algorithm) {
        return (
            <main className="min-h-screen">
                <Navigation />
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
                    <FileWarning className="w-16 h-16 mx-auto mb-4 text-rose-500" />
                    <h1 className="text-2xl font-bold text-gradient">{t("article.not-found")}</h1>
                </div>
            </main>
        )
    }

    // Map des difficultés aux couleurs du thème (basé sur les clés i18n de lib/algorithms.ts)
    const difficultyColors: Record<Difficulty, string> = {
        "difficulty.beginner": "bg-[var(--color-violet)]/10 text-[var(--color-violet)] border border-[var(--color-violet)]/20",
        "difficulty.intermediate": "bg-[var(--color-magenta)]/10 text-[var(--color-magenta)] border border-[var(--color-magenta)]/20",
        "difficulty.advanced": "bg-[var(--color-rose)]/10 text-[var(--color-rose)] border border-[var(--color-rose)]/20",
    }

    return (
        <main className="min-h-screen">
            <Navigation />
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

                {/* --- SECTION "HÉRO" --- */}
                <div className="mb-12 rounded-3xl p-8 relative overflow-hidden glass">
                    <div className="flex justify-between items-center mb-4">
                        <span
                            className={cn(
                                "inline-block px-4 py-1 rounded-full text-sm font-semibold",
                                // Utilise la difficulté définie dans lib/algorithms.ts pour la couleur
                                difficultyColors[algorithm.difficulty]
                            )}
                        >
                            {/* Traduit le niveau de difficulté (ex: "Débutant") */}
                            {t(algorithm.difficulty)}
                        </span>

                        <Link href={`/simulations/${algorithm.id}`}>
                            <Button
                                size="sm"
                                className="btn-gemini text-sm font-semibold px-4"
                            >
                                <Zap className="w-4 h-4 mr-2" />
                                {t("article.try-now")}
                            </Button>
                        </Link>
                    </div>

                    <div className="absolute -right-8 -bottom-12 text-9xl text-[var(--surface-hover)] opacity-30 pointer-events-none transform-gpu rotate-[-10deg]">
                        {algorithm.icon}
                    </div>

                    <h1 className="text-5xl font-bold mb-4 text-gradient">
                        {article.title}
                    </h1>
                    <p className="text-xl text-foreground-secondary relative z-10">{article.excerpt}</p>
                </div>
                {/* --- FIN HERO --- */}

                <BreadcrumbNav items={[{ label: t("article.breadcrumb-learn"), href: "/learn" }, { label: article.title }]} />
                <ProgressBar current={currentIndex + 1} total={articleIds.length} className="my-8" />


                {/* --- SECTIONS DU COURS --- */}
                <div className="space-y-8">
                    <Card className="glass">
                        <CardHeader>
                            <CardTitle className="text-2xl text-gradient">
                                {t("article.overview")}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="prose prose-invert max-w-none prose-p:text-foreground-secondary prose-strong:text-foreground">
                                <ReactMarkdown>{article.content}</ReactMarkdown>
                            </div>
                        </CardContent>
                    </Card>

                    {article.sections.map((section, index) => (
                        <Card key={index} className="glass">
                            <CardHeader>
                                <CardTitle className="text-2xl text-gradient">
                                    {section.title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="prose prose-invert max-w-none prose-p:text-foreground-secondary prose-strong:text-foreground prose-li:text-foreground-secondary">
                                    <ReactMarkdown>{section.content}</ReactMarkdown>
                                </div>

                                {section.codeExample && (
                                    <pre className="p-4 rounded-lg bg-[var(--surface)] border border-[var(--border-color)] text-sm text-foreground-secondary">
                                        <code>{section.codeExample}</code>
                                    </pre>
                                )}
                            </CardContent>
                        </Card>
                    ))}

                    {/* POINTS CLÉS */}
                    <Card className="glass">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-2xl text-[var(--color-magenta)]">
                                <Lightbulb className="w-6 h-6" />
                                {t("article.keyPoints")}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <KeyPoints points={article.keyPoints} />
                        </CardContent>
                    </Card>

                    {/* QUIZ */}
                    {quiz.length > 0 && (
                        <Card className="glass">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-2xl text-[var(--color-violet)]">
                                    <Trophy className="w-6 h-6" />
                                    {t("article.test-knowledge")}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {/* Le composant InteractiveQuiz gère sa propre traduction interne pour les boutons, etc. */}
                                <InteractiveQuiz questions={quiz} />
                            </CardContent>
                        </Card>
                    )}
                </div>


                {/* --- BOUTONS SUIVANT/PRÉCÉDENT --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16 mb-12">
                    {prevArticleId ? (
                        <Link href={`/learn/${prevArticleId}`}>
                            <Button
                                variant="outline"
                                className="w-full h-auto text-left py-4 px-6 rounded-xl glass transition-all duration-200"
                            >
                                <div className="flex items-center">
                                    <ArrowLeft className="w-5 h-5 mr-3 flex-shrink-0 text-[var(--color-violet)]" />
                                    <div>
                                        <span className="text-xs text-foreground-secondary">{t("article.previous")}</span>
                                        <p className="font-semibold text-foreground break-words">{prevArticleTitle}</p>
                                    </div>
                                </div>
                            </Button>
                        </Link>
                    ) : (
                        <div /> // Garde la grille alignée
                    )}
                    {nextArticleId ? (
                        <Link href={`/learn/${nextArticleId}`}>
                            <Button
                                variant="default"
                                className="w-full h-auto text-right py-4 px-6 btn-gemini transition-all duration-200"
                            >
                                <div className="flex items-center w-full justify-end">
                                    <div>
                                        <span className="text-xs text-white/80">{t("article.next")}</span>
                                        <p className="font-semibold break-words">{nextArticleTitle}</p>
                                    </div>
                                    <ArrowRight className="w-5 h-5 ml-3 flex-shrink-0" />
                                </div>
                            </Button>
                        </Link>
                    ) : (
                        <div />
                    )}
                </div>
            </div>
        </main>
    )
}