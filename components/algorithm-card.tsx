"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface AlgorithmCardProps {
  id: string
  name: string
  description: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  icon: string
  href: string
  featured?: boolean
}

const difficultyColors = {
  Beginner: "bg-green-500/20 text-green-300 border border-green-500/30",
  Intermediate: "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30",
  Advanced: "bg-red-500/20 text-red-300 border border-red-500/30",
}

export function AlgorithmCard({ id, name, description, difficulty, icon, href, featured = false }: AlgorithmCardProps) {
  return (
    <Link href={href}>
      <div
        className={cn(
          "glass-hover group h-full p-6 rounded-2xl cursor-pointer glow-accent transition-all duration-300 flex flex-col hover:shadow-xl",
          featured && "md:col-span-2 lg:col-span-2",
        )}
      >
        <div
          className={cn(
            "inline-flex items-center justify-center rounded-xl mb-4 w-fit p-3 transition-all duration-300",
            "bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 border border-accent-primary/30 group-hover:border-accent-primary/60",
          )}
        >
          <div className={cn("text-gradient font-bold", featured ? "text-5xl" : "text-4xl")}>{icon}</div>
        </div>

        <h2
          className={cn(
            "font-bold mb-2 group-hover:text-accent-primary transition-colors duration-200",
            featured ? "text-2xl" : "text-xl",
          )}
        >
          {name}
        </h2>
        <p className="text-sm text-foreground-secondary mb-4 flex-grow">{description}</p>

        <div className="flex items-center justify-between pt-4 border-t border-border-color/20">
          <span
            className={cn(
              "text-xs px-3 py-1.5 rounded-full font-medium whitespace-nowrap",
              difficultyColors[difficulty],
            )}
          >
            {difficulty}
          </span>
          <ArrowRight className="w-4 h-4 text-accent-primary opacity-0 group-hover:opacity-100 transition-all duration-200 group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  )
}
