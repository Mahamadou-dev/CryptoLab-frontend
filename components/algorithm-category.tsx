"use client"

import { type Algorithm, type AlgorithmType, categoryInfo } from "@/lib/algorithms"
import { AlgorithmCard } from "./algorithm-card"
import { SectionGrid } from "./section-grid"

interface AlgorithmCategoryProps {
  category: AlgorithmType
  algorithms: Algorithm[]
}

export function AlgorithmCategory({ category, algorithms }: AlgorithmCategoryProps) {
  const info = categoryInfo[category]

  return (
    <div className="space-y-6">
      <div>
        <div className={`inline-block px-4 py-1 rounded-full bg-gradient-to-r ${info.color} bg-opacity-20 mb-3`}>
          <span className={`text-sm font-semibold bg-gradient-to-r ${info.color} bg-clip-text text-transparent`}>
            {info.name}
          </span>
        </div>
        <h2 className="text-2xl font-bold mb-2">{info.name}</h2>
        <p className="text-foreground-secondary max-w-2xl">{info.description}</p>
      </div>

      <SectionGrid cols="4">
        {algorithms.map((algo) => (
          <AlgorithmCard key={algo.id} {...algo} href={`/simulations/${algo.id}`} />
        ))}
      </SectionGrid>
    </div>
  )
}
