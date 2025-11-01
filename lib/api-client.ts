const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export interface EncryptionRequest {
  text: string
  key: string
  algorithm: string
  parameters?: Record<string, any>
}

export interface EncryptionResponse {
  cipher: string
  nonce?: string
  metadata?: Record<string, any>
}

export class CryptoAPIClient {
  private baseUrl: string

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl
  }

  async encrypt(algo: string, request: EncryptionRequest): Promise<EncryptionResponse> {
    const response = await fetch(`${this.baseUrl}/api/encrypt/${algo}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      throw new Error(`Encryption failed: ${response.statusText}`)
    }

    return response.json()
  }

  async decrypt(algo: string, cipher: string, key: string): Promise<{ text: string }> {
    const response = await fetch(`${this.baseUrl}/api/decrypt/${algo}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cipher, key }),
    })

    if (!response.ok) {
      throw new Error(`Decryption failed: ${response.statusText}`)
    }

    return response.json()
  }

  async hash(algorithm: string, text: string): Promise<{ hash: string }> {
    const response = await fetch(`${this.baseUrl}/api/hash/${algorithm}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    })

    if (!response.ok) {
      throw new Error(`Hashing failed: ${response.statusText}`)
    }

    return response.json()
  }

  async simulateSteps(algo: string, request: EncryptionRequest): Promise<any> {
    const response = await fetch(`${this.baseUrl}/api/simulate/${algo}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      throw new Error(`Simulation failed: ${response.statusText}`)
    }

    return response.json()
  }
}

export const cryptoAPI = new CryptoAPIClient()
