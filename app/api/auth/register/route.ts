import { NextResponse } from "next/server"

import { type AuthResponse, callApi, forwardError, setSessionCookie } from "@/lib/auth-server"

/**
 * POST /api/auth/register
 *
 * Relaie l'inscription vers FastAPI, puis echange le jeton contre un cookie
 * httpOnly. Le corps de la reponse ne contient que le profil public : le jeton
 * n'atteint jamais le JavaScript de la page.
 */
export async function POST(request: Request) {
    let payload: unknown
    try {
        payload = await request.json()
    } catch {
        return NextResponse.json({ detail: "Requete invalide." }, { status: 400 })
    }

    const response = await callApi("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(payload),
    })

    if (!response.ok) return forwardError(response)

    const data = (await response.json()) as AuthResponse
    return setSessionCookie(
        NextResponse.json({ user: data.user }, { status: 201 }),
        data.access_token,
        data.expires_in,
    )
}
