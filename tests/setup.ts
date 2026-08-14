import "@testing-library/jest-dom/vitest"

import { cleanup } from "@testing-library/react"
import { afterEach, vi } from "vitest"

// Le routeur d'App Router n'existe pas hors du serveur Next : `useRouter` y leve
// « expected app router to be mounted ». Le mock est declare ici, et non dans un
// module d'aide, parce que `vi.mock` n'est remonte que dans le fichier qui
// l'appelle — il doit preceder l'import des pages testees.
vi.mock("next/navigation", async () => {
    const { navigation } = await import("./navigation-mock")
    return navigation
})

// jsdom ne demonte pas le DOM entre deux tests : sans cela, un `getByRole` du
// test suivant trouverait deux formulaires au lieu d'un.
afterEach(() => {
    cleanup()
})
