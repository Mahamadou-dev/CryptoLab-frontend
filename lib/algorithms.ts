// Fichier : lib/algorithms.ts

export type AlgorithmType = "classic" | "symmetric" | "asymmetric" | "hash"
export type Difficulty = "difficulty.beginner" | "difficulty.intermediate" | "difficulty.advanced"

export interface Algorithm {
    id: string
    name: string // Clé i18n
    description: string // Clé i18n
    difficulty: Difficulty // Clé i18n
    icon: string
    category: AlgorithmType
    uses: string // Clé i18n (formaté avec des '|' dans i18n.ts)
    keySize?: string
    blockSize?: string
}

export const algorithms: Algorithm[] = [
    {
        id: "caesar",
        name: "algo.caesar.name",
        description: "algo.caesar.description",
        difficulty: "difficulty.beginner",
        icon: "🔤",
        category: "classic",
        uses: "algo.caesar.uses",
    },
    {
        id: "vigenere",
        name: "algo.vigenere.name",
        description: "algo.vigenere.description",
        difficulty: "difficulty.intermediate",
        icon: "🔑",
        category: "classic",
        uses: "algo.vigenere.uses",
    },
    {
        id: "playfair",
        name: "algo.playfair.name",
        description: "algo.playfair.description",
        difficulty: "difficulty.intermediate",
        icon: "⊞",
        category: "classic",
        uses: "algo.playfair.uses",
    },
    {
        id: "railfence",
        name: "algo.railfence.name",
        description: "algo.railfence.description",
        difficulty: "difficulty.beginner",
        icon: "🛤️",
        category: "classic",
        uses: "algo.railfence.uses",
    },
    {
        id: "des",
        name: "algo.des.name",
        description: "algo.des.description",
        difficulty: "difficulty.advanced",
        icon: "🔐",
        category: "symmetric",
        uses: "algo.des.uses",
        keySize: "56 bits",
        blockSize: "64 bits",
    },
    {
        id: "aes",
        name: "algo.aes.name",
        description: "algo.aes.description",
        difficulty: "difficulty.advanced",
        icon: "🛡️",
        category: "symmetric",
        uses: "algo.aes.uses",
        keySize: "128, 192, 256 bits",
        blockSize: "128 bits",
    },
    {
        id: "rsa",
        name: "algo.rsa.name",
        description: "algo.rsa.description",
        difficulty: "difficulty.advanced",
        icon: "🔓",
        category: "asymmetric",
        uses: "algo.rsa.uses",
        keySize: "1024-4096 bits",
    },
    {
        id: "sha256",
        name: "algo.sha256.name",
        description: "algo.sha256.description",
        difficulty: "difficulty.intermediate",
        icon: "#️⃣",
        category: "hash",
        uses: "algo.sha256.uses",
    },
    {
        id: "bcrypt",
        name: "algo.bcrypt.name",
        description: "algo.bcrypt.description",
        difficulty: "difficulty.intermediate",
        icon: "🔒",
        category: "hash",
        uses: "algo.bcrypt.uses",
    },
    // Sprint 6 — clef publique. Formulaire generique pilote par le schema
    // JSON du catalogue (`SimulatorGenericAsymmetric`), pas de composant
    // dedie ecrit a la main pour chacun.
    {
        id: "rsasmall",
        name: "algo.rsasmall.name",
        description: "algo.rsasmall.description",
        difficulty: "difficulty.intermediate",
        icon: "🔢",
        category: "asymmetric",
        uses: "algo.rsasmall.uses",
    },
    {
        id: "rsasignature",
        name: "algo.rsasignature.name",
        description: "algo.rsasignature.description",
        difficulty: "difficulty.advanced",
        icon: "✍️",
        category: "asymmetric",
        uses: "algo.rsasignature.uses",
    },
    {
        id: "diffiehellman",
        name: "algo.diffiehellman.name",
        description: "algo.diffiehellman.description",
        difficulty: "difficulty.intermediate",
        icon: "🤝",
        category: "asymmetric",
        uses: "algo.diffiehellman.uses",
    },
    {
        id: "ecdh",
        name: "algo.ecdh.name",
        description: "algo.ecdh.description",
        difficulty: "difficulty.advanced",
        icon: "🌐",
        category: "asymmetric",
        uses: "algo.ecdh.uses",
    },
    {
        id: "ecc",
        name: "algo.ecc.name",
        description: "algo.ecc.description",
        difficulty: "difficulty.advanced",
        icon: "📈",
        category: "asymmetric",
        uses: "algo.ecc.uses",
    },
    {
        id: "ecdsa",
        name: "algo.ecdsa.name",
        description: "algo.ecdsa.description",
        difficulty: "difficulty.advanced",
        icon: "✒️",
        category: "asymmetric",
        uses: "algo.ecdsa.uses",
    },
    {
        id: "ed25519",
        name: "algo.ed25519.name",
        description: "algo.ed25519.description",
        difficulty: "difficulty.advanced",
        icon: "🖋️",
        category: "asymmetric",
        uses: "algo.ed25519.uses",
    },
    {
        id: "dsa",
        name: "algo.dsa.name",
        description: "algo.dsa.description",
        difficulty: "difficulty.advanced",
        icon: "📜",
        category: "asymmetric",
        uses: "algo.dsa.uses",
    },
    {
        id: "elgamal",
        name: "algo.elgamal.name",
        description: "algo.elgamal.description",
        difficulty: "difficulty.intermediate",
        icon: "🗝️",
        category: "asymmetric",
        uses: "algo.elgamal.uses",
    },
]

export const categoryInfo = {
    classic: {
        name: "category.classic.name",
        description: "category.classic.description",
    },
    symmetric: {
        name: "category.symmetric.name",
        description: "category.symmetric.description",
    },
    asymmetric: {
        name: "category.asymmetric.name",
        description: "category.asymmetric.description",
    },
    hash: {
        name: "category.hash.name",
        description: "category.hash.description",
    },
}