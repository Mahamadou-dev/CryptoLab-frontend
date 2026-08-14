import { NextRequest } from "next/server"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { SESSION_COOKIE } from "@/lib/auth"
import { config, middleware } from "@/middleware"

const NOW = new Date("2026-08-14T12:00:00Z")

/** JWT non signe : le middleware ne verifie que `exp`. */
function tokenExpiringIn(seconds: number): string {
    const encode = (value: unknown) =>
        btoa(JSON.stringify(value)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
    const exp = Math.floor(NOW.getTime() / 1000) + seconds
    return `${encode({ alg: "HS256" })}.${encode({ sub: "1", exp })}.signature`
}

function request(path: string, token?: string): NextRequest {
    const url = new URL(path, "https://cryptolaboratory.vercel.app")
    const headers = new Headers()
    if (token) headers.set("cookie", `${SESSION_COOKIE}=${token}`)
    return new NextRequest(url, { headers })
}

/** Le chemin+recherche vers lequel une reponse de redirection pointe. */
function redirectTarget(response: Response): URL {
    return new URL(response.headers.get("location") ?? "")
}

beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(NOW)
})

afterEach(() => {
    vi.useRealTimers()
})

describe("routes publiques", () => {
    it.each(["/", "/about", "/login", "/register", "/learning-not-protected"])(
        "laisse passer %s sans cookie",
        (path) => {
            expect(middleware(request(path)).headers.get("location")).toBeNull()
        },
    )
})

describe("routes protegees", () => {
    const protectedPaths = ["/learn", "/learn/aes", "/simulations", "/simulations/des"]

    it.each(protectedPaths)("laisse passer %s avec une session valide", (path) => {
        const response = middleware(request(path, tokenExpiringIn(3600)))
        expect(response.headers.get("location")).toBeNull()
    })

    it.each(protectedPaths)("renvoie %s vers /login sans cookie", (path) => {
        const target = redirectTarget(middleware(request(path)))

        expect(target.pathname).toBe("/login")
        expect(target.searchParams.get("next")).toBe(path)
        // Sans cookie, il n'y a pas d'expiration a signaler : le message
        // « votre session a expire » serait mensonger a la premiere visite.
        expect(target.searchParams.get("reason")).toBeNull()
    })

    it("conserve la chaine de recherche dans ?next=", () => {
        const target = redirectTarget(middleware(request("/simulations/aes?mode=cbc&step=3")))

        expect(target.searchParams.get("next")).toBe("/simulations/aes?mode=cbc&step=3")
    })

    it("accepte un jeton illisible et laisse le backend trancher", () => {
        // `readExpiry` renvoie null : on ne peut pas prouver que le jeton est
        // perime, donc on ne bloque pas. L'autorisation qui fait foi est celle
        // de FastAPI, a chaque appel.
        expect(middleware(request("/learn", "pas-un-jeton")).headers.get("location")).toBeNull()
    })
})

describe("session expiree", () => {
    it("redirige et signale la raison", () => {
        const target = redirectTarget(middleware(request("/learn/aes", tokenExpiringIn(-1))))

        expect(target.pathname).toBe("/login")
        expect(target.searchParams.get("next")).toBe("/learn/aes")
        expect(target.searchParams.get("reason")).toBe("expired")
    })

    it("efface le cookie perime", () => {
        const response = middleware(request("/learn", tokenExpiringIn(-1)))

        // Un cookie efface est renvoye vide, date dans le passe : c'est ce que
        // le navigateur voit, donc c'est ce qu'on verifie.
        const cookie = response.cookies.get(SESSION_COOKIE)
        expect(cookie?.value).toBe("")
        expect(cookie?.expires && new Date(cookie.expires).getTime()).toBe(0)
    })

    it("traite un jeton expirant a la seconde meme comme expire", () => {
        expect(middleware(request("/learn", tokenExpiringIn(0))).headers.get("location")).not.toBeNull()
    })
})

describe("matcher", () => {
    // Next ancre les matchers sur le chemin entier ; une RegExp non ancree
    // repondrait « vrai » pour /api/auth/me en trouvant une correspondance
    // partielle.
    const matcher = new RegExp(`^${config.matcher[0]}$`)

    it.each(["/learn", "/simulations/aes", "/about"])("couvre %s", (path) => {
        expect(matcher.test(path)).toBe(true)
    })

    it.each(["/api/auth/me", "/_next/static/chunk.js", "/favicon.ico", "/logo.svg"])(
        "exclut %s",
        (path) => {
            expect(matcher.test(path)).toBe(false)
        },
    )
})
