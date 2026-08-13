// Cote serveur uniquement : dialogue avec l'API FastAPI et gestion du cookie de
// session. Ce module ne doit jamais etre importe depuis un composant client —
// c'est lui qui manipule le jeton en clair.

import "server-only"

import { cookies } from "next/headers"
import { NextResponse } from "next/server"

import { SESSION_COOKIE, readDetail } from "@/lib/auth"

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000").replace(/\/$/, "")

export interface AuthResponse {
    access_token: string
    token_type: string
    expires_in: number
    user: Record<string, unknown>
}

/** Appelle une route d'authentification du backend. */
export async function callApi(
    path: string,
    init: RequestInit & { token?: string } = {},
): Promise<Response> {
    const { token, headers, ...rest } = init
    return fetch(`${API_BASE_URL}${path}`, {
        ...rest,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...headers,
        },
        // Une session ne doit jamais etre servie depuis un cache.
        cache: "no-store",
    })
}

/**
 * Relaie une erreur du backend au client, en normalisant le message.
 *
 * On ne renvoie que le message : ni la trace, ni l'URL interne de l'API.
 */
export async function forwardError(response: Response): Promise<NextResponse> {
    let body: unknown = null
    try {
        body = await response.json()
    } catch {
        // Corps illisible : le statut suffit.
    }
    const message = readDetail(body) ?? "Le service d'authentification est indisponible."
    return NextResponse.json({ detail: message }, { status: response.status })
}

/**
 * Depose le cookie de session sur la reponse.
 *
 * - `httpOnly` : inaccessible a `document.cookie`, donc a un script injecte.
 * - `secure` hors developpement : jamais transmis en clair.
 * - `sameSite: lax` : suffisant ici, les routes protegees ne sont pas des
 *   actions destructrices declenchables depuis un site tiers.
 */
export function setSessionCookie(response: NextResponse, token: string, maxAge: number) {
    response.cookies.set({
        name: SESSION_COOKIE,
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge,
    })
    return response
}

/** Supprime le cookie de session. */
export function clearSessionCookie(response: NextResponse) {
    response.cookies.set({
        name: SESSION_COOKIE,
        value: "",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 0,
    })
    return response
}

/** Lit le jeton de session de la requete courante, s'il existe. */
export async function readSessionToken(): Promise<string | null> {
    const store = await cookies()
    return store.get(SESSION_COOKIE)?.value ?? null
}
