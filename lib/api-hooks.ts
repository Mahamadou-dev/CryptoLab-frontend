"use client"

import { useState, useCallback } from "react"
import { cryptoAPI, type EncryptionRequest, type EncryptionResponse } from "./api-client"

export function useEncrypt() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<EncryptionResponse | null>(null)

  const encrypt = useCallback(async (algo: string, request: EncryptionRequest) => {
    setLoading(true)
    setError(null)
    try {
      const response = await cryptoAPI.encrypt(algo, request)
      setResult(response)
      return response
    } catch (err) {
      const message = err instanceof Error ? err.message : "Encryption failed"
      setError(message)
      console.error("[v0] Encryption hook error:", err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return { encrypt, loading, error, result }
}

export function useDecrypt() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<{ text: string } | null>(null)

  const decrypt = useCallback(async (algo: string, cipher: string, key: string) => {
    setLoading(true)
    setError(null)
    try {
      const response = await cryptoAPI.decrypt(algo, cipher, key)
      setResult(response)
      return response
    } catch (err) {
      const message = err instanceof Error ? err.message : "Decryption failed"
      setError(message)
      console.error("[v0] Decryption hook error:", err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return { decrypt, loading, error, result }
}

export function useHash() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<{ hash: string } | null>(null)

  const hash = useCallback(async (algorithm: string, text: string) => {
    setLoading(true)
    setError(null)
    try {
      const response = await cryptoAPI.hash(algorithm, text)
      setResult(response)
      return response
    } catch (err) {
      const message = err instanceof Error ? err.message : "Hashing failed"
      setError(message)
      console.error("[v0] Hash hook error:", err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return { hash, loading, error, result }
}

export function useSimulate() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<any>(null)

  const simulate = useCallback(async (algo: string, request: EncryptionRequest) => {
    setLoading(true)
    setError(null)
    try {
      const response = await cryptoAPI.simulateSteps(algo, request)
      setResult(response)
      return response
    } catch (err) {
      const message = err instanceof Error ? err.message : "Simulation failed"
      setError(message)
      console.error("[v0] Simulate hook error:", err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return { simulate, loading, error, result }
}
