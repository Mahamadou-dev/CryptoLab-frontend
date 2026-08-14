import { describe, expect, it } from "vitest"

import { AuthError, readDetail, readExpiry, unwrap } from "@/lib/auth"

/** Construit un JWT non signe : seule la charge utile compte ici. */
function makeToken(payload: unknown, { parts = 3 } = {}): string {
    const encode = (value: unknown) =>
        btoa(JSON.stringify(value)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
    const segments = [encode({ alg: "HS256", typ: "JWT" }), encode(payload), "signature"]
    return segments.slice(0, parts).join(".")
}

function jsonResponse(body: unknown, status = 200): Response {
    return new Response(JSON.stringify(body), {
        status,
        headers: { "content-type": "application/json" },
    })
}

describe("readDetail", () => {
    it("renvoie le message metier de FastAPI", () => {
        expect(readDetail({ detail: "Cet e-mail est deja inscrit." })).toBe("Cet e-mail est deja inscrit.")
    })

    it("assemble les messages de validation de Pydantic", () => {
        const body = {
            detail: [
                { loc: ["body", "email"], msg: "value is not a valid email address" },
                { loc: ["body", "password"], msg: "String should have at least 10 characters" },
            ],
        }
        expect(readDetail(body)).toBe(
            "value is not a valid email address · String should have at least 10 characters",
        )
    })

    it("ignore les entrees de validation sans message lisible", () => {
        expect(readDetail({ detail: [{ loc: ["body"] }, { msg: "trop court" }] })).toBe("trop court")
    })

    it.each([
        ["un corps nul", null],
        ["un corps non objet", "erreur"],
        ["un corps sans detail", { message: "erreur" }],
        ["un detail d'un type inattendu", { detail: 42 }],
        ["une liste de validation vide", { detail: [] }],
        ["une liste sans aucun msg", { detail: [{ loc: ["body"] }] }],
    ])("renvoie null pour %s", (_label, body) => {
        expect(readDetail(body)).toBeNull()
    })
})

describe("unwrap", () => {
    it("renvoie le corps d'une reponse reussie", async () => {
        const user = { id: "1", email: "etudiant@fsm.tn" }
        await expect(unwrap<typeof user>(jsonResponse(user))).resolves.toEqual(user)
    })

    it("leve une AuthError portant le code HTTP et le message du backend", async () => {
        const failing = unwrap(jsonResponse({ detail: "Identifiants invalides." }, 401))

        await expect(failing).rejects.toBeInstanceOf(AuthError)
        await expect(failing).rejects.toMatchObject({
            status: 401,
            message: "Identifiants invalides.",
            name: "AuthError",
        })
    })

    it("distingue un conflit d'inscription d'une erreur de validation", async () => {
        await expect(unwrap(jsonResponse({ detail: "deja inscrit" }, 409))).rejects.toMatchObject({
            status: 409,
        })
        await expect(unwrap(jsonResponse({ detail: [{ msg: "trop court" }] }, 422))).rejects.toMatchObject({
            status: 422,
            message: "trop court",
        })
    })

    it("se rabat sur un message generique quand le corps d'erreur est illisible", async () => {
        const response = new Response("<html>502 Bad Gateway</html>", { status: 502 })

        await expect(unwrap(response)).rejects.toMatchObject({
            status: 502,
            message: "Une erreur est survenue.",
        })
    })

    it("tolere un corps vide sur une reponse reussie", async () => {
        await expect(unwrap(new Response(null, { status: 204 }))).resolves.toBeNull()
    })
})

describe("readExpiry", () => {
    it("lit l'expiration sans verifier la signature", () => {
        expect(readExpiry(makeToken({ sub: "1", exp: 1_800_000_000 }))).toBe(1_800_000_000)
    })

    it("decode une charge utile en base64url avec bourrage manquant", () => {
        // Une charge dont la longueur base64 n'est pas un multiple de 4 : atob
        // echouerait sans le re-bourrage.
        const token = makeToken({ sub: "abc", exp: 1_700_000_000, role: "student" })
        expect(readExpiry(token)).toBe(1_700_000_000)
    })

    it.each([
        ["un jeton sans les trois segments", makeToken({ exp: 1 }, { parts: 2 })],
        ["une chaine quelconque", "pas-un-jeton"],
        ["une chaine vide", ""],
        ["une charge utile qui n'est pas du base64 valide", "a.!!!.c"],
    ])("renvoie null pour %s", (_label, token) => {
        expect(readExpiry(token)).toBeNull()
    })

    it("renvoie null quand exp est absent ou n'est pas un nombre", () => {
        expect(readExpiry(makeToken({ sub: "1" }))).toBeNull()
        expect(readExpiry(makeToken({ sub: "1", exp: "1800000000" }))).toBeNull()
    })
})
