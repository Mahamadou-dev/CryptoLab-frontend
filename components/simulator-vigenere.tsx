"use client"

import { useState } from "react"
import { vigenereEncrypt, vigenereDecrypt } from "@/lib/crypto/vigenere"
import { SimulatorPanel } from "./simulator-panel"
import { SimulatorResult } from "./simulator-result"
import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"

interface SimulatorVigenereProps {
  onResult?: (output: string) => void
}

export function SimulatorVigenere({ onResult }: SimulatorVigenereProps) {
  const [input, setInput] = useState("")
  const [key, setKey] = useState("SECRET")
  const [output, setOutput] = useState("")
  const [mode, setMode] = useState<"encrypt" | "decrypt">("encrypt")

  const handleProcess = () => {
    try {
      if (!key.trim()) {
        setOutput("Error: Key cannot be empty")
        return
      }
      const result = mode === "encrypt" ? vigenereEncrypt(input, key) : vigenereDecrypt(input, key)
      setOutput(result)
      onResult?.(result)
    } catch (error) {
      setOutput(`Error: ${error instanceof Error ? error.message : "Unknown error"}`)
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
          placeholder="Enter text to encrypt/decrypt..."
          onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent-primary)")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-color)")}
        />
      </SimulatorPanel>

      <SimulatorPanel title="Key">
        <input
          type="text"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          className="w-full rounded-xl p-3 text-foreground placeholder-foreground-tertiary focus:outline-none border-2"
          style={{ backgroundColor: "var(--background-secondary)", borderColor: "var(--border-color)" }}
          placeholder="Enter encryption key (letters only)..."
          onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent-primary)")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-color)")}
        />
        <p className="text-xs text-foreground-tertiary mt-2">Key must contain letters only</p>
      </SimulatorPanel>

      <div
        className="glass p-6 rounded-2xl space-y-3"
        style={{ backgroundColor: "var(--surface)", borderColor: "var(--border-color)" }}
      >
        <Button
          onClick={() => {
            setMode("encrypt")
            handleProcess()
          }}
          className="w-full bg-gradient-to-r from-accent-primary to-accent-tertiary hover:opacity-90 text-white rounded-xl"
        >
          <Play className="w-4 h-4 mr-2" />
          Encrypt
        </Button>
        <Button
          onClick={() => {
            setMode("decrypt")
            handleProcess()
          }}
          variant="outline"
          className="w-full glass border-accent-secondary rounded-xl bg-transparent border-2"
          style={{ borderColor: "var(--accent-secondary)", backgroundColor: "var(--surface)" }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--surface-hover)")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--surface)")}
        >
          Decrypt
        </Button>
      </div>

      <SimulatorResult output={output} title={`${mode === "encrypt" ? "Encrypted" : "Decrypted"} Text`} />
    </>
  )
}
