"use client"

interface LearnSectionProps {
  title: string
  content: string
}

export function LearnSection({ title, content }: LearnSectionProps) {
  return (
    <div className="glass p-6 rounded-2xl mb-6">
      <h2 className="text-2xl font-bold mb-4 text-accent-secondary">{title}</h2>
      <p className="text-foreground-secondary leading-relaxed">{content}</p>
    </div>
  )
}
