import react from "@vitejs/plugin-react"
import tsconfigPaths from "vite-tsconfig-paths"
import { defineConfig } from "vitest/config"

/**
 * Configuration des tests frontend.
 *
 * Le seuil de couverture est volontairement bas au demarrage : il ne mesure que
 * les fichiers reellement couverts (`lib/` et `middleware.ts`), pas les 107 Ko
 * de contenu i18n ni les composants anterieurs a la v2. Il est releve a chaque
 * sprint, comme une cliquet : il ne redescend jamais.
 */
export default defineConfig({
    plugins: [tsconfigPaths(), react()],
    test: {
        environment: "jsdom",
        globals: true,
        setupFiles: ["./tests/setup.ts"],
        include: ["tests/**/*.test.{ts,tsx}"],
        coverage: {
            provider: "v8",
            reporter: ["text", "lcov"],
            include: ["lib/auth.ts", "lib/safe-redirect.ts", "middleware.ts", "app/api/auth/**/*.ts"],
            // Cette surface est couverte a 100 %. Le seuil est pose a 95 : il
            // laisse passer une ligne defensive difficile a atteindre, mais
            // interdit d'ajouter du code d'authentification non teste. Il monte
            // avec le perimetre a chaque sprint, il ne redescend jamais.
            thresholds: {
                statements: 95,
                branches: 95,
                functions: 95,
                lines: 95,
            },
        },
    },
})
