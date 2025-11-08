// Fichier : components/simulator-hash.tsx

"use client"

import { useState } from "react"
import { useCryptoAction } from "@/lib/api-hooks" // On utilise le hook d'action
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, Zap, CheckCircle, Play } from "lucide-react"
// --- AJOUT I18N ---
import { useTranslation, Language } from "@/lib/i18n"
import {useLanguage} from "@/lib/language-context";

/**
 * Interface pour les props (maintenant identique aux autres)
 */
interface SimulatorHashProps {
    setSimResult: (result: any) => void
    setFinalOutput: (result: any) => void
    clearResults: () => void
    onSimulationStart: () => void
    onSimulationEnd: (result: any, output: any) => void
    isSimulating: boolean
    algoId: string // Reçoit "sha256" ou "bcrypt"
}

export function SimulatorHash({
                                  setSimResult,
                                  setFinalOutput,
                                  clearResults,
                                  onSimulationStart,
                                  onSimulationEnd,
                                  isSimulating,
                                  algoId,
                              }: SimulatorHashProps) {
    // --- I18N SETUP ---
    // TODO: Récupérez la langue actuelle depuis votre contexte global ou vos props.
    const { language } = useLanguage()
    const t = useTranslation(language)

    // --- États pour les champs du formulaire ---
    const [text, setText] = useState("password123")
    const [hashedText, setHashedText] = useState("")

    // --- Notre Hook API (ne reçoit plus 'result') ---
    const {
        execute,
        loading: actionLoading,
        error: actionError,
    } = useCryptoAction()

    // Il n'y a pas de 'simLoading' pour le hachage, car il n'y a pas de bouton "Simuler"
    const isLoading = isSimulating

    // --- Gestionnaire de Hachage ---
    const handleHash = async () => {
        clearResults()
        onSimulationStart()
        let apiResponse = null
        try {
            const response = await execute(algoId, "hash", { text })
            apiResponse = response
            if (algoId === 'bcrypt') {
                setHashedText(response.hash) // Sauvegarde pour la vérification
            }
        } catch (error) {
            console.error(error)
        }
        onSimulationEnd(null, apiResponse) // Envoie le résultat au parent
    }

    // --- Gestionnaire de Vérification (Bcrypt seulement) ---
    const handleVerify = async () => {
        if (!hashedText) {
            alert(t("sim.error.hash.verify"))
            return
        }
        clearResults()
        onSimulationStart()
        let apiResponse = null
        try {
            // L'action est "verify"
            const response = await execute(algoId, "verify", { text, hashed_text: hashedText })
            apiResponse = response
        } catch (error) {
            console.error(error)
        }
        onSimulationEnd(null, apiResponse) // Envoie le résultat au parent
    }

    // Affiche l'erreur (de n'importe quel hook)
    const error = actionError

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="hash-text">{t("sim.hash.plainTextLabel")}</Label>
                    {/* REMARQUE : Style .glass appliqué */}
                    <Input
                        id="hash-text"
                        placeholder={t("sim.textPlaceholder")}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        disabled={isLoading}
                        className="glass"
                    />
                </div>

                {/* Section de vérification pour Bcrypt */}
                {algoId === 'bcrypt' && (
                    <div className="space-y-2">
                        <Label htmlFor="hash-verify">{t("sim.hash.verifyLabel")}</Label>
                        {/* REMARQUE : Style .glass appliqué */}
                        <Input
                            id="hash-verify"
                            placeholder={t("sim.hash.verifyPlaceholder")}
                            value={hashedText}
                            onChange={(e) => setHashedText(e.target.value)}
                            disabled={isLoading}
                            className="glass font-mono text-xs"
                        />
                    </div>
                )}
            </div>

            {/* --- BOUTONS --- */}
            <div className="flex flex-col sm:flex-row gap-2">
                {/* REMARQUE : Style .btn-gemini appliqué */}
                <Button onClick={handleHash} disabled={isLoading} className="btn-gemini flex-1 gap-2">
                    {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <Zap className="w-4 h-4" />
                    )}
                    {t("sim.hash.generateButton")}
                </Button>

                {algoId === 'bcrypt' && (
                    /* REMARQUE : Style .glass appliqué au bouton secondaire */
                    <Button onClick={handleVerify} disabled={isLoading} variant="outline" className="glass rounded-lg flex-1 gap-2">
                        {isLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <CheckCircle className="w-4 h-4" />
                        )}
                        {t("sim.hash.verifyButton")}
                    </Button>
                )}
            </div>

            {/* REMARQUE : Alerte d'erreur stylisée */}
            {error && (
                <Alert variant="destructive" className="glass border-[var(--color-rose)]/50 text-[var(--color-rose)]">
                    <AlertTitle>{t("sim.apiError")}</AlertTitle>
                    <AlertDescription className="break-all">{error}</AlertDescription>
                </Alert>
            )}

            {/* Le panneau de résultat a été supprimé. Le parent (page.tsx) s'en charge. */}
        </div>
    )
}