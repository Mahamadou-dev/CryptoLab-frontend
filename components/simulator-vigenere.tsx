// Fichier : components/simulator-vigenere.tsx

"use client"

import { useState } from "react"
import { useSimulate, useCryptoAction } from "@/lib/api-hooks"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, Zap, Lock, Unlock, Play } from "lucide-react"
// --- AJOUT I18N ---
import { useTranslation, Language } from "@/lib/i18n"
import {useLanguage} from "@/lib/language-context";

interface SimulatorVigenereProps {
    // ... (props inchangées)
    setSimResult: (result: any) => void
    setFinalOutput: (result: any) => void
    clearResults: () => void
    onSimulationStart: () => void
    onSimulationEnd: (result: any, output: any) => void
    isSimulating: boolean
}

export function SimulatorVigenere({
                                      setSimResult,
                                      setFinalOutput,
                                      clearResults,
                                      onSimulationStart,
                                      onSimulationEnd,
                                      isSimulating,
                                  }: SimulatorVigenereProps) {

    // --- I18N SETUP ---
    // TODO: Récupérez la langue actuelle depuis votre contexte global ou vos props.
    const { language } = useLanguage()
    const t = useTranslation(language)

    // --- États pour les champs du formulaire ---
    const [text, setText] = useState("Hello World")
    const [key, setKey] = useState("KEY")

    // --- Nos Hooks API ---
    const { simulate, loading: simLoading, error: simError } = useSimulate()
    const { execute, loading: actionLoading, error: actionError } = useCryptoAction()

    // ... (logique inchangée) ...
    const isLoading = isSimulating

    const handleAction = async (action: "encrypt" | "decrypt") => {
        if (!key) {
            // Utilisation de la clé i18n pour l'erreur
            alert(t("sim.error.keyEmpty"))
            return
        }
        clearResults()
        onSimulationStart()

        let apiResponse = null
        try {
            const response = await execute("vigenere", action, {
                text: text,
                key: key,
            })
            apiResponse = response

            if (action === 'encrypt') {
                setText(response.cipher)
            } else {
                setText(response.plain)
            }

        } catch (error) {
            console.error(error)
        }
        onSimulationEnd(null, apiResponse)
    }

    const handleSimulate = async () => {
        if (!key) {
            alert(t("sim.error.keyEmpty"))
            return
        }
        clearResults()
        onSimulationStart()

        let simResponse = null
        let encryptResponse = null
        try {
            const apiData = { text: text, key: key }

            const [simData, encryptData] = await Promise.all([
                simulate("vigenere", apiData),
                execute("vigenere", "encrypt", apiData)
            ]);

            simResponse = simData
            encryptResponse = encryptData

            setText(encryptData.cipher)

        } catch (error) {
            console.error(error)
        }
        onSimulationEnd(simResponse, encryptResponse)
    }

    const error = simError || actionError

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="vigenere-text">{t("sim.textLabel")}</Label>
                    <Textarea
                        id="vigenere-text"
                        placeholder={t("sim.textPlaceholder")}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="glass min-h-[100px]"
                        disabled={isSimulating}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="vigenere-key">{t("sim.keyLabel")}</Label>
                    <Input
                        id="vigenere-key"
                        placeholder={t("sim.vigenere.keyPlaceholder")}
                        value={key}
                        onChange={(e) => setKey(e.target.value.toUpperCase().replace(/[^A-Z]/g, ''))}
                        disabled={isSimulating}
                        className="glass h-[100px] text-3xl text-center"
                    />
                    <p className="text-xs text-foreground-secondary">
                        {t("sim.vigenere.keyHint")}
                    </p>
                </div>
            </div>

            {/* --- BOUTONS --- */}
            <div className="flex flex-col sm:flex-row gap-2">
                <Button onClick={() => handleAction("encrypt")} disabled={isLoading} className="btn-gemini flex-1 gap-2">
                    <Lock className="w-4 h-4" />
                    {t("sim.encrypt")}
                </Button>
                <Button
                    onClick={() => handleAction("decrypt")}
                    disabled={isLoading}
                    className="glass rounded-lg flex-1 gap-2"
                    variant="outline"
                >
                    <Unlock className="w-4 h-4" />
                    {t("sim.decrypt")}
                </Button>
            </div>
            <Button
                onClick={handleSimulate}
                disabled={isLoading}
                className="w-full gap-2 text-white bg-[var(--color-magenta)] hover:bg-[var(--color-magenta)]/80"
            >
                {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                    <Play className="w-4 h-4" />
                )}
                {t("sim.run3DSim")}
            </Button>

            {error && (
                <Alert variant="destructive" className="glass border-[var(--color-rose)]/50 text-[var(--color-rose)]">
                    <AlertTitle>{t("sim.apiError")}</AlertTitle>
                    <AlertDescription className="break-all">{error}</AlertDescription>
                </Alert>
            )}
        </div>
    )
}