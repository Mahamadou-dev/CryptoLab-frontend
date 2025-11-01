"use client"

import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface SimulatorPanelProps {
  title: string
  children: ReactNode
  className?: string
}

export function SimulatorPanel({ title, children, className }: SimulatorPanelProps) {
  return (
    <div className={cn("glass p-6 rounded-2xl", className)}>
      <label className="block text-sm font-semibold mb-3">{title}</label>
      {children}
    </div>
  )
}
