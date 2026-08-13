import { NextResponse } from "next/server"

import { type AuthResponse, callApi, forwardError, setSessionCookie } from "@/lib/auth-server"

/**
 * POST /api/auth/login
 *
 * Meme principe que l'inscription : le jeton emis par FastAPI est range dans un
 * cookie httpOnly et ne redescend pas jusqu'au navigateur en clair.
 */
export async function POST(request: Request) {
    let payload: unknown
    try {
        payload = await request.json()
    } catch {
        return NextResponse.json({ detail: "Requete invalide." }, { status: 400 })
    }

    const response = await callApi("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(payload),
    })

    if (!response.ok) return forwardError(response)

    const data = (await response.json()) as AuthResponse
    return setSessionCookie(
        NextResponse.json({ user: data.user }),
        data.access_token,
        data.expires_in,
    )
}
