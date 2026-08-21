import next from "eslint-config-next"

/**
 * Configuration ESLint (format « flat », ESLint 9).
 *
 * Un seul niveau d'exigence, pour tout le depot. Avant la v2, le code
 * anterieur declenchait environ 180 avertissements sur sept regles — imports
 * oublies, `any`, `setState` synchrone en effet — et elles etaient
 * temporairement ramenees a « avertissement » hors du code neuf pour ne pas
 * melanger un nettoyage massif aux changements en cours. Ce gel a servi son
 * usage (phase 2 de la feuille de route) : la dette est resorbee, ces regles
 * sont desormais bloquantes partout, sans exception de chemin.
 */

const STRICT_RULES = {
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
    ],
    "react/no-unescaped-entities": "error",
    "react-hooks/set-state-in-effect": "error",
    "react-hooks/purity": "error",
    "react-hooks/refs": "error",
    "react-hooks/immutability": "error",
}

const config = [
    {
        ignores: [
            ".next/**",
            "node_modules/**",
            "next-env.d.ts",
            // Rapport genere par Vitest : jamais ecrit a la main, jamais linte.
            "coverage/**",
            // Composants shadcn generes : ils suivent les conventions de leur
            // generateur et sont remplaces par regeneration, pas a la main.
            "components/ui/**",
        ],
    },

    ...next,

    {
        files: ["**/*.{ts,tsx}"],
        rules: STRICT_RULES,
    },
]

export default config
