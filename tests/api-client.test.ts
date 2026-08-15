import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { ApiError, CryptoAPIClient } from "@/lib/api-client"

/**
 * Tests du client d'API, cote enveloppe.
 *
 * Depuis la phase 2, chaque route d'algorithme repond `{ok, data, error}` et le
 * code HTTP porte la meme information que `ok`. Ce fichier verifie que le
 * client deballe correctement, et surtout qu'il *leve* sur un echec — avant, un
 * echec de dechiffrement arrivait en `200 OK` avec « Erreur: ... » dans le champ
 * resultat, et personne ne le remarquait.
 */

const BASE = "https://api.test"
const api = new CryptoAPIClient(BASE)

function respond(body: unknown, status = 200): Response {
    return new Response(JSON.stringify(body), {
        status,
        headers: { "content-type": "application/json" },
    })
}

function stub(response: Response) {
    // Les parametres sont declares pour que `mock.calls` reste type : sans eux,
    // TypeScript deduit un tuple vide et toute lecture d'argument echoue.
    const fetchMock = vi.fn(async (_url: RequestInfo | URL, _init?: RequestInit) => response)
    vi.stubGlobal("fetch", fetchMock)
    return fetchMock
}

beforeEach(() => {
    vi.clearAllMocks()
})

afterEach(() => {
    vi.unstubAllGlobals()
})

describe("deballage de l'enveloppe", () => {
    it("rend le contenu de data, pas l'enveloppe", async () => {
        stub(respond({ ok: true, data: { algorithm: "caesar", cipher: "EFG" }, error: null }))

        await expect(api.caesarEncrypt({ text: "BCD", shift: 3 })).resolves.toEqual({
            algorithm: "caesar",
            cipher: "EFG",
        })
    })

    it("envoie le corps en JSON sur la bonne URL", async () => {
        const fetchMock = stub(respond({ ok: true, data: {}, error: null }))

        await api.vigenereEncrypt({ text: "ABC", key: "KEY" })

        const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit]
        expect(url).toBe("https://api.test/api/classical/vigenere/encrypt")
        expect(init.method).toBe("POST")
        expect(JSON.parse(String(init.body))).toEqual({ text: "ABC", key: "KEY" })
    })

    it("ne produit pas de double barre oblique si l'URL de base en porte une", async () => {
        const fetchMock = stub(respond({ ok: true, data: {}, error: null }))

        await new CryptoAPIClient("https://api.test/").hashSha256({ text: "abc" })

        expect(fetchMock.mock.calls[0][0]).toBe("https://api.test/api/hash/sha256")
    })

    it("suit une reponse GET sans corps de requete", async () => {
        stub(respond({ ok: true, data: { public_key: "-----BEGIN" }, error: null }))

        await expect(api.rsaGenerateKeys()).resolves.toMatchObject({ public_key: "-----BEGIN" })
    })
})

describe("erreurs", () => {
    it("leve une ApiError portant le code metier et le statut", async () => {
        stub(
            respond(
                {
                    ok: false,
                    data: null,
                    error: {
                        code: "decryption_failed",
                        message: "Le tag d'authentification ne correspond pas.",
                        details: {},
                    },
                },
                400,
            ),
        )

        const failing = api.aesDecrypt({
            cipher_hex: "00",
            key: "mauvaise",
            nonce_hex: "00",
            tag_hex: "00",
        })

        await expect(failing).rejects.toBeInstanceOf(ApiError)
        await expect(failing).rejects.toMatchObject({
            status: 400,
            code: "decryption_failed",
            message: "Le tag d'authentification ne correspond pas.",
        })
    })

    it("conserve les details d'une erreur de validation", async () => {
        stub(
            respond(
                {
                    ok: false,
                    data: null,
                    error: {
                        code: "validation_error",
                        message: "shift : Field required",
                        details: { errors: [{ loc: ["body", "shift"] }] },
                    },
                },
                422,
            ),
        )

        await expect(api.caesarEncrypt({ text: "ABC" } as never)).rejects.toMatchObject({
            status: 422,
            code: "validation_error",
            details: { errors: [{ loc: ["body", "shift"] }] },
        })
    })

    it("leve aussi quand ok vaut false malgre un statut 200", async () => {
        // Ceinture et bretelles : si un intermediaire reecrivait le statut, le
        // client doit toujours refuser une enveloppe en echec.
        stub(respond({ ok: false, data: null, error: { code: "invalid_key", message: "Cle illisible." } }))

        await expect(
            api.rsaEncrypt({ text: "x", public_key: "pas-une-cle" }),
        ).rejects.toMatchObject({ code: "invalid_key" })
    })

    it("survit a une erreur d'infrastructure qui ignore notre format", async () => {
        // Un 502 de proxy renvoie du HTML : il n'a aucune raison de connaitre
        // l'enveloppe, et le client ne doit pas s'effondrer dessus.
        vi.stubGlobal(
            "fetch",
            vi.fn(async () => new Response("<html>502 Bad Gateway</html>", { status: 502 })),
        )

        await expect(api.caesarEncrypt({ text: "A", shift: 1 })).rejects.toMatchObject({
            status: 502,
            code: "http_error",
        })
    })
})

describe("catalogue", () => {
    it("liste les algorithmes", async () => {
        stub(
            respond({
                ok: true,
                data: { count: 10, total_vectors: 14, families: [], algorithms: [] },
                error: null,
            }),
        )

        await expect(api.listAlgorithms()).resolves.toMatchObject({ count: 10, total_vectors: 14 })
    })

    it("transmet les filtres en parametres de requete", async () => {
        const fetchMock = stub(respond({ ok: true, data: {}, error: null }))

        await api.listAlgorithms({ family: "classical", q: "cesar" })

        expect(fetchMock.mock.calls[0][0]).toBe(
            "https://api.test/api/algorithms?family=classical&q=cesar",
        )
    })

    it("omet les filtres vides plutot que d'envoyer des parametres nuls", async () => {
        const fetchMock = stub(respond({ ok: true, data: {}, error: null }))

        await api.listAlgorithms({ family: "", q: undefined })

        expect(fetchMock.mock.calls[0][0]).toBe("https://api.test/api/algorithms")
    })
})
