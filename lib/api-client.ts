// Fichier: lib/api-client.ts

// 1. DÉFINIR L'URL DE BASE

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

// --- Interfaces Pydantic (correspondent au backend) ---
// Note : Nous n'utilisons plus "EncryptionRequest" générique

// /api/classical/*
export interface CaesarInput {
    text: string
    shift: number
}
export interface KeyTextInput {
    text: string
    key: string
}

// /api/hash/*
export interface TextInput {
    text: string
}
export interface BcryptVerifyInput {
    text: string
    hashed_text: string
}

// /api/modern/*
export interface AesInput {
    text: string
    key: string
}
export interface AesDecryptInput {
    cipher_hex: string
    key: string
    nonce_hex: string
    tag_hex: string
}
export interface DesInput {
    text: string
    key: string
}
export interface DesDecryptInput {
    cipher_hex: string
    key: string
    iv_hex: string
}

// /api/asymmetric/*
export interface RsaEncryptInput {
    text: string
    public_key: string
}
export interface RsaDecryptInput {
    cipher_hex: string
    private_key: string
}

/**
 * Gère les erreurs de l'API FastAPI
 */
class ApiError extends Error {
    status: number
    detail: any

    constructor(message: string, status: number, detail: any) {
        super(message)
        this.name = "ApiError"
        this.status = status
        this.detail = detail
    }
}

/**
 * Client API mis à jour pour correspondre parfaitement au backend FastAPI
 */
export class CryptoAPIClient {
    private baseUrl: string

    constructor(baseUrl: string = API_BASE_URL) {
        this.baseUrl = baseUrl
    }

    /**
     * Helper pour les requêtes POST
     */
    private async post(endpoint: string, body: any): Promise<any> {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        })

        if (!response.ok) {
            const errData = await response.json()
            throw new ApiError(
                `API Error: ${response.statusText}`,
                response.status,
                errData.detail || "Unknown error",
            )
        }
        return response.json()
    }

    /**
     * Helper pour les requêtes GET
     */
    private async get(endpoint: string): Promise<any> {
        const response = await fetch(`${this.baseUrl}${endpoint}`)
        if (!response.ok) {
            const errData = await response.json()
            throw new ApiError(
                `API Error: ${response.statusText}`,
                response.status,
                errData.detail || "Unknown error",
            )
        }
        return response.json()
    }

    // --- Méthodes "Classical" ---
    async caesarEncrypt(data: CaesarInput) {
        return this.post("/api/classical/caesar/encrypt", data)
    }
    async vigenereEncrypt(data: KeyTextInput) {
        return this.post("/api/classical/vigenere/encrypt", data)
    }
    async playfairEncrypt(data: KeyTextInput) {
        return this.post("/api/classical/playfair/encrypt", data)
    }
    async railfenceEncrypt(data: CaesarInput) {
        return this.post("/api/classical/railfence/encrypt", data)
    }

    async caesarDecrypt(data: CaesarInput) {
        return this.post("/api/classical/caesar/decrypt", data)
    }
    async vigenereDecrypt(data: KeyTextInput) {
        return this.post("/api/classical/vigenere/decrypt", data)
    }
    async playfairDecrypt(data: KeyTextInput) {
        return this.post("/api/classical/playfair/decrypt", data)
    }
    async railfenceDecrypt(data: CaesarInput) {
        return this.post("/api/classical/railfence/decrypt", data)
    }


    // --- Méthodes "Hashing" ---
    async hashSha256(data: TextInput) {
        return this.post("/api/hash/sha256", data)
    }
    async hashBcrypt(data: TextInput) {
        return this.post("/api/hash/bcrypt", data)
    }
    async bcryptVerify(data: BcryptVerifyInput) {
        return this.post("/api/hash/bcrypt/verify", data)
    }

    // --- Méthodes "Modern Symmetric" ---
    async aesEncrypt(data: AesInput) {
        return this.post("/api/modern/aes/encrypt", data)
    }
    async aesDecrypt(data: AesDecryptInput) {
        return this.post("/api/modern/aes/decrypt", data)
    }
    async desEncrypt(data: DesInput) {
        return this.post("/api/modern/des/encrypt", data)
    }
    async desDecrypt(data: DesDecryptInput) {
        return this.post("/api/modern/des/decrypt", data)
    }

    // --- Méthodes "Asymmetric" ---
    async rsaGenerateKeys() {
        return this.get("/api/asymmetric/rsa/generate-keys")
    }
    async rsaEncrypt(data: RsaEncryptInput) {
        return this.post("/api/asymmetric/rsa/encrypt", data)
    }
    async rsaDecrypt(data: RsaDecryptInput) {
        return this.post("/api/asymmetric/rsa/decrypt", data)
    }

    // --- Méthodes "Simulation" ---
    async simulate(algo: string, data: any) {
        return this.post(`/api/simulate/${algo}`, data)
    }
}

// Exporte une instance unique (singleton)
export const cryptoAPI = new CryptoAPIClient()