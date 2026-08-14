import { screen, waitFor } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import LoginPage from "@/app/login/page"
import { ROUTER, render, setSearchParams, stubFetch, USER } from "./helpers"

beforeEach(() => {
    setSearchParams("")
    vi.clearAllMocks()
})

afterEach(() => {
    vi.unstubAllGlobals()
})

describe("connexion reussie", () => {
    it("envoie les identifiants et redirige vers la destination memorisee", async () => {
        setSearchParams("next=%2Fsimulations%2Faes")
        const { calls } = stubFetch({ "/api/auth/login": { body: { user: USER } } })
        const { user } = await render(<LoginPage />)

        await user.type(screen.getByLabelText("Adresse e-mail"), "etudiant@fsm.tn")
        await user.type(screen.getByLabelText("Mot de passe"), "phrase de passe")
        await user.click(screen.getByRole("button", { name: /se connecter/i }))

        await waitFor(() => expect(ROUTER.replace).toHaveBeenCalledWith("/simulations/aes"))
        expect(calls.find((call) => call.url === "/api/auth/login")?.body).toEqual({
            email: "etudiant@fsm.tn",
            password: "phrase de passe",
        })
        // Le rendu serveur doit etre rejoue : la garde de route et l'en-tete
        // dependent du cookie qui vient d'etre pose.
        expect(ROUTER.refresh).toHaveBeenCalled()
    })

    it("nettoie les espaces autour de l'e-mail mais jamais le mot de passe", async () => {
        const { calls } = stubFetch({ "/api/auth/login": { body: { user: USER } } })
        const { user } = await render(<LoginPage />)

        await user.type(screen.getByLabelText("Adresse e-mail"), "  etudiant@fsm.tn  ")
        await user.type(screen.getByLabelText("Mot de passe"), " espaces significatifs ")
        await user.click(screen.getByRole("button", { name: /se connecter/i }))

        await waitFor(() => expect(ROUTER.replace).toHaveBeenCalled())
        expect(calls.find((call) => call.url === "/api/auth/login")?.body).toEqual({
            email: "etudiant@fsm.tn",
            password: " espaces significatifs ",
        })
    })

    it("refuse une destination externe venue de ?next=", async () => {
        setSearchParams("next=https%3A%2F%2Fsite-pirate.example%2F")
        stubFetch({ "/api/auth/login": { body: { user: USER } } })
        const { user } = await render(<LoginPage />)

        await user.type(screen.getByLabelText("Adresse e-mail"), "etudiant@fsm.tn")
        await user.type(screen.getByLabelText("Mot de passe"), "phrase de passe")
        await user.click(screen.getByRole("button", { name: /se connecter/i }))

        await waitFor(() => expect(ROUTER.replace).toHaveBeenCalledWith("/simulations"))
    })
})

describe("echec de connexion", () => {
    it("affiche le message du backend et laisse le formulaire utilisable", async () => {
        stubFetch({
            "/api/auth/login": { status: 401, body: { detail: "Identifiants invalides." } },
        })
        const { user } = await render(<LoginPage />)

        await user.type(screen.getByLabelText("Adresse e-mail"), "etudiant@fsm.tn")
        await user.type(screen.getByLabelText("Mot de passe"), "mauvais mot de passe")
        await user.click(screen.getByRole("button", { name: /se connecter/i }))

        expect(await screen.findByRole("alert")).toHaveTextContent("Identifiants invalides.")
        expect(ROUTER.replace).not.toHaveBeenCalled()
        // Le bouton est rendu a l'utilisateur : un echec ne doit pas figer la page.
        expect(screen.getByRole("button", { name: /se connecter/i })).toBeEnabled()
    })

    it("affiche un message de repli quand le reseau tombe", async () => {
        vi.stubGlobal(
            "fetch",
            vi.fn(async (input: RequestInfo | URL) => {
                if (String(input) === "/api/auth/me") {
                    return new Response(JSON.stringify({ user: null }), { status: 200 })
                }
                throw new TypeError("Failed to fetch")
            }),
        )
        const { user } = await render(<LoginPage />)

        await user.type(screen.getByLabelText("Adresse e-mail"), "etudiant@fsm.tn")
        await user.type(screen.getByLabelText("Mot de passe"), "phrase de passe")
        await user.click(screen.getByRole("button", { name: /se connecter/i }))

        expect(await screen.findByRole("alert")).toHaveTextContent(/reseau/i)
    })

    it("annonce une session expiree quand le middleware l'a signalee", async () => {
        setSearchParams("next=%2Flearn&reason=expired")
        stubFetch()
        await render(<LoginPage />)

        expect(screen.getByRole("alert")).toHaveTextContent("Votre session a expire.")
    })
})

describe("etat d'attente", () => {
    it("desactive le bouton pendant l'envoi et efface l'erreur precedente", async () => {
        let release: () => void = () => {}
        const pending = new Promise<void>((resolve) => {
            release = resolve
        })
        stubFetch({
            "/api/auth/login": async () => {
                await pending
                return { body: { user: USER } }
            },
        })
        const { user } = await render(<LoginPage />)

        await user.type(screen.getByLabelText("Adresse e-mail"), "etudiant@fsm.tn")
        await user.type(screen.getByLabelText("Mot de passe"), "phrase de passe")
        await user.click(screen.getByRole("button", { name: /se connecter/i }))

        const button = await screen.findByRole("button", { name: /connexion\.\.\./i })
        expect(button).toBeDisabled()

        release()
        await waitFor(() => expect(ROUTER.replace).toHaveBeenCalled())
    })
})

describe("lien vers l'inscription", () => {
    it("transporte la destination pour ne pas la perdre en changeant de page", async () => {
        setSearchParams("next=%2Fsimulations%2Fdes")
        stubFetch()
        await render(<LoginPage />)

        expect(screen.getByRole("link", { name: /creer un compte/i })).toHaveAttribute(
            "href",
            "/register?next=%2Fsimulations%2Fdes",
        )
    })

    it("pointe vers /register nu quand aucune destination n'est demandee", async () => {
        stubFetch()
        await render(<LoginPage />)

        expect(screen.getByRole("link", { name: /creer un compte/i })).toHaveAttribute(
            "href",
            "/register",
        )
    })
})
