// Fichier: components/simulator-railfence.tsx
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
interface SimulatorRailfenceProps {
    setSimResult: (result: any) => void
    setFinalOutput: (result: any) => void
    clearResults: () => void
    onSimulationStart: () => void
    onSimulationEnd: (result: any, output: any) => void
    isSimulating: boolean
}

export function SimulatorRailfence({
                                       setSimResult,
                                       setFinalOutput,
                                       clearResults,
                                       onSimulationStart,
                                       onSimulationEnd,
                                       isSimulating,
                                   }: SimulatorRailfenceProps) {
    // --- I18N SETUP ---
    // TODO: Récupérez la langue actuelle depuis votre contexte global ou vos props.
    const { language } = useLanguage()
    const t = useTranslation(language)

    // ... (logique inchangée) ...
    const [text, setText] = useState(t("sim.railfence.defaultText"))
    const [depth, setDepth] = useState("4")

    const { simulate, loading: simLoading, error: simError } = useSimulate()
    const { execute, loading: actionLoading, error: actionError } = useCryptoAction()

    const isLoading = isSimulating

    const handleAction = async (action: "encrypt" | "decrypt") => {
        clearResults()
        onSimulationStart()
        const depthNum = parseInt(depth, 10)
        if (isNaN(depthNum) || depthNum <= 1) {
            alert(t("sim.error.depth"))
            onSimulationEnd(null, null)
            return
        }

        let apiResponse = null
        try {
            const response = await execute("railfence", action, {
                text: text,
                shift: depthNum,
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
        clearResults()
        onSimulationStart()
        const depthNum = parseInt(depth, 10)
        if (isNaN(depthNum) || depthNum <= 1) {
            alert(t("sim.error.depth"))
            onSimulationEnd(null, null)
            return
        }

        let simResponse = null
        let encryptResponse = null
        try {
            const apiData = { text: text, shift: depthNum }

            const [simData, encryptData] = await Promise.all([
                simulate("railfence", apiData),
                execute("railfence", "encrypt", apiData)
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="railfence-text">{t("sim.textLabel")}</Label>
                    {/* REMARQUE : Style .glass appliqué */}
                    <Textarea
                        id="railfence-text"
                        placeholder={t("sim.textPlaceholder")}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="glass min-h-[100px]"
                        disabled={isLoading}
                    />
                </div>
                <div className="space-y-2 md:col-span-1">
                    <Label htmlFor="railfence-depth">{t("sim.railfence.depthLabel")}</Label>
                    {/* REMARQUE : Style .glass appliqué */}
                    <Input
                        id="railfence-depth"
                        type="number"
                        placeholder="4"
                        value={depth}
                        onChange={(e) => setDepth(e.target.value)}
                        disabled={isLoading}
                        className="glass h-[100px] text-3xl text-center"
                        min="2"
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
                    {t("sim.encrypt")}
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
                    {t("sim.decrypt")}
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
                {t("sim.run3DSim")}
            </Button>

            {/* REMARQUE : Alerte d'erreur stylisée */}
            {error && (
                <Alert variant="destructive" className="glass border-[var(--color-rose)]/50 text-[var(--color-rose)]">
                    <AlertTitle>{t("sim.apiError")}</AlertTitle>
                    <AlertDescription className="break-all">{`${error}`}</AlertDescription>
                </Alert>
            )}
        </div>
    )
}