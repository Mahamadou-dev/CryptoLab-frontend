import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { SESSION_COOKIE } from "@/lib/auth"

/**
 * Tests des route handlers `app/api/auth/*`.
 *
 * C'est la charniere de securite du frontend : le jeton emis par FastAPI y entre
 * en clair et doit en ressortir uniquement sous forme de cookie `httpOnly`. Ce
 * qu'on verifie ici, avant tout : que le jeton ne se retrouve jamais dans le
 * corps de la reponse, lisible par un script injecte.
 */

// `next/headers` n'existe qu'a l'interieur d'une requete Next.
const cookieStore = new Map<string, string>()
vi.mock("next/headers", () => ({
    cookies: async () => ({
        get: (name: string) =>
            cookieStore.has(name) ? { name, value: cookieStore.get(name) } : undefined,
    }),
}))

// `server-only` leve a l'import hors contexte serveur.
vi.mock("server-only", () => ({}))

const TOKEN = "jeton.tres.secret"
const BACKEND_USER = { id: "u1", email: "amina@fsm.tn", first_name: "Amina" }

/** Reponse type de FastAPI apres une authentification reussie. */
const AUTH_OK = {
    access_token: TOKEN,
    token_type: "bearer",
    expires_in: 3600,
    user: BACKEND_USER,
}

function jsonRequest(body: unknown): Request {
    return new Request("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
    })
}

/** Le `Set-Cookie` de session porte par une reponse. */
function sessionCookie(response: Response): string | undefined {
    return response.headers
        .getSetCookie()
        .find((cookie) => cookie.startsWith(`${SESSION_COOKIE}=`))
}

function stubBackend(status: number, body: unknown) {
    const fetchMock = vi.fn(
        async (_url: RequestInfo | URL, _init?: RequestInit) =>
            new Response(JSON.stringify(body), {
                status,
                headers: { "content-type": "application/json" },
            }),
    )
    vi.stubGlobal("fetch", fetchMock)
    return fetchMock
}

beforeEach(() => {
    cookieStore.clear()
    vi.resetModules()
    vi.clearAllMocks()
})

afterEach(() => {
    vi.unstubAllGlobals()
})

describe.each([
    ["login", 200] as const,
    ["register", 201] as const,
])("POST /api/auth/%s", (route, successStatus) => {
    async function handler() {
        return (await import(`@/app/api/auth/${route}/route`)).POST
    }

    it("echange le jeton contre un cookie httpOnly et ne le renvoie pas au client", async () => {
        stubBackend(200, AUTH_OK)
        const response = await (await handler())(jsonRequest({ email: "amina@fsm.tn" }))
        const body = await response.clone().text()

        expect(response.status).toBe(successStatus)
        expect(JSON.parse(body)).toEqual({ user: BACKEND_USER })
        // L'assertion centrale de tout le module.
        expect(body).not.toContain(TOKEN)

        const cookie = sessionCookie(response)
        expect(cookie).toContain(`${SESSION_COOKIE}=${TOKEN}`)
        expect(cookie).toContain("HttpOnly")
        expect(cookie).toContain("SameSite=lax")
        expect(cookie).toContain("Path=/")
        expect(cookie).toContain("Max-Age=3600")
    })

    it("relaie l'erreur du backend avec son code, sans poser de cookie", async () => {
        stubBackend(409, { detail: "Cet e-mail est deja inscrit." })
        const response = await (await handler())(jsonRequest({ email: "amina@fsm.tn" }))

        expect(response.status).toBe(409)
        await expect(response.json()).resolves.toEqual({ detail: "Cet e-mail est deja inscrit." })
        expect(sessionCookie(response)).toBeUndefined()
    })

    it("aplatit les erreurs de validation de Pydantic en un message lisible", async () => {
        stubBackend(422, { detail: [{ msg: "String should have at least 10 characters" }] })
        const response = await (await handler())(jsonRequest({ email: "amina@fsm.tn" }))

        expect(response.status).toBe(422)
        await expect(response.json()).resolves.toEqual({
            detail: "String should have at least 10 characters",
        })
    })

    it("ne laisse pas fuiter le detail d'une panne backend", async () => {
        stubBackend(500, "<html>Internal Server Error at /srv/app/auth/service.py</html>")
        const response = await (await handler())(jsonRequest({ email: "amina@fsm.tn" }))
        const body = await response.text()

        expect(response.status).toBe(500)
        expect(body).not.toContain("service.py")
        expect(body).toContain("indisponible")
    })

    it("refuse un corps qui n'est pas du JSON, sans appeler le backend", async () => {
        const fetchMock = stubBackend(200, AUTH_OK)
        const request = new Request("http://localhost:3000/api/auth/login", {
            method: "POST",
            body: "pas du json",
        })

        const response = await (await handler())(request)

        expect(response.status).toBe(400)
        expect(fetchMock).not.toHaveBeenCalled()
    })
})

describe("GET /api/auth/me", () => {
    async function handler() {
        return (await import("@/app/api/auth/me/route")).GET
    }

    it("repond « pas de session » sans cookie, sans appeler le backend", async () => {
        const fetchMock = stubBackend(200, BACKEND_USER)
        const response = await (await handler())()

        expect(response.status).toBe(200)
        await expect(response.json()).resolves.toEqual({ user: null })
        expect(fetchMock).not.toHaveBeenCalled()
    })

    it("presente le jeton en Bearer et renvoie le profil", async () => {
        cookieStore.set(SESSION_COOKIE, TOKEN)
        const fetchMock = stubBackend(200, BACKEND_USER)

        const response = await (await handler())()

        await expect(response.json()).resolves.toEqual({ user: BACKEND_USER })
        expect(fetchMock.mock.calls[0][1]).toMatchObject({
            headers: expect.objectContaining({ Authorization: `Bearer ${TOKEN}` }),
            // Une session servie depuis un cache serait une session partagee.
            cache: "no-store",
        })
    })

    it("efface un cookie rejete par le backend", async () => {
        cookieStore.set(SESSION_COOKIE, "jeton.forge")
        stubBackend(401, { detail: "Jeton invalide." })

        const response = await (await handler())()

        expect(response.status).toBe(200)
        await expect(response.json()).resolves.toEqual({ user: null })
        expect(sessionCookie(response)).toContain("Max-Age=0")
    })

    it("garde la session quand l'API est injoignable", async () => {
        cookieStore.set(SESSION_COOKIE, TOKEN)
        vi.stubGlobal(
            "fetch",
            vi.fn(async () => {
                throw new TypeError("fetch failed")
            }),
        )

        const response = await (await handler())()

        // 503 : c'est le service qui est en panne, pas la session de l'etudiant.
        expect(response.status).toBe(503)
        expect(sessionCookie(response)).toBeUndefined()
    })

    it("ne detruit pas la session sur une erreur backend autre qu'un 401", async () => {
        cookieStore.set(SESSION_COOKIE, TOKEN)
        stubBackend(500, { detail: "Panne." })

        const response = await (await handler())()

        expect(response.status).toBe(200)
        await expect(response.json()).resolves.toEqual({ user: null })
        expect(sessionCookie(response)).toBeUndefined()
    })
})

describe("POST /api/auth/logout", () => {
    it("efface le cookie sans rien demander au backend", async () => {
        const fetchMock = stubBackend(200, {})
        const { POST } = await import("@/app/api/auth/logout/route")

        const response = await POST()

        expect(response.status).toBe(200)
        expect(fetchMock).not.toHaveBeenCalled()

        const cookie = sessionCookie(response)
        expect(cookie).toContain("Max-Age=0")
        // Le cookie de remplacement doit rester httpOnly : sinon un script
        // pourrait ecrire par-dessus.
        expect(cookie).toContain("HttpOnly")
    })
})
