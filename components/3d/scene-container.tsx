"use client"

import React from "react"
import { cn } from "@/lib/utils"

interface SceneContainerProps {
  children?: React.ReactNode
  className?: string
  forwardedRef?: React.Ref<HTMLDivElement>
}

export const SceneContainer = React.forwardRef<HTMLDivElement, SceneContainerProps>(({ children, className }, ref) => {
  return (
    <div ref={ref} className={cn("absolute inset-0 w-full h-full", className)}>
      {children}
    </div>
  )
})

SceneContainer.displayName = "SceneContainer"
