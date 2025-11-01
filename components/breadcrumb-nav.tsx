"use client"

import Link from "next/link"
import { ChevronRight } from "lucide-react"

export interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbNavProps {
  items: BreadcrumbItem[]
}

export function BreadcrumbNav({ items }: BreadcrumbNavProps) {
  return (
    <nav className="flex items-center gap-2 text-sm mb-6">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          {index > 0 && <ChevronRight className="w-4 h-4 text-foreground-tertiary" />}
          {item.href ? (
            <Link href={item.href} className="text-accent-secondary hover:text-accent-primary transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-foreground-secondary">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  )
}
