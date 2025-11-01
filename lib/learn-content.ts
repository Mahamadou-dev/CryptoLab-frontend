export interface LearnArticle {
  id: string
  title: string
  excerpt: string
  category: "Beginner" | "Intermediate" | "Advanced"
  content: string
  sections: {
    title: string
    content: string
  }[]
  keyPoints: string[]
}

export const learnArticles: LearnArticle[] = [
  {
    id: "caesar-theory",
    title: "Caesar Cipher: The Foundation",
    excerpt: "Understand the oldest encryption method and how it shaped modern cryptography",
    category: "Beginner",
    content:
      "The Caesar cipher is one of the simplest and most widely known encryption techniques. Named after Julius Caesar, this substitution cipher shifts each letter in the plaintext by a fixed number of positions.",
    sections: [
      {
        title: "What is the Caesar Cipher?",
        content:
          "The Caesar cipher is a substitution cipher that replaces each letter with another letter that is a fixed number of positions down the alphabet. For example, with a shift of 3, A becomes D, B becomes E, and so on.",
      },
      {
        title: "How It Works",
        content:
          "To encrypt a message, you shift each letter by a predetermined amount (the key). To decrypt, you shift backwards by the same amount. This simplicity makes it easy to understand but vulnerable to brute force attacks.",
      },
      {
        title: "Historical Significance",
        content:
          "Julius Caesar used this cipher to protect military communications. Though easily broken by modern standards, it demonstrates fundamental encryption principles and remains valuable for learning cryptography basics.",
      },
      {
        title: "Limitations",
        content:
          "The Caesar cipher has only 25 possible keys (shifts), making it vulnerable to brute force attacks. Any frequency analysis can also quickly reveal the plaintext.",
      },
    ],
    keyPoints: [
      "Substitution cipher with fixed shift",
      "Only 25 possible keys",
      "Vulnerable to frequency analysis",
      "Educational value for learning encryption",
      "Foundation for more complex ciphers",
    ],
  },
  {
    id: "symmetric-encryption",
    title: "Symmetric Encryption Explained",
    excerpt: "Learn how AES and DES use shared keys to secure data",
    category: "Intermediate",
    content:
      "Symmetric encryption uses the same key for both encryption and decryption. This makes it fast and efficient, but requires secure key distribution.",
    sections: [
      {
        title: "Understanding Symmetric Encryption",
        content:
          "In symmetric encryption, both the sender and receiver use the same secret key. This key is used to encrypt the plaintext into ciphertext and to decrypt the ciphertext back into plaintext.",
      },
      {
        title: "Block Ciphers vs Stream Ciphers",
        content:
          "Block ciphers process data in fixed-size blocks (typically 128 bits), while stream ciphers process data one bit at a time. AES and DES are block ciphers, while RC4 is a stream cipher.",
      },
      {
        title: "AES (Advanced Encryption Standard)",
        content:
          "AES is the current standard for symmetric encryption, using 128, 192, or 256-bit keys. It's faster than older methods and provides strong security for sensitive data.",
      },
      {
        title: "Key Distribution Challenge",
        content:
          "The main challenge with symmetric encryption is distributing the secret key securely. If the key is intercepted, the entire system is compromised.",
      },
    ],
    keyPoints: [
      "Same key for encryption and decryption",
      "Fast and efficient",
      "Block ciphers process fixed-size blocks",
      "AES is the current standard",
      "Key distribution is critical",
    ],
  },
  {
    id: "public-key-crypto",
    title: "Public-Key Cryptography",
    excerpt: "Explore RSA and asymmetric encryption for secure communication",
    category: "Advanced",
    content:
      "Public-key cryptography uses two different keys: a public key for encryption and a private key for decryption. This solves the key distribution problem of symmetric encryption.",
    sections: [
      {
        title: "How Public-Key Cryptography Works",
        content:
          "Each user has a pair of keys: a public key (shared openly) and a private key (kept secret). Anyone can encrypt using the public key, but only the holder of the private key can decrypt.",
      },
      {
        title: "RSA Algorithm",
        content:
          "RSA is based on the mathematical difficulty of factoring large numbers. It uses two large prime numbers to generate the key pair, making it secure even with large key sizes.",
      },
      {
        title: "Digital Signatures",
        content:
          "Public-key cryptography enables digital signatures. The sender encrypts with their private key (signing), and recipients verify with the public key, proving authenticity.",
      },
      {
        title: "Computational Complexity",
        content:
          "Public-key encryption is computationally expensive compared to symmetric encryption. In practice, hybrid systems use public-key for key exchange and symmetric encryption for data.",
      },
    ],
    keyPoints: [
      "Two different keys: public and private",
      "Solves key distribution problem",
      "RSA based on prime factorization difficulty",
      "Enables digital signatures",
      "Slower than symmetric encryption",
    ],
  },
  {
    id: "hashing",
    title: "Cryptographic Hashing",
    excerpt: "Understand one-way functions and password security",
    category: "Intermediate",
    content:
      "Cryptographic hash functions produce fixed-size output from any input. They are one-way functions, meaning you cannot reverse the hash to get the original input.",
    sections: [
      {
        title: "What is a Hash Function?",
        content:
          "A hash function takes input of any size and produces a fixed-size output (the hash). A good cryptographic hash is deterministic, fast to compute, but practically impossible to reverse.",
      },
      {
        title: "Properties of Good Hash Functions",
        content:
          "Deterministic (same input produces same hash), quick to compute, sensitive to input changes (avalanche effect), collision-resistant, and one-way (cannot reverse).",
      },
      {
        title: "Applications",
        content:
          "Hash functions are used for password storage, data integrity verification, digital signatures, and blockchain technology. SHA-256 is widely used and considered secure.",
      },
      {
        title: "Collision Attacks",
        content:
          "A collision occurs when two different inputs produce the same hash. Good hash functions minimize collisions. MD5 has known collisions and should not be used for security.",
      },
    ],
    keyPoints: [
      "One-way mathematical function",
      "Fixed output size regardless of input",
      "Deterministic and collision-resistant",
      "Used for password storage and integrity",
      "SHA-256 is current standard",
    ],
  },
]
