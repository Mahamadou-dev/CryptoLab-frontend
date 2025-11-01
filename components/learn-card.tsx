"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface LearnCardProps {
  id: string
  title: string
  excerpt: string
  category: "Beginner" | "Intermediate" | "Advanced"
  href: string
}

const categoryColors = {
  Beginner: "bg-green-500/20 text-green-300 border border-green-500/30",
  Intermediate: "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30",
  Advanced: "bg-red-500/20 text-red-300 border border-red-500/30",
}

export function LearnCard({ id, title, excerpt, category, href }: LearnCardProps) {
  return (
    <Link href={href}>
      <div className="glass-hover group p-6 rounded-2xl cursor-pointer transition-all duration-300 h-full flex flex-col hover:shadow-xl hover:glow-accent">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex-1">
            <h2 className="text-lg font-bold mb-2 group-hover:text-accent-primary transition-colors text-pretty">
              {title}
            </h2>
            <p className="text-foreground-secondary text-sm leading-relaxed flex-grow">{excerpt}</p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border-color/20">
          <span className={cn("text-xs px-3 py-1.5 rounded-full font-medium", categoryColors[category])}>
            {category}
          </span>
          <ArrowRight className="w-4 h-4 text-accent-primary opacity-0 group-hover:opacity-100 transition-all duration-200 group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  )
}
