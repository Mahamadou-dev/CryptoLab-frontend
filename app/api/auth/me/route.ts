import { NextResponse } from "next/server"

import { callApi, clearSessionCookie, readSessionToken } from "@/lib/auth-server"

/**
 * GET /api/auth/me
 *
 * Source de verite du contexte d'authentification cote client. Un cookie perime
 * ou forge est efface au passage, pour ne pas laisser l'interface dans un etat
 * « connecte » qui ne correspond a rien.
 */
export async function GET() {
    const token = await readSessionToken()
    if (!token) {
        return NextResponse.json({ user: null }, { status: 200 })
    }

    let response: Response
    try {
        response = await callApi("/api/auth/me", { token })
    } catch {
        // API injoignable : on ne detruit pas la session pour autant, l'utilisateur
        // n'y est pour rien.
        return NextResponse.json(
            { user: null, detail: "Service d'authentification injoignable." },
            { status: 503 },
        )
    }

    if (response.status === 401) {
        return clearSessionCookie(NextResponse.json({ user: null }, { status: 200 }))
    }

    if (!response.ok) {
        return NextResponse.json({ user: null }, { status: 200 })
    }

    return NextResponse.json({ user: await response.json() })
}
