// Fichier : components/simulator-caesar.tsx

"use client"

import { useState } from "react"
import { useSimulate, useCryptoAction } from "@/lib/api-hooks"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, Lock, Unlock, Play } from "lucide-react"
import type { CryptoActionResult, SimulationTrace } from "@/lib/api-client"

// ... (interface inchangée) ...
interface SimulatorCaesarProps {
    setSimResult: (result: SimulationTrace | null) => void
    setFinalOutput: (result: CryptoActionResult | null) => void
    clearResults: () => void
    onSimulationStart: () => void
    onSimulationEnd: (result: SimulationTrace | null, output: CryptoActionResult | null) => void
    isSimulating: boolean
}

export function SimulatorCaesar({
                                    clearResults,
                                    onSimulationStart,
                                    onSimulationEnd,
                                    isSimulating,
                                }: SimulatorCaesarProps) {
    // ... (logique inchangée) ...
    const [text, setText] = useState("Hello World")
    const [shift, setShift] = useState("3")

    const { simulate, loading: simLoading, error: simError } = useSimulate()
    const { execute, loading: actionLoading, error: actionError } = useCryptoAction()

    const isLoading = isSimulating

    const handleAction = async (action: "encrypt" | "decrypt") => {
        clearResults()
        onSimulationStart()
        const shiftNum = parseInt(shift, 10)
        if (isNaN(shiftNum)) {
            alert("Le décalage doit être un nombre.")
            onSimulationEnd(null, null)
            return
        }

        let apiResponse: CryptoActionResult | null = null
        try {
            const response = await execute("caesar", action, {
                text: text,
                shift: shiftNum,
            })
            apiResponse = response ?? null

            if (action === 'encrypt') {
                setText(response?.cipher ?? text)
            } else {
                setText(response?.plain ?? text)
            }

        } catch (error) {
            console.error(error)
        }
        onSimulationEnd(null, apiResponse)
    }

    const handleSimulate = async () => {
        clearResults()
        onSimulationStart()
        const shiftNum = parseInt(shift, 10)
        if (isNaN(shiftNum)) {
            alert("Le décalage doit être un nombre.")
            onSimulationEnd(null, null)
            return
        }

        let simResponse: SimulationTrace | null = null
        let encryptResponse: CryptoActionResult | null = null
        try {
            const apiData = { text: text, shift: shiftNum }

            const [simData, encryptData] = await Promise.all([
                simulate("caesar", apiData),
                execute("caesar", "encrypt", apiData)
            ]);

            simResponse = simData
            encryptResponse = encryptData ?? null
            setText(encryptData?.cipher ?? text)

        } catch (error) {
            console.error(error)
        }
        onSimulationEnd(simResponse, encryptResponse)
    }

    const error = simError || actionError

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="caesar-text">Texte</Label>
                    {/* REMARQUE : Style .glass appliqué */}
                    <Textarea
                        id="caesar-text"
                        placeholder="Entrez votre texte..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="glass min-h-[100px]"
                        disabled={isLoading}
                    />
                </div>
                <div className="space-y-2 md:col-span-1">
                    <Label htmlFor="caesar-shift">Décalage (Shift)</Label>
                    {/* REMARQUE : Style .glass appliqué */}
                    <Input
                        id="caesar-shift"
                        type="number"
                        placeholder="3"
                        value={shift}
                        onChange={(e) => setShift(e.target.value)}
                        disabled={isLoading}
                        className="glass h-[100px] text-3xl text-center"
                    />
                </div>
            </div>

            {/* --- BOUTONS --- */}
            <div className="flex flex-col sm:flex-row gap-2">
                {/* REMARQUE : Utilisation de .btn-gemini */}
                <Button
                    onClick={() => handleAction("encrypt")}
                    disabled={isLoading}
                    className="btn-gemini flex-1 gap-2"
                >
                    {actionLoading && isSimulating ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <Lock className="w-4 h-4" />
                    )}
                    Chiffrer
                </Button>
                {/* REMARQUE : Utilisation de .glass pour le bouton secondaire */}
                <Button
                    onClick={() => handleAction("decrypt")}
                    disabled={isLoading}
                    className="glass rounded-lg flex-1 gap-2"
                    variant="outline"
                >
                    {actionLoading && isSimulating ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <Unlock className="w-4 h-4" />
                    )}
                    Déchiffrer
                </Button>
            </div>

            {/* REMARQUE : Bouton de simulation avec la couleur d'accent secondaire (magenta) */}
            <Button
                onClick={handleSimulate}
                disabled={isLoading}
                className="w-full gap-2 text-white bg-[var(--color-magenta)] hover:bg-[var(--color-magenta)]/80"
            >
                {simLoading && isSimulating ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <Play className="w-4 h-4" />
                )}
                Lancer la Simulation 3D
            </Button>

            {/* REMARQUE : Alerte d'erreur stylisée */}
            {error && (
                <Alert variant="destructive" className="glass border-danger/50 text-danger">
                    <AlertTitle>Erreur de l&apos;API</AlertTitle>
                    <AlertDescription className="break-all">{`${error}`}</AlertDescription>
                </Alert>
            )}
        </div>
    )
}