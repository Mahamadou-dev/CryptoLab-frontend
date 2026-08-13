/**
 * Filtre une destination de redirection venue de l'URL (`?next=`).
 *
 * Sans ce filtre, `/login?next=https://site-pirate/` transformerait la page de
 * connexion en tremplin d'hameconnage : un lien portant le domaine legitime de
 * CryptoLab renverrait l'utilisateur ailleurs juste apres l'authentification.
 * On n'accepte donc qu'un chemin interne.
 */
export function safeRedirect(target: string | null | undefined, fallback = "/simulations"): string {
    if (!target) return fallback

    // Doit commencer par un seul "/". "//evil.com" et "/\evil.com" sont
    // interpretes par les navigateurs comme des URL absolues protocol-relative.
    if (!target.startsWith("/") || target.startsWith("//") || target.startsWith("/\\")) {
        return fallback
    }

    // Un ":" avant le premier "/" trahirait un schema (javascript:, data:).
    if (/^\/[^/]*:/.test(target)) return fallback

    return target
}
