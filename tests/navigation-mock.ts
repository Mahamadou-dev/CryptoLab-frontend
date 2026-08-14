import { vi } from "vitest"

/**
 * Etat du routeur Next simule, partage entre le fichier de setup (qui declare
 * le mock) et les tests (qui l'inspectent).
 *
 * Le mock lui-meme vit dans `tests/setup.ts` : `vi.mock` n'est remonte que dans
 * le fichier qui l'appelle, et il doit s'appliquer avant que les pages
 * n'importent `next/navigation`.
 */

export const ROUTER = {
    replace: vi.fn(),
    refresh: vi.fn(),
    push: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    prefetch: vi.fn(),
}

let searchParams = new URLSearchParams()
let pathname = "/"

export function setSearchParams(query: string) {
    searchParams = new URLSearchParams(query)
}

export function setPathname(value: string) {
    pathname = value
}

export function resetNavigation() {
    searchParams = new URLSearchParams()
    pathname = "/"
}

export const navigation = {
    useRouter: () => ROUTER,
    useSearchParams: () => searchParams,
    usePathname: () => pathname,
}
