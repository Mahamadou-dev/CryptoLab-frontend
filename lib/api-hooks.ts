// Fichier : lib/api-hooks.ts
"use client"

import { useState, useCallback } from "react"
import {
    cryptoAPI,
    // Importe tous les types d'entrée
    type CaesarInput,
    type KeyTextInput,
    type TextInput,
    type BcryptVerifyInput,
    type AesInput,
    type AesDecryptInput,
    type DesInput,
    type DesDecryptInput,
    type RsaEncryptInput,
    type RsaDecryptInput,
    type CryptoActionResult,
} from "./api-client"

/** Message lisible depuis une erreur de forme quelconque (ApiError, Error, ou autre). */
function getErrorMessage(err: unknown): string {
    if (err instanceof Error) return err.message
    return "Une erreur est survenue"
}

// --- Hook de Simulation (le plus important) ---
export function useSimulate() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const simulate = useCallback(async (algo: string, data: Record<string, unknown>) => {
        setLoading(true)
        setError(null)
        try {
            const response = await cryptoAPI.simulate(algo, data)
            return response // Renvoie les données au composant
        } catch (err) {
            const message = getErrorMessage(err)
            setError(message)
            console.error("[Simulate Hook Error]:", message)
            throw err
        } finally {
            setLoading(false)
        }
    }, [])

    return { simulate, loading, error }
}

// --- Hook d'Action (MAINTENANT CORRIGÉ) ---
export function useCryptoAction() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const execute = useCallback(
        async (
            algo: string,
            // --- CORRECTION 1: Ajout de "generate-keys" à la liste des types ---
            action: "encrypt" | "decrypt" | "hash" | "verify" | "generateKeys" | "generate-keys",
            // `null` : seule "generateKeys" n'a pas de corps de requête.
            data: Record<string, unknown> | null,
        ) => {
            setLoading(true)
            setError(null)
            try {
                let response: CryptoActionResult | undefined

                // --- LE NOUVEAU "CERVEAU" QUI VÉRIFIE L'ACTION ---

                if (action === "encrypt") {
                    switch (algo) {
                        case "caesar":
                            response = await cryptoAPI.caesarEncrypt(data as unknown as CaesarInput)
                            break
                        case "vigenere":
                            response = await cryptoAPI.vigenereEncrypt(data as unknown as KeyTextInput)
                            break
                        case "playfair":
                            response = await cryptoAPI.playfairEncrypt(data as unknown as KeyTextInput)
                            break
                        case "railfence":
                            response = await cryptoAPI.railfenceEncrypt(data as unknown as CaesarInput)
                            break
                        case "des":
                            response = await cryptoAPI.desEncrypt(data as unknown as DesInput)
                            break
                        case "aes":
                            response = await cryptoAPI.aesEncrypt(data as unknown as AesInput)
                            break
                        case "rsa":
                            response = await cryptoAPI.rsaEncrypt(data as unknown as RsaEncryptInput)
                            break
                        default:
                            throw new Error(`Algo non supporté pour 'encrypt': ${algo}`)
                    }
                } else if (action === "decrypt") {
                    switch (algo) {
                        case "caesar":
                            response = await cryptoAPI.caesarDecrypt(data as unknown as CaesarInput)
                            break
                        case "vigenere":
                            response = await cryptoAPI.vigenereDecrypt(data as unknown as KeyTextInput)
                            break
                        case "playfair":
                            response = await cryptoAPI.playfairDecrypt(data as unknown as KeyTextInput)
                            break
                        case "railfence":
                            response = await cryptoAPI.railfenceDecrypt(data as unknown as CaesarInput)
                            break
                        case "des":
                            response = await cryptoAPI.desDecrypt(data as unknown as DesDecryptInput)
                            break
                        case "aes":
                            response = await cryptoAPI.aesDecrypt(data as unknown as AesDecryptInput)
                            break
                        case "rsa":
                            response = await cryptoAPI.rsaDecrypt(data as unknown as RsaDecryptInput)
                            break
                        default:
                            throw new Error(`Algo non supporté pour 'decrypt': ${algo}`)
                    }
                } else if (action === "hash") {
                    if (algo === "sha256") {
                        response = await cryptoAPI.hashSha256(data as unknown as TextInput)
                    } else if (algo === "bcrypt") {
                        response = await cryptoAPI.hashBcrypt(data as unknown as TextInput)
                    } else {
                        throw new Error(`Algo non supporté pour 'hash': ${algo}`)
                    }
                } else if (action === "verify") {
                    response = await cryptoAPI.bcryptVerify(data as unknown as BcryptVerifyInput)
                    // --- CORRECTION 2: Vérifie "generate-keys" (avec tiret) ET "generateKeys" (camelCase) ---
                } else if (action === "generateKeys" || action === "generate-keys") {
                    response = await cryptoAPI.rsaGenerateKeys()
                } else {
                    throw new Error(`Action non supportée: ${action}`)
                }

                setLoading(false)
                return response
            } catch (err) {
                const message = getErrorMessage(err)
                setError(message)
                setLoading(false)
                // On relaie l'erreur d'origine plutôt qu'une `Error` nue : une
                // `ApiError` porte le code métier (`decryption_failed`,
                // `invalid_key`…), et c'est lui que les pages doivent tester —
                // pas le message, qui est traduisible.
                throw err
            }
        },
        [],
    )

    return { execute, loading, error }
}