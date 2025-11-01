"use client"

import { useState } from "react"
import { sha256Simulate, generateMockHash } from "@/lib/crypto/hash"
import { SimulatorPanel } from "./simulator-panel"
import { SimulatorResult } from "./simulator-result"
import { Button } from "@/components/ui/button"
import { Play, Loader } from "lucide-react"

interface SimulatorHashProps {
  onResult?: (output: string) => void
}

export function SimulatorHash({ onResult }: SimulatorHashProps) {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [hashType, setHashType] = useState<"sha256" | "mock">("sha256")

  const handleHash = async () => {
    try {
      if (!input.trim()) {
        setOutput("Error: Input cannot be empty")
        return
      }

      setIsLoading(true)
      let result: string

      if (hashType === "mock") {
        result = await generateMockHash(input)
      } else {
        result = sha256Simulate(input)
      }

      setOutput(result)
      onResult?.(result)
    } catch (error) {
      setOutput(`Error: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <SimulatorPanel title="Input Text">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full rounded-xl p-3 text-foreground placeholder-foreground-tertiary focus:outline-none border-2"
          style={{ backgroundColor: "var(--background-secondary)", borderColor: "var(--border-color)" }}
          rows={6}
          placeholder="Enter text to hash..."
          onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent-primary)")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-color)")}
        />
      </SimulatorPanel>

      <SimulatorPanel title="Hash Type">
        <div className="space-y-2">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              checked={hashType === "sha256"}
              onChange={() => setHashType("sha256")}
              className="w-4 h-4"
            />
            <span className="text-sm">SHA-256 Simulation</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              checked={hashType === "mock"}
              onChange={() => setHashType("mock")}
              className="w-4 h-4"
            />
            <span className="text-sm">Mock Hash (Async)</span>
          </label>
        </div>
      </SimulatorPanel>

      <div
        className="glass p-6 rounded-2xl"
        style={{ backgroundColor: "var(--surface)", borderColor: "var(--border-color)" }}
      >
        <Button
          onClick={handleHash}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-accent-primary to-accent-tertiary hover:opacity-90 text-white rounded-xl disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader className="w-4 h-4 mr-2 animate-spin" />
              Hashing...
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              Generate Hash
            </>
          )}
        </Button>
      </div>

      <SimulatorResult output={output} title="Hash Result" />
    </>
  )
}
