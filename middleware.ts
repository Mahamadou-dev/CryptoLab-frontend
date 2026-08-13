import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

import { PROTECTED_PREFIXES, SESSION_COOKIE, readExpiry } from "@/lib/auth"

/**
 * Garde d'acces a l'apprentissage et au laboratoire.
 *
 * Le middleware ne verifie PAS la signature du jeton : le secret vit cote
 * FastAPI et n'a rien a faire dans le frontend. Il ecarte simplement les visites
 * sans cookie ou avec un cookie manifestement perime, pour ne pas afficher une
 * page qui echouerait ensuite a chaque appel d'API. L'autorisation qui fait foi
 * reste celle du backend, a chaque requete.
 */
export function middleware(request: NextRequest) {
    const { pathname, search } = request.nextUrl

    const isProtected = PROTECTED_PREFIXES.some(
        (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
    )
    if (!isProtected) return NextResponse.next()

    const token = request.cookies.get(SESSION_COOKIE)?.value
    const expiry = token ? readExpiry(token) : null
    const expired = expiry !== null && expiry * 1000 <= Date.now()

    if (token && !expired) return NextResponse.next()

    const login = new URL("/login", request.url)
    // On memorise la destination pour y ramener l'utilisateur apres connexion.
    login.searchParams.set("next", `${pathname}${search}`)
    if (expired) login.searchParams.set("reason", "expired")

    const response = NextResponse.redirect(login)
    if (expired) response.cookies.delete(SESSION_COOKIE)
    return response
}

export const config = {
    // Exclut les fichiers statiques et les routes d'API, qui gerent leur propre
    // autorisation.
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
