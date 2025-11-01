"use client"

import { Navigation } from "@/components/navigation"
import { PageHeader } from "@/components/page-header"
import { AlgorithmCategory } from "@/components/algorithm-category"
import { algorithms } from "@/lib/algorithms"
import { useLanguage } from "@/lib/language-context"
import { useTranslation } from "@/lib/i18n"

export default function SimulationsPage() {
  const { language } = useLanguage()
  const t = useTranslation(language)

  // Group algorithms by category
  const grouped = algorithms.reduce(
    (acc, algo) => {
      if (!acc[algo.category]) {
        acc[algo.category] = []
      }
      acc[algo.category].push(algo)
      return acc
    },
    {} as Record<string, typeof algorithms>,
  )

  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <PageHeader title={t("simulations.title")} description={t("simulations.description")} />

        <div className="space-y-16">
          {Object.entries(grouped).map(([category, algos]) => (
            <AlgorithmCategory key={category} category={category as any} algorithms={algos} />
          ))}
        </div>
      </div>
    </main>
  )
}
