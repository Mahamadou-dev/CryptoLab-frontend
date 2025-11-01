export type AlgorithmType = "classic" | "symmetric" | "asymmetric" | "hash"
export type Difficulty = "Beginner" | "Intermediate" | "Advanced"

export interface Algorithm {
  id: string
  name: string
  description: string
  difficulty: Difficulty
  icon: string
  category: AlgorithmType
  uses: string[]
  keySize?: string
  blockSize?: string
}

export const algorithms: Algorithm[] = [
  {
    id: "caesar",
    name: "Caesar Cipher",
    description: "Ancient substitution cipher: shift each letter by a fixed amount",
    difficulty: "Beginner",
    icon: "🔤",
    category: "classic",
    uses: ["Education", "Historical interest"],
  },
  {
    id: "vigenere",
    name: "Vigenère Cipher",
    description: "Polyalphabetic substitution using a keyword",
    difficulty: "Intermediate",
    icon: "🔑",
    category: "classic",
    uses: ["Historical cryptography", "Educational"],
  },
  {
    id: "playfair",
    name: "Playfair Cipher",
    description: "5×5 grid-based encryption technique",
    difficulty: "Intermediate",
    icon: "⊞",
    category: "classic",
    uses: ["Classic ciphers", "Learning"],
  },
  {
    id: "des",
    name: "DES",
    description: "Data Encryption Standard: symmetric block cipher",
    difficulty: "Advanced",
    icon: "🔐",
    category: "symmetric",
    uses: ["Legacy systems", "Historical reference"],
    keySize: "56 bits",
    blockSize: "64 bits",
  },
  {
    id: "aes",
    name: "AES",
    description: "Advanced Encryption Standard: modern symmetric encryption",
    difficulty: "Advanced",
    icon: "🛡️",
    category: "symmetric",
    uses: ["Data encryption", "Government standard", "Industry standard"],
    keySize: "128, 192, 256 bits",
    blockSize: "128 bits",
  },
  {
    id: "rsa",
    name: "RSA",
    description: "Asymmetric public-key cryptography",
    difficulty: "Advanced",
    icon: "🔓",
    category: "asymmetric",
    uses: ["Digital signatures", "Key exchange", "Secure communication"],
    keySize: "1024-4096 bits",
  },
  {
    id: "sha256",
    name: "SHA-256",
    description: "Cryptographic hash function for data integrity",
    difficulty: "Intermediate",
    icon: "#️⃣",
    category: "hash",
    uses: ["Data integrity", "Password hashing", "Blockchain"],
  },
  {
    id: "bcrypt",
    name: "bcrypt",
    description: "Password hashing algorithm with salt",
    difficulty: "Intermediate",
    icon: "🔒",
    category: "hash",
    uses: ["Password storage", "Security", "Authentication"],
  },
]

export const categoryInfo = {
  classic: {
    name: "Classic Ciphers",
    description: "Historical encryption methods that demonstrate fundamental concepts",
    color: "from-blue-500 to-cyan-500",
  },
  symmetric: {
    name: "Symmetric Encryption",
    description: "Uses the same key for both encryption and decryption",
    color: "from-purple-500 to-pink-500",
  },
  asymmetric: {
    name: "Asymmetric Encryption",
    description: "Uses public and private keys for secure communication",
    color: "from-orange-500 to-red-500",
  },
  hash: {
    name: "Hash Functions",
    description: "One-way functions for data integrity and security",
    color: "from-green-500 to-emerald-500",
  },
}
