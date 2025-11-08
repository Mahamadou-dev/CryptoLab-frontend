"use client"

interface LearnSectionProps {
    title: string
    content: string
    codeExample?: string // 1. Accepte la nouvelle propriété (optionnelle)
}

export function LearnSection({ title, content, codeExample }: LearnSectionProps) {
    return (
        <div className="glass p-6 rounded-2xl mb-6 border border-border/50 bg-surface/5 backdrop-blur-sm">
            <h2 className="text-2xl font-bold mb-4 text-accent-secondary">{title}</h2>

            {/* 2. Utilise 'whitespace-pre-wrap' pour respecter les sauts de ligne (\n) */}
            <p className="text-foreground-secondary leading-relaxed whitespace-pre-wrap">
                {content}
            </p>

            {/* 3. Affiche le bloc de code (s'il existe) */}
            {codeExample && (
                <div className="mt-4">
          <pre className="w-full rounded-lg bg-background/50 p-4 border border-border/50 overflow-x-auto">
            <code className="font-mono text-sm text-accent-primary whitespace-pre-wrap">
              {codeExample}
            </code>
          </pre>
                </div>
            )}
        </div>
    )
}
