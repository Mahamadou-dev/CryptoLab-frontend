import next from "eslint-config-next"

/**
 * Configuration ESLint (format « flat », ESLint 9).
 *
 * Deux niveaux d'exigence, assumes :
 *
 * 1. Sur l'ensemble du depot, les regles heritees de `eslint-config-next`
 *    signalent sans bloquer. Le code anterieur a la v2 en declenche environ 180,
 *    en majorite des imports oublies et des `setState` en effet ; les corriger
 *    en bloc melangerait un nettoyage massif aux changements en cours.
 * 2. Sur le code ecrit pour la v2, les memes regles sont bloquantes. La dette
 *    existante est donc gelee : elle ne peut plus grandir.
 *
 * Le nettoyage du code anterieur est inscrit en phase 2 de la feuille de route.
 */

/** Code ecrit pour la v2 : tenu au niveau strict. */
const V2_PATHS = [
    // Uniquement des fichiers TypeScript : les regles listees plus bas viennent
    // du plugin @typescript-eslint, qui n'est charge que pour eux.
    "middleware.ts",
    "app/api/auth/**/*.ts",
    "app/login/**/*.tsx",
    "app/register/**/*.tsx",
    "components/auth/**/*.tsx",
    "components/landing/**/*.tsx",
    "components/3d/landing/**/*.{ts,tsx}",
    "lib/auth.ts",
    "lib/auth-server.ts",
    "lib/auth-context.tsx",
    "lib/safe-redirect.ts",
]

/** Regles ramenees a « avertissement » sur le code anterieur a la v2. */
const LEGACY_DOWNGRADE = {
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-unused-vars": "warn",
    "react/no-unescaped-entities": "warn",
    "react-hooks/set-state-in-effect": "warn",
    "react-hooks/purity": "warn",
    "react-hooks/refs": "warn",
    "react-hooks/immutability": "warn",
}

export default [
    {
        ignores: [
            ".next/**",
            "node_modules/**",
            "next-env.d.ts",
            // Composants shadcn generes : ils suivent les conventions de leur
            // generateur et sont remplaces par regeneration, pas a la main.
            "components/ui/**",
        ],
    },

    ...next,

    {
        files: ["**/*.{ts,tsx}"],
        rules: LEGACY_DOWNGRADE,
    },

    {
        files: V2_PATHS,
        rules: {
            ...Object.fromEntries(Object.keys(LEGACY_DOWNGRADE).map((rule) => [rule, "error"])),
            "@typescript-eslint/no-unused-vars": [
                "error",
                { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
            ],
            // Un `any` dans du code d'authentification n'a aucune excuse.
            "@typescript-eslint/no-explicit-any": "error",
        },
    },
]
