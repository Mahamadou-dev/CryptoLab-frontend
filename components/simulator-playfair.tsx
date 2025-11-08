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

// ... (interface inchangée) ...
interface SimulatorPlayfairProps {
    setSimResult: (result: any) => void
    setFinalOutput: (result: any) => void
    clearResults: () => void
    onSimulationStart: () => void
    onSimulationEnd: (result: any, output: any) => void
    isSimulating: boolean
}

export function SimulatorPlayfair({
                                      setSimResult,
                                      setFinalOutput,
                                      clearResults,
                                      onSimulationStart,
                                      onSimulationEnd,
                                      isSimulating,
                                  }: SimulatorPlayfairProps) {
    // --- I18N SETUP ---
    // TODO: Récupérez la langue actuelle depuis votre contexte global ou vos props.
    const { language } = useLanguage()
    const t = useTranslation(language)

    // ... (logique inchangée) ...
    const [text, setText] = useState("Hello World")
    const [key, setKey] = useState("CRYPTO")

    const { simulate, loading: simLoading, error: simError } = useSimulate()
    const { execute, loading: actionLoading, error: actionError } = useCryptoAction()

    const isLoading = simLoading || actionLoading

    const handleAction = async (action: "encrypt" | "decrypt") => {
        if (!key) {
            alert(t("sim.error.keyEmpty"))
            return
        }
        clearResults()
        onSimulationStart()

        try {
            const response = await execute("playfair", action, {
                text: text,
                key: key,
            })
            onSimulationEnd(null, response)
        } catch (error) {
            onSimulationEnd(null, null)
            console.error(error)
        }
    }

    const handleSimulate = async () => {
        if (!key) {
            alert(t("sim.error.keyEmpty"))
            return
        }
        clearResults()
        onSimulationStart()

        try {
            const response = await simulate("playfair", {
                text: text,
                key: key,
            })
            onSimulationEnd(response, { final_result: response.final_result })
        } catch (error) {
            onSimulationEnd(null, null)
            console.error(error)
        }
    }

    const error = simError || actionError

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="playfair-text">{t("sim.textLabel")}</Label>
                    {/* REMARQUE : Style .glass appliqué */}
                    <Textarea
                        id="playfair-text"
                        placeholder={t("sim.textPlaceholder")}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="glass min-h-[100px]"
                        disabled={isSimulating}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="playfair-key">{t("sim.keyLabel")}</Label>
                    {/* REMARQUE : Style .glass appliqué */}
                    <Input
                        id="playfair-key"
                        placeholder={t("sim.playfair.keyPlaceholder")}
                        value={key}
                        onChange={(e) => setKey(e.target.value.toUpperCase().replace(/J/g, "I"))}
                        disabled={isSimulating}
                        className="glass"
                    />
                    <p className="text-xs text-foreground-secondary">
                        {t("sim.playfair.keyHint")}
                    </p>
                </div>
            </div>

            {/* --- BOUTONS --- */}
            <div className="flex flex-col sm:flex-row gap-2">
                {/* REMARQUE : Utilisation de .btn-gemini */}
                <Button onClick={() => handleAction("encrypt")} disabled={isLoading} className="btn-gemini flex-1 gap-2">
                    <Lock className="w-4 h-4" />
                    {t("sim.encrypt")}
                </Button>
                {/* REMARQUE : Utilisation de .glass pour le bouton secondaire */}
                <Button
                    onClick={() => handleAction("decrypt")}
                    disabled={isLoading}
                    className="glass rounded-lg flex-1 gap-2"
                    variant="outline"
                >
                    <Unlock className="w-4 h-4" />
                    {t("sim.decrypt")}
                </Button>
                {/* REMARQUE : Bouton de simulation avec la couleur d'accent secondaire (magenta) */}
                <Button
                    onClick={handleSimulate}
                    disabled={isLoading}
                    className="flex-1 gap-2 text-white bg-[var(--color-magenta)] hover:bg-[var(--color-magenta)]/80"
                >
                    {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <Play className="w-4 h-4" />
                    )}
                    {t("sim.simulate")}
                </Button>
            </div>

            {/* REMARQUE : Alerte d'erreur stylisée */}
            {error && (
                <Alert variant="destructive" className="glass border-[var(--color-rose)]/50 text-[var(--color-rose)]">
                    <AlertTitle>{t("sim.apiError")}</AlertTitle>
                    <AlertDescription className="break-all">{error}</AlertDescription>
                </Alert>
            )}
        </div>
    )
}