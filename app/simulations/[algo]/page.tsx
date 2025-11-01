"use client"

import { Navigation } from "@/components/navigation"
import { useState } from "react"
import { algorithms } from "@/lib/algorithms"
import { SimulatorPanel } from "@/components/simulator-panel"
import { AlgorithmInfoCard } from "@/components/algorithm-info-card"
import { DataCube } from "@/components/3d/data-cube"
import { SimulatorCaesar } from "@/components/simulator-caesar"
import { SimulatorVigenere } from "@/components/simulator-vigenere"
import { SimulatorHash } from "@/components/simulator-hash"
import { useLanguage } from "@/lib/language-context"
import { useTranslation } from "@/lib/i18n"

const simulatorMap = {
  caesar: SimulatorCaesar,
  vigenere: SimulatorVigenere,
  playfair: SimulatorVigenere,
  sha256: SimulatorHash,
  bcrypt: SimulatorHash,
  des: SimulatorCaesar,
  aes: SimulatorVigenere,
  rsa: SimulatorCaesar,
}

export default function SimulatorPage({ params }: { params: { algo: string } }) {
  const [output, setOutput] = useState("")
  const { language } = useLanguage()
  const t = useTranslation(language)

  const algorithm = algorithms.find((a) => a.id === params.algo)
  const SimulatorComponent = simulatorMap[params.algo as keyof typeof simulatorMap] || SimulatorCaesar

  if (!algorithm) {
    return (
      <main className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-2xl font-bold text-foreground">{t("simulator.not-found")}</h1>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <div className="text-4xl mb-3">{algorithm.icon}</div>
          <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-accent-primary to-accent-secondary">
            {algorithm.name} {t("simulator.title")}
          </h1>
          <p className="text-foreground-secondary max-w-2xl">{algorithm.description}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Panel */}
          <div className="lg:col-span-2 space-y-6">
            <SimulatorComponent onResult={setOutput} />

            {/* 3D Visualization Area */}
            <SimulatorPanel
              title={t("simulator.visualization")}
              className="h-80 flex items-center justify-center overflow-hidden"
            >
              <div className="w-full h-full">
                <DataCube size={1.5} rotationSpeed={0.005} color={0xb8336a} />
              </div>
            </SimulatorPanel>
          </div>

          {/* Info */}
          <div className="space-y-6">
            <AlgorithmInfoCard algorithm={algorithm} />
          </div>
        </div>
      </div>
    </main>
  )
}
