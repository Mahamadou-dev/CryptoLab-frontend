// Fichier : components/simulator-des.tsx
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
interface SimulatorDesProps {
    setSimResult: (result: any) => void
    setFinalOutput: (result: any) => void
    clearResults: () => void
    onSimulationStart: () => void
    onSimulationEnd: (result: any, output: any) => void
    isSimulating: boolean
}

export function SimulatorDes({
                                 setSimResult,
                                 setFinalOutput,
                                 clearResults,
                                 onSimulationStart,
                                 onSimulationEnd,
                                 isSimulating,
                             }: SimulatorDesProps) {
    // --- I18N SETUP ---
    // TODO: Récupérez la langue actuelle depuis votre contexte global ou vos props.
    const { language } = useLanguage()
    const t = useTranslation(language)

    // ... (logique inchangée) ...
    const [text, setText] = useState("CryptoLab")
    const [key, setKey] = useState("SecretKey")
    const [iv, setIv] = useState("")
    const [cipherText, setCipherText] = useState("")

    const { simulate, loading: simLoading, error: simError } = useSimulate()
    const { execute, loading: actionLoading, error: actionError } = useCryptoAction()

    const isLoading = isSimulating

    const handleDecrypt = async () => {
        if (!key || !cipherText || !iv) {
            alert(t("sim.error.des.decrypt"))
            return
        }
        clearResults()
        onSimulationStart()

        const data = {
            cipher_hex: cipherText,
            key: key,
            iv_hex: iv
        }

        try {
            const response = await execute("des", "decrypt", data)
            onSimulationEnd(null, response)
        } catch (error) {
            onSimulationEnd(null, null)
            console.error(error)
        }
    }

    const handleEncryptAndSimulate = async () => {
        if (!key) {
            alert(t("sim.error.keyEmpty"))
            return
        }
        clearResults()
        onSimulationStart()

        try {
            const apiData = { text: text, key: key }

            const encryptResponse = await execute("des", "encrypt", apiData)
            const simResponse = await simulate("des", apiData)

            setIv(encryptResponse.iv_hex || "")
            setCipherText(encryptResponse.cipher_hex || "")

            onSimulationEnd(simResponse, encryptResponse)

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
                    <Label htmlFor="des-text">{t("sim.des.textLabel")}</Label>
                    {/* REMARQUE : Style .glass appliqué */}
                    <Textarea
                        id="des-text"
                        placeholder={t("sim.textPlaceholder")}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="glass min-h-[100px]"
                        disabled={isLoading}
                        maxLength={8}
                    />
                </div>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="des-key">{t("sim.des.keyLabel")}</Label>
                        {/* REMARQUE : Style .glass appliqué */}
                        <Input
                            id="des-key"
                            placeholder={t("sim.des.keyPlaceholder")}
                            value={key}
                            onChange={(e) => setKey(e.target.value)}
                            disabled={isLoading}
                            maxLength={8}
                            className="glass"
                        />
                        <p className="text-xs text-foreground-secondary">
                            {t("sim.des.keyHint")}
                        </p>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="des-cipher-text">{t("sim.des.cipherTextLabel")}</Label>
                        {/* REMARQUE : Style .glass appliqué */}
                        <Input
                            id="des-cipher-text"
                            placeholder={t("sim.des.ivPlaceholder")}
                            value={cipherText}
                            onChange={(e) => setCipherText(e.target.value)}
                            disabled={isLoading}
                            className="glass font-mono text-xs"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="des-iv">{t("sim.des.ivLabel")}</Label>
                        {/* REMARQUE : Style .glass appliqué */}
                        <Input
                            id="des-iv"
                            placeholder={t("sim.des.ivPlaceholder")}
                            value={iv}
                            onChange={(e) => setIv(e.target.value)}
                            disabled={isLoading}
                            className="glass font-mono text-xs"
                        />
                    </div>
                </div>
            </div>

            {/* --- BOUTONS CORRIGÉS --- */}
            <div className="flex flex-col sm:flex-row gap-2">
                {/* REMARQUE : Bouton de simulation avec la couleur d'accent secondaire (magenta) */}
                <Button
                    onClick={handleEncryptAndSimulate}
                    disabled={isLoading}
                    className="flex-1 gap-2 text-white bg-[var(--color-magenta)] hover:bg-[var(--color-magenta)]/80"
                >
                    {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <Play className="w-4 h-4" />
                    )}
                    {t("sim.encryptAndSimulate")}
                </Button>
                {/* REMARQUE : Utilisation de .glass pour le bouton secondaire */}
                <Button
                    onClick={handleDecrypt}
                    disabled={isLoading || !cipherText || !iv}
                    className="glass rounded-lg flex-1 gap-2"
                    variant="outline"
                >
                    {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <Unlock className="w-4 h-4" />
                    )}
                    {t("sim.decrypt")}
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