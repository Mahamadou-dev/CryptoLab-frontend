import { fireEvent, screen, waitFor } from "@testing-library/react"
import type { UserEvent } from "@testing-library/user-event"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import RegisterPage from "@/app/register/page"
import { ROUTER, render, setSearchParams, stubFetch, USER } from "./helpers"

const VALID = {
    Prenom: "Amina",
    Nom: "Ben Salah",
    "Adresse e-mail": "amina@fsm.tn",
    Pays: "Tunisie",
    Ville: "Monastir",
    "Mot de passe": "phrase de passe longue",
    "Confirmer le mot de passe": "phrase de passe longue",
}

/**
 * Remplit le formulaire avec des valeurs valides, sauf celles surchargees.
 *
 * Chaque champ recoit sa valeur en un seul evenement plutot qu'en une frappe
 * par caractere : un formulaire de sept champs re-rendu a chaque touche rendait
 * la suite dix fois plus lente pour la meme assertion. Les tests ou la frappe
 * elle-meme est le sujet — l'effacement d'une erreur en cours de saisie —
 * utilisent bien `user.type`.
 */
function fill(overrides: Partial<Record<keyof typeof VALID, string>> = {}) {
    for (const [label, value] of Object.entries({ ...VALID, ...overrides })) {
        fireEvent.change(screen.getByLabelText(label), { target: { value } })
    }
}

function submit(user: UserEvent) {
    return user.click(screen.getByRole("button", { name: /creer mon compte/i }))
}

beforeEach(() => {
    setSearchParams("")
    vi.clearAllMocks()
})

afterEach(() => {
    vi.unstubAllGlobals()
})

describe("inscription reussie", () => {
    it("envoie le formulaire nettoye et emmene l'etudiant vers le cours", async () => {
        const { calls } = stubFetch({ "/api/auth/register": { body: { user: USER } } })
        const { user } = await render(<RegisterPage />)

        fill({ Prenom: "  Amina  ", "Adresse e-mail": "  amina@fsm.tn " })
        await submit(user)

        await waitFor(() => expect(ROUTER.replace).toHaveBeenCalledWith("/learn"))
        expect(calls.find((call) => call.url === "/api/auth/register")?.body).toEqual({
            email: "amina@fsm.tn",
            password: "phrase de passe longue",
            first_name: "Amina",
            last_name: "Ben Salah",
            country: "Tunisie",
            city: "Monastir",
        })
        // `confirm` est une verification d'interface : il n'a rien a faire sur
        // le reseau.
        expect(calls.find((call) => call.url === "/api/auth/register")?.body).not.toHaveProperty(
            "confirm",
        )
    })

    it("honore la destination demandee, mais seulement si elle est interne", async () => {
        setSearchParams("next=%2Fsimulations%2Faes")
        stubFetch({ "/api/auth/register": { body: { user: USER } } })
        const { user } = await render(<RegisterPage />)

        fill()
        await submit(user)

        await waitFor(() => expect(ROUTER.replace).toHaveBeenCalledWith("/simulations/aes"))
    })

    it("retombe sur /learn quand ?next= vise l'exterieur", async () => {
        setSearchParams("next=%2F%2Fsite-pirate.example%2F")
        stubFetch({ "/api/auth/register": { body: { user: USER } } })
        const { user } = await render(<RegisterPage />)

        fill()
        await submit(user)

        await waitFor(() => expect(ROUTER.replace).toHaveBeenCalledWith("/learn"))
    })
})

describe("validation locale", () => {
    it.each([
        ["Prenom", { Prenom: "" }, "Prenom requis."],
        ["Prenom rempli d'espaces", { Prenom: "   " }, "Prenom requis."],
        ["Nom", { Nom: "" }, "Nom requis."],
        ["e-mail sans arobase", { "Adresse e-mail": "amina.fsm.tn" }, "Adresse e-mail invalide."],
        ["Pays trop court", { Pays: "T" }, "Pays requis."],
        ["Ville", { Ville: "" }, "Ville requise."],
        [
            "mot de passe trop court",
            { "Mot de passe": "court", "Confirmer le mot de passe": "court" },
            "Au moins 10 caracteres.",
        ],
        [
            "confirmation differente",
            { "Confirmer le mot de passe": "une autre phrase" },
            "Les mots de passe different.",
        ],
    ])("refuse un %s sans appeler le reseau", async (_label, overrides, message) => {
        const { calls } = stubFetch()
        const { user } = await render(<RegisterPage />)

        fill(overrides)
        await submit(user)

        expect(await screen.findByText(message)).toBeInTheDocument()
        expect(calls.some((call) => call.url === "/api/auth/register")).toBe(false)
    })

    it("refuse un mot de passe depassant la limite de 72 octets de bcrypt", async () => {
        // 30 caracteres accentues = 60 octets en UTF-8 ; 40 en font 80. La limite
        // est en octets, pas en caracteres : c'est tout l'interet du cas.
        const tooLong = "é".repeat(40)
        const { calls } = stubFetch()
        const { user } = await render(<RegisterPage />)

        fill({ "Mot de passe": tooLong, "Confirmer le mot de passe": tooLong })
        await submit(user)

        expect(await screen.findByText(/72 octets maximum/)).toBeInTheDocument()
        expect(calls.some((call) => call.url === "/api/auth/register")).toBe(false)
    })

    it("accepte un mot de passe long en caracteres mais court en octets", async () => {
        const ok = "a".repeat(70)
        stubFetch({ "/api/auth/register": { body: { user: USER } } })
        const { user } = await render(<RegisterPage />)

        fill({ "Mot de passe": ok, "Confirmer le mot de passe": ok })
        await submit(user)

        await waitFor(() => expect(ROUTER.replace).toHaveBeenCalled())
    })

    it("lie l'erreur au champ pour le lecteur d'ecran", async () => {
        stubFetch()
        const { user } = await render(<RegisterPage />)

        fill({ Ville: "" })
        await submit(user)

        const city = await screen.findByLabelText("Ville")
        expect(city).toHaveAttribute("aria-invalid", "true")
        expect(city).toHaveAccessibleDescription("Ville requise.")
    })

    it("efface l'erreur d'un champ des qu'il est corrige", async () => {
        stubFetch()
        const { user } = await render(<RegisterPage />)

        fill({ Ville: "" })
        await submit(user)
        expect(await screen.findByText("Ville requise.")).toBeInTheDocument()

        await user.type(screen.getByLabelText("Ville"), "Sousse")

        await waitFor(() => expect(screen.queryByText("Ville requise.")).not.toBeInTheDocument())
    })
})

describe("erreurs venues du backend", () => {
    it("place un 409 sur le champ e-mail, la ou l'etudiant doit agir", async () => {
        stubFetch({
            "/api/auth/register": { status: 409, body: { detail: "Cet e-mail est deja inscrit." } },
        })
        const { user } = await render(<RegisterPage />)

        fill()
        await submit(user)

        expect(await screen.findByText("Un compte existe deja pour cette adresse.")).toBeInTheDocument()
        expect(screen.getByLabelText("Adresse e-mail")).toHaveAttribute("aria-invalid", "true")
        // Un conflit d'e-mail n'est pas une panne : pas de banniere globale.
        expect(screen.queryByRole("alert")).not.toBeInTheDocument()
        expect(ROUTER.replace).not.toHaveBeenCalled()
    })

    it("affiche les messages de validation de Pydantic en banniere", async () => {
        stubFetch({
            "/api/auth/register": {
                status: 422,
                body: { detail: [{ msg: "value is not a valid email address" }] },
            },
        })
        const { user } = await render(<RegisterPage />)

        fill()
        await submit(user)

        expect(await screen.findByRole("alert")).toHaveTextContent("value is not a valid email address")
    })

    it("rend le bouton apres un echec", async () => {
        stubFetch({ "/api/auth/register": { status: 500, body: { detail: "Panne serveur." } } })
        const { user } = await render(<RegisterPage />)

        fill()
        await submit(user)

        await screen.findByRole("alert")
        expect(screen.getByRole("button", { name: /creer mon compte/i })).toBeEnabled()
    })
})
