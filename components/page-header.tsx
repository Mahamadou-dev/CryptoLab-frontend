"use client"

interface PageHeaderProps {
  title: string
  description?: string
  subtitle?: string
}

export function PageHeader({ title, description, subtitle }: PageHeaderProps) {
  return (
    <div className="mb-12">
      <h1 className="text-4xl lg:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-accent-primary to-accent-secondary text-balance">
        {title}
      </h1>
      {subtitle && (
        <p className="text-accent-secondary text-sm uppercase tracking-wider font-semibold mb-2">{subtitle}</p>
      )}
      {description && <p className="text-lg text-foreground-secondary max-w-2xl">{description}</p>}
    </div>
  )
}
