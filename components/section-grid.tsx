"use client"

import type React from "react"
import { cn } from "@/lib/utils"

interface SectionGridProps {
  children: React.ReactNode
  cols?: "1" | "2" | "3" | "4"
  gap?: "sm" | "md" | "lg"
  className?: string
}

const colClasses = {
  "1": "grid-cols-1",
  "2": "grid-cols-1 md:grid-cols-2",
  "3": "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  "4": "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
}

const gapClasses = {
  sm: "gap-3",
  md: "gap-6",
  lg: "gap-8",
}

export function SectionGrid({ children, cols = "3", gap = "md", className }: SectionGridProps) {
  return <div className={cn("grid", colClasses[cols], gapClasses[gap], className)}>{children}</div>
}
