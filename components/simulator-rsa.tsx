// Fichier : components/simulator-rsa.tsx

"use client"

import { useState } from "react"
import { useCryptoAction } from "@/lib/api-hooks"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, Zap, Lock, Unlock, Key } from "lucide-react"
// --- AJOUT I18N ---
import { useTranslation, Language } from "@/lib/i18n"
import {useLanguage} from "@/lib/language-context";

interface SimulatorRsaProps {
    setSimResult: (result: any) => void
    setFinalOutput: (result: any) => void
    clearResults: () => void
    onSimulationStart: () => void
    onSimulationEnd: (result: any, output: any) => void
    isSimulating: boolean
}

export function SimulatorRsa({
                                 setSimResult,
                                 setFinalOutput,
                                 clearResults,
                                 onSimulationStart,
                                 onSimulationEnd,
                                 isSimulating,
                             }: SimulatorRsaProps) {

    // --- I18N SETUP ---
    // TODO: Récupérez la langue actuelle depuis votre contexte global ou vos props.
    const { language } = useLanguage()
    const t = useTranslation(language)

    // --- États pour les champs du formulaire ---
    // Utilisation de la clé par défaut pour le texte initial si souhaité, sinon garder une string vide ou une valeur par défaut.
    const [text, setText] = useState(t("sim.rsa.defaultText"))
    const [publicKey, setPublicKey] = useState("")
    const [privateKey, setPrivateKey] = useState("")

    const [cipherText, setCipherText] = useState("")

    const { execute, loading: actionLoading, error: actionError } = useCryptoAction()
    const isLoading = isSimulating

    // --- Gestionnaires d'Actions ---

    const handleGenerateKeys = async () => {
        clearResults()
        onSimulationStart()
        let apiResponse = null
        try {
            const response = await execute("rsa", "generateKeys", null)
            apiResponse = response
            setPublicKey(response.public_key || "")
            setPrivateKey(response.private_key || "")
            setFinalOutput(response)
        } catch (error) {
            console.error(error)
        }
        onSimulationEnd(null, apiResponse)
    }

    const handleEncrypt = async () => {
        if (!text || !publicKey) {
            alert(t("sim.error.rsa.encrypt"))
            return
        }
        clearResults()
        onSimulationStart()
        let apiResponse = null
        try {
            const response = await execute("rsa", "encrypt", {
                text: text,
                public_key: publicKey,
            })
            apiResponse = response
            setCipherText(response.cipher_hex || "")
        } catch (error) {
            console.error(error)
        }
        onSimulationEnd(null, apiResponse)
    }

    const handleDecrypt = async () => {
        if (!cipherText || !privateKey) {
            alert(t("sim.error.rsa.decrypt"))
            return
        }
        clearResults()
        onSimulationStart()
        let apiResponse = null
        try {
            const response = await execute("rsa", "decrypt", {
                cipher_hex: cipherText,
                private_key: privateKey,
            })
            apiResponse = response
        } catch (error) {
            console.error(error)
        }
        onSimulationEnd(null, apiResponse)
    }

    const error = actionError

    return (
        <div className="space-y-6">
            {/* 1. Bouton de Génération de Clés */}
            <div className="p-4 rounded-lg bg-surface/50 border border-border/50">
                <Button onClick={handleGenerateKeys} disabled={isLoading} className="w-full gap-2">
                    {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <Key className="w-4 h-4" />
                    )}
                    {t("sim.rsa.generateKeysPair")}
                </Button>
            </div>

            {/* 2. Champs de Clés (Publique et Privée) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="rsa-public-key">{t("sim.rsa.publicKeyLabel")}</Label>
                    <Textarea
                        id="rsa-public-key"
                        placeholder={t("sim.rsa.publicKeyPlaceholder")}
                        value={publicKey}
                        onChange={(e) => setPublicKey(e.target.value)}
                        className="min-h-[150px] font-mono text-xs"
                        disabled={isLoading}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="rsa-private-key">{t("sim.rsa.privateKeyLabel")}</Label>
                    <Textarea
                        id="rsa-private-key"
                        placeholder={t("sim.rsa.privateKeyPlaceholder")}
                        value={privateKey}
                        onChange={(e) => setPrivateKey(e.target.value)}
                        className="min-h-[150px] font-mono text-xs"
                        disabled={isLoading}
                    />
                </div>
            </div>

            {/* 3. Champs de Chiffrement/Déchiffrement */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="rsa-text">{t("sim.rsa.plainTextEncryptLabel")}</Label>
                    <Textarea
                        id="rsa-text"
                        placeholder={t("sim.rsa.plainTextPlaceholder")}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="min-h-[100px]"
                        disabled={isLoading}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="rsa-cipher-text">{t("sim.rsa.cipherTextDecryptLabel")}</Label>
                    <Textarea
                        id="rsa-cipher-text"
                        placeholder={t("sim.rsa.cipherTextPlaceholder")}
                        value={cipherText}
                        onChange={(e) => setCipherText(e.target.value)}
                        className="min-h-[100px] font-mono text-xs"
                        disabled={isLoading}
                    />
                </div>
            </div>

            {/* 4. Boutons d'Action */}
            <div className="flex flex-col sm:flex-row gap-2">
                <Button
                    onClick={handleEncrypt}
                    disabled={isLoading || !publicKey || !text}
                    className="flex-1 gap-2"
                    style={{ background: "var(--accent-secondary)" }}
                >
                    {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <Lock className="w-4 h-4" />
                    )}
                    {t("sim.rsa.encryptButton")}
                </Button>
                <Button
                    onClick={handleDecrypt}
                    disabled={isLoading || !privateKey || !cipherText}
                    className="flex-1 gap-2"
                    variant="outline"
                >
                    {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <Unlock className="w-4 h-4" />
                    )}
                    {t("sim.rsa.decryptButton")}
                </Button>
            </div>

            {/* Affichage de l'erreur */}
            {error && (
                <Alert variant="destructive">
                    <AlertTitle>{t("sim.apiError")}</AlertTitle>
                    <AlertDescription className="break-all">{error}</AlertDescription>
                </Alert>
            )}
        </div>
    )
}