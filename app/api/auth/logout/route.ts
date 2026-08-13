import { NextResponse } from "next/server"

import { clearSessionCookie } from "@/lib/auth-server"

/**
 * POST /api/auth/logout
 *
 * Le jeton est sans etat cote serveur : se deconnecter revient a effacer le
 * cookie. Rien a invalider en base.
 */
export async function POST() {
    return clearSessionCookie(NextResponse.json({ ok: true }))
}
