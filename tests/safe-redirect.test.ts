import { describe, expect, it } from "vitest"

import { safeRedirect } from "@/lib/safe-redirect"

/**
 * `safeRedirect` est une defense contre la redirection ouverte. Une defense qui
 * n'est pas prouvee n'en est pas une : chaque cas ci-dessous est une charge
 * d'attaque reelle, pas un cas de figure theorique.
 */
describe("safeRedirect", () => {
    describe("accepte les chemins internes", () => {
        it.each([
            "/simulations",
            "/learn/aes",
            "/learn/aes?step=3",
            "/simulations/des#trace",
            "/",
            // Un ":" apres le premier segment n'est pas un schema : c'est un
            // caractere de chemin parfaitement legitime.
            "/learn/a:b",
        ])("laisse passer %s", (target) => {
            expect(safeRedirect(target)).toBe(target)
        })
    })

    describe("rejette les destinations externes", () => {
        it.each([
            ["une URL absolue", "https://site-pirate.example/"],
            ["une URL absolue en http", "http://site-pirate.example/"],
            // Le navigateur lit "//host" comme une URL absolue heritant du
            // protocole courant : c'est la contournement classique du controle
            // "doit commencer par /".
            ["une URL protocol-relative", "//site-pirate.example/"],
            // Certains navigateurs normalisent "\" en "/" : "/\evil.com" devient
            // donc "//evil.com".
            ["une barre inversee", "/\\site-pirate.example/"],
            ["un schema javascript", "javascript:alert(1)"],
            ["un schema data", "data:text/html,<script>alert(1)</script>"],
            ["un schema deguise en chemin", "/javascript:alert(1)"],
            ["un chemin relatif", "learn/aes"],
            ["une chaine vide", ""],
        ])("rejette %s", (_label, target) => {
            expect(safeRedirect(target)).toBe("/simulations")
        })
    })

    it("retombe sur la valeur par defaut quand la cible est absente", () => {
        expect(safeRedirect(null)).toBe("/simulations")
        expect(safeRedirect(undefined)).toBe("/simulations")
    })

    it("honore une valeur de repli personnalisee", () => {
        expect(safeRedirect(null, "/learn")).toBe("/learn")
        expect(safeRedirect("https://site-pirate.example/", "/learn")).toBe("/learn")
    })
})
