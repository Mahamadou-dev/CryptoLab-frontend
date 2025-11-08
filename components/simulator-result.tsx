"use client"

import { Copy, Check } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

interface SimulatorResultProps {
    output: string
    title?: string
}

export function SimulatorResult({ output, title = "Result" }: SimulatorResultProps) {
    const [copied, setCopied] = useState(false)

    const handleCopy = () => {
        navigator.clipboard.writeText(output)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    if (!output) return null

    return (
        // REMARQUE : Style inline redondant supprimé
        <div
            className="glass p-6 rounded-2xl"
        >
            <h3 className="text-sm font-semibold mb-3">{title}</h3>
            {/* REMARQUE : Bloc de code stylisé avec les variables du thème */}
            <div
                className="p-4 rounded-xl break-all font-mono text-sm mb-4 max-h-40 overflow-y-auto bg-[var(--surface)] border border-[var(--border-color)]"
            >
                {output}
            </div>
            {/* REMARQUE : Bouton stylisé avec les classes Tailwind et les variables du thème */}
            <Button
                onClick={handleCopy}
                variant="ghost"
                size="sm"
                className="w-full text-[var(--color-rose)] hover:bg-[var(--surface-hover)] hover:text-[var(--color-rose)]"
            >
                {copied ? (
                    <>
                        <Check className="w-4 h-4 mr-2" />
                        Copied!
                    </>
                ) : (
                    <>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy Result
                    </>
                )}
            </Button>
        </div>
    )
}