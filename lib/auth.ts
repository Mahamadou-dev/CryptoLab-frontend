// Types et constantes partages par l'authentification.
//
// Le jeton emis par FastAPI ne transite JAMAIS par du code de page : les route
// handlers de `app/api/auth/` le rangent dans un cookie httpOnly du domaine du
// frontend. Une faille XSS ne peut donc pas le lire, et le navigateur le joint
// automatiquement aux appels vers `/api/auth/*`.

export const SESSION_COOKIE = "cryptolab_session"

/** Routes exigeant une session. Lues par `middleware.ts`. */
export const PROTECTED_PREFIXES = ["/learn", "/simulations"] as const

export interface User {
    id: string
    email: string
    first_name: string
    last_name: string
    country: string
    city: string
    created_at: string
}

export interface RegisterPayload {
    email: string
    password: string
    first_name: string
    last_name: string
    country: string
    city: string
}

export interface LoginPayload {
    email: string
    password: string
}

/** Erreur portant le code HTTP, pour distinguer un 409 d'un 422 cote formulaire. */
export class AuthError extends Error {
    readonly status: number

    constructor(message: string, status: number) {
        super(message)
        this.name = "AuthError"
        this.status = status
    }
}

/**
 * Traduit la reponse d'une route `/api/auth/*` en donnees ou en `AuthError`.
 */
export async function unwrap<T>(response: Response): Promise<T> {
    let body: unknown = null
    try {
        body = await response.json()
    } catch {
        // Reponse vide ou non JSON : on se rabat sur le statut.
    }

    if (!response.ok) {
        throw new AuthError(readDetail(body) ?? "Une erreur est survenue.", response.status)
    }
    return body as T
}

/**
 * Extrait un message lisible du corps d'erreur de FastAPI.
 *
 * `detail` vaut soit une chaine (erreurs metier), soit la liste d'erreurs de
 * validation de Pydantic — auquel cas afficher `[object Object]` serait inutile
 * a l'utilisateur.
 */
export function readDetail(body: unknown): string | null {
    if (!body || typeof body !== "object") return null
    const detail = (body as { detail?: unknown }).detail

    if (typeof detail === "string") return detail

    if (Array.isArray(detail)) {
        const messages = detail
            .map((item) =>
                item && typeof item === "object" && typeof (item as { msg?: unknown }).msg === "string"
                    ? ((item as { msg: string }).msg)
                    : null,
            )
            .filter((message): message is string => Boolean(message))
        if (messages.length > 0) return messages.join(" · ")
    }

    return null
}

/**
 * Date d'expiration d'un JWT, sans en verifier la signature.
 *
 * Sert uniquement au middleware, pour eviter d'afficher une page protegee avec
 * un cookie perime. La verification qui fait autorite reste celle du backend,
 * qui seul detient le secret de signature.
 */
export function readExpiry(token: string): number | null {
    const parts = token.split(".")
    if (parts.length !== 3) return null

    try {
        const padded = parts[1].replace(/-/g, "+").replace(/_/g, "/")
        const json = atob(padded.padEnd(padded.length + ((4 - (padded.length % 4)) % 4), "="))
        const exp = (JSON.parse(json) as { exp?: unknown }).exp
        return typeof exp === "number" ? exp : null
    } catch {
        return null
    }
}
