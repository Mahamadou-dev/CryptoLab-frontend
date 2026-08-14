import { act, render as rtlRender } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { vi } from "vitest"

import { AuthProvider } from "@/lib/auth-context"
import type { User } from "@/lib/auth"

/**
 * Outils partages par les tests de formulaire.
 *
 * Les pages sont rendues dans le vrai `AuthProvider` — seul `fetch` est
 * remplace. On teste ainsi la chaine reelle formulaire → contexte → `unwrap`,
 * et pas une imitation du contexte qui pourrait diverger de lui.
 */

export { ROUTER, resetNavigation, setPathname, setSearchParams } from "./navigation-mock"

export const USER: User = {
    id: "u1",
    email: "etudiant@fsm.tn",
    first_name: "Amina",
    last_name: "Ben Salah",
    country: "Tunisie",
    city: "Monastir",
    created_at: "2026-08-14T10:00:00Z",
}

interface RouteStub {
    status?: number
    body?: unknown
}

/**
 * Remplace `fetch` par une table de routes.
 *
 * `/api/auth/me` repond « pas de session » par defaut : c'est l'etat dans lequel
 * un visiteur atteint la page de connexion.
 */
export function stubFetch(routes: Record<string, RouteStub | (() => Promise<RouteStub>)> = {}) {
    const calls: { url: string; body: unknown }[] = []

    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
        const url = String(input)
        calls.push({ url, body: init?.body ? JSON.parse(String(init.body)) : undefined })

        const route = routes[url] ?? (url === "/api/auth/me" ? { body: { user: null } } : undefined)
        if (!route) throw new Error(`Route non simulee : ${url}`)

        const { status = 200, body = null } = typeof route === "function" ? await route() : route
        return new Response(JSON.stringify(body), {
            status,
            headers: { "content-type": "application/json" },
        })
    })

    vi.stubGlobal("fetch", fetchMock)
    return { calls, fetchMock }
}

/**
 * Monte `ui` dans le vrai `AuthProvider`, puis attend que la verification de
 * session (`GET /api/auth/me`, lancee au montage) soit retombee. Sans cette
 * attente, chaque test declencherait un avertissement `act(...)` pour une mise
 * a jour d'etat arrivee apres son assertion.
 */
export async function render(ui: React.ReactElement) {
    const result = rtlRender(<AuthProvider>{ui}</AuthProvider>)
    await act(async () => {})

    return {
        // `delay: null` supprime l'attente de 1 ms entre deux frappes : elle
        // n'apporte rien ici et coutait plusieurs secondes par test.
        user: userEvent.setup({ delay: null }),
        ...result,
    }
}
