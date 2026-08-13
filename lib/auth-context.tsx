"use client"

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"

import { AuthError, type LoginPayload, type RegisterPayload, type User, unwrap } from "@/lib/auth"

interface AuthState {
    user: User | null
    /** `true` tant que la session n'a pas ete verifiee aupres du serveur. */
    loading: boolean
    login: (payload: LoginPayload) => Promise<User>
    register: (payload: RegisterPayload) => Promise<User>
    logout: () => Promise<void>
    refresh: () => Promise<void>
}

const AuthContext = createContext<AuthState | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    // La session vit dans un cookie httpOnly : le client ne peut pas la lire
    // directement, il doit la demander au serveur.
    const refresh = useCallback(async () => {
        try {
            const response = await fetch("/api/auth/me", { cache: "no-store" })
            const body = (await response.json()) as { user: User | null }
            setUser(body.user ?? null)
        } catch {
            setUser(null)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        // Cas prevu par la regle : on interroge un systeme exterieur (le cookie
        // de session, lisible du seul serveur) et l'etat est mis a jour dans la
        // reponse asynchrone, pas dans le corps de l'effet.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        void refresh()
    }, [refresh])

    const submit = useCallback(async (path: string, payload: unknown): Promise<User> => {
        const response = await fetch(path, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        })
        const body = await unwrap<{ user: User }>(response)
        setUser(body.user)
        setLoading(false)
        return body.user
    }, [])

    const login = useCallback(
        (payload: LoginPayload) => submit("/api/auth/login", payload),
        [submit],
    )

    const register = useCallback(
        (payload: RegisterPayload) => submit("/api/auth/register", payload),
        [submit],
    )

    const logout = useCallback(async () => {
        try {
            await fetch("/api/auth/logout", { method: "POST" })
        } finally {
            setUser(null)
        }
    }, [])

    const value = useMemo(
        () => ({ user, loading, login, register, logout, refresh }),
        [user, loading, login, register, logout, refresh],
    )

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthState {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error("useAuth doit etre utilise a l'interieur d'un <AuthProvider>.")
    }
    return context
}

export { AuthError }
