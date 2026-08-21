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