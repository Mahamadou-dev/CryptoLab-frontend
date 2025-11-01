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
    <div
      className="glass p-6 rounded-2xl"
      style={{ backgroundColor: "var(--surface)", borderColor: "var(--border-color)" }}
    >
      <h3 className="text-sm font-semibold mb-3">{title}</h3>
      <div
        className="p-4 rounded-xl break-all font-mono text-sm mb-4 max-h-40 overflow-y-auto"
        style={{ backgroundColor: "var(--background-secondary)" }}
      >
        {output}
      </div>
      <Button
        onClick={handleCopy}
        variant="ghost"
        size="sm"
        className="w-full text-accent-secondary"
        style={{ backgroundColor: "transparent" }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--surface-hover)")}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
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
