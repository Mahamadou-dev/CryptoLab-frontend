"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
// IMPORTANT : Importer le vrai type depuis votre fichier d'algorithmes
import { Difficulty } from "@/lib/algorithms"
import { useLanguage } from "@/lib/language-context"
import { useTranslation } from "@/lib/i18n"

interface LearnCardProps {
    id: string
    title: string
    excerpt: string
    category: Difficulty // Utilise le type correct importé
    icon: string
    href: string
    className?: string
}

export function LearnCard({ id, title, excerpt, category, icon, href, className }: LearnCardProps) {
    const { language } = useLanguage()
    const t = useTranslation(language)

    // Map des couleurs basée sur les NOUVELLES clés de difficulté
    const categoryColors: Record<Difficulty, string> = {
        "difficulty.beginner": "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20",
        "difficulty.intermediate": "bg-purple-500/10 text-purple-500 hover:bg-purple-500/20",
        "difficulty.advanced": "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20",
    }

    return (
        <Link href={href} className="group block h-full">
            <Card
                className={cn(
                    "glass h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex flex-col",
                    className
                )}
            >
                <CardHeader className="pb-4">
                    <div className="flex justify-between items-start mb-4">
                        <div className="text-4xl p-3 glass rounded-xl group-hover:scale-110 transition-transform duration-300">
                            {icon}
                        </div>
                        <Badge
                            variant="secondary"
                            className={cn("transition-colors", categoryColors[category])}
                        >
                            {/* Traduction de la catégorie affichée dans le badge */}
                            {t(category)}
                        </Badge>
                    </div>
                    <CardTitle className="text-xl group-hover:text-gradient transition-all duration-300">
                        {title}
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                    <p className="text-foreground-secondary line-clamp-3">
                        {excerpt}
                    </p>
                </CardContent>
                <CardFooter className="pt-0 pb-6">
                    <div className="text-sm font-medium text-[var(--color-primary)] flex items-center gap-2 group-hover:gap-3 transition-all">
                        {/* Vous pouvez aussi traduire ce texte si vous voulez : t("learn.startModule") */}
                        Commencer le module
                        <ArrowRight className="w-4 h-4" />
                    </div>
                </CardFooter>
            </Card>
        </Link>
    )
}