// Fichier : components/simulator-aes.tsx
"use client"

import { useState } from "react"
import { useSimulate, useCryptoAction } from "@/lib/api-hooks"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, Zap, Lock, Unlock, Play } from "lucide-react"

// Interface pour les props (maintenant standardisée)
interface SimulatorAesProps {
    setSimResult: (result: any) => void
    setFinalOutput: (result: any) => void
    clearResults: () => void
    onSimulationStart: () => void
    onSimulationEnd: (result: any, output: any) => void
    isSimulating: boolean
}

export function SimulatorAes({
                                 setSimResult,
                                 setFinalOutput,
                                 clearResults,
                                 onSimulationStart,
                                 onSimulationEnd,
                                 isSimulating,
                             }: SimulatorAesProps) {
    // --- États pour les champs du formulaire ---
    const [text, setText] = useState("CryptoLab16Bytes") // 16 chars
    const [key, setKey] = useState("MySecretKey16Byt") // 16 chars

    // États pour stocker les résultats de chiffrement (nécessaires pour le déchiffrement)
    const [cipherText, setCipherText] = useState("")
    const [nonce, setNonce] = useState("")
    const [tag, setTag] = useState("")

    // --- Nos Hooks API ---
    const { simulate, loading: simLoading, error: simError } = useSimulate()
    const { execute, loading: actionLoading, error: actionError } = useCryptoAction()

    const isLoading = isSimulating

    // --- Gestionnaires d'Actions ---

    // Bouton "Déchiffrer"
    const handleDecrypt = async () => {
        if (!key || !cipherText || !nonce || !tag) {
            alert("La clé, le texte chiffré, le nonce et le tag sont requis pour le déchiffrement AES-GCM.")
            return
        }
        clearResults()
        onSimulationStart()

        // Construit le corps de la requête Pydantic (AesDecryptInput)
        const data = {
            cipher_hex: cipherText,
            key: key,
            nonce_hex: nonce,
            tag_hex: tag
        }

        try {
            const response = await execute("aes", "decrypt", data)
            onSimulationEnd(null, response) // Pas de 3D pour le déchiffrement
            if (response.plain) {
                setText(response.plain) // Met à jour le texte clair
            }
        } catch (error) {
            onSimulationEnd(null, null)
            console.error(error)
        }
    }

    // Bouton "Chiffrer & Simuler"
    const handleEncryptAndSimulate = async () => {
        if (!key) {
            alert("La clé ne peut pas être vide.")
            return
        }
        clearResults()
        onSimulationStart()

        try {
            const apiData = { text: text, key: key }

            // Appelle les deux APIs en parallèle
            const [simResponse, encryptResponse] = await Promise.all([
                simulate("aes", apiData),
                execute("aes", "encrypt", apiData)
            ]);

            // Sauvegarde les résultats pour le déchiffrement
            setCipherText(encryptResponse.cipher_hex || "")
            setNonce(encryptResponse.nonce_hex || "")
            setTag(encryptResponse.tag_hex || "")

            // Met à jour le parent
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
                {/* Colonne de Gauche: Entrée utilisateur */}
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="aes-text">Texte (max 16 chars)</Label>
                        <Textarea
                            id="aes-text"
                            placeholder="Entrez votre texte..."
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            className="min-h-[100px]"
                            disabled={isLoading}
                            maxLength={16}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="aes-key">Clé (max 16 chars)</Label>
                        <Input
                            id="aes-key"
                            placeholder="ex: MySecretKey16Byt"
                            value={key}
                            onChange={(e) => setKey(e.target.value)}
                            disabled={isLoading}
                            maxLength={16}
                        />
                        <p className="text-xs text-foreground-secondary">
                            Sera hachée en clé AES-256 (32 octets).
                        </p>
                    </div>
                </div>

                {/* Colonne de Droite: Champs pour le déchiffrement */}
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="aes-cipher-text">Texte Chiffré (hex)</Label>
                        <Input
                            id="aes-cipher-text"
                            placeholder="Auto-rempli ou collez"
                            value={cipherText}
                            onChange={(e) => setCipherText(e.target.value)}
                            disabled={isLoading}
                            className="font-mono text-xs"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="aes-nonce">Nonce (hex)</Label>
                        <Input
                            id="aes-nonce"
                            placeholder="Auto-rempli ou collez"
                            value={nonce}
                            onChange={(e) => setNonce(e.target.value)}
                            disabled={isLoading}
                            className="font-mono text-xs"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="aes-tag">Tag (hex)</Label>
                        <Input
                            id="aes-tag"
                            placeholder="Auto-rempli ou collez"
                            value={tag}
                            onChange={(e) => setTag(e.target.value)}
                            disabled={isLoading}
                            className="font-mono text-xs"
                        />
                    </div>
                </div>
            </div>

            {/* --- BOUTONS --- */}
            <div className="flex flex-col sm:flex-row gap-2">
                <Button
                    onClick={handleEncryptAndSimulate}
                    disabled={isLoading}
                    className="flex-1 gap-2"
                    style={{ background: "var(--accent-secondary)" }}
                >
                    {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <Play className="w-4 h-4" />
                    )}
                    Chiffrer & Simuler
                </Button>
                <Button
                    onClick={handleDecrypt}
                    disabled={isLoading || !cipherText || !nonce || !tag} // Désactivé si les champs sont vides
                    className="flex-1 gap-2"
                    variant="outline"
                >
                    {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <Unlock className="w-4 h-4" />
                    )}
                    Déchiffrer
                </Button>
            </div>

            {/* Affichage de l'erreur */}
            {error && (
                <Alert variant="destructive">
                    <AlertTitle>Erreur de l'API</AlertTitle>
                    <AlertDescription className="break-all">{error}</AlertDescription>
                </Alert>
            )}
        </div>
    )
}