import { type QuizQuestion } from "@/components/interactive-quiz"

// Types pour le contenu traduit (sans les données structurelles comme l'ID)
export interface ArticleContent {
    title: string
    excerpt: string
    content: string // Aperçu (Markdown)
    category: string
    sections: {
        title: string
        content: string // Contenu de la section (Markdown)
        codeExample?: string
    }[]
    keyPoints: string[]
}

export type QuizContent = QuizQuestion[]

// Structure principale pour stocker le contenu par langue
interface LearnContent {
    articles: Record<string, ArticleContent>
    quizzes: Record<string, QuizContent>
}

export const i18nContent: Record<"en" | "fr", LearnContent> = {
    // =================================================================================
    // VERSION ANGLAISE (TRADUITE)
    // =================================================================================
    "en": {
        articles: {
            "caesar": {
                title: "The Caesar Cipher: An Introduction",
                excerpt: "Discover the oldest and simplest substitution cipher, used by Julius Caesar himself.",
                category: "Beginner",
                content: "The Caesar cipher is a type of substitution cipher where each letter in the plaintext is replaced by a letter a certain number of positions down the alphabet. For example, with a shift of 3, 'A' becomes 'D', 'B' becomes 'E', etc. It's the perfect starting point for understanding cryptography.",
                sections: [
                    {
                        title: "How It Works",
                        content: "The algorithm works on the principle of **modular shift**. The 'key' for this cipher is simply the number of positions we shift the alphabet.\n\nMathematically, for a shift (key) `k` and a letter `p`, the encrypted letter `c` is obtained by:\n`c = (p + k) % 26`\n\nAnd decryption is the inverse:\n`p = (c - k) % 26`\n\nThe `% 26` (modulo 26) is what allows the alphabet to 'wrap around'. 'Z' (position 25) + 2 becomes 'B' (position 1), because `(25 + 2) % 26 = 1`."
                    },
                    {
                        title: "Practical Example (Key = 3)",
                        content: "Let's encrypt the word 'HELLO' with a key of 3.\n- 'H' + 3 -> 'K'\n- 'E' + 3 -> 'H'\n- 'L' + 3 -> 'O'\n- 'L' + 3 -> 'O'\n- 'O' + 3 -> 'R'\n\nThe ciphertext is **'KHOOR'**."
                    },
                    {
                        title: "Vulnerabilities: Brute Force Attack",
                        content: "The Caesar cipher is extremely weak. Since there are only 25 possible shifts (a shift of 26 brings you back to the original text), an attacker can simply try all 25 keys. This is called a **brute-force attack**.\n\nAnother method is **frequency analysis**. In English, 'E' is the most frequent letter. If 'H' is the most frequent letter in your ciphertext, it's highly likely the shift is 3 (from 'E' to 'H')."
                    }
                ],
                keyPoints: [
                    "A mono-alphabetic substitution cipher.",
                    "The key is a single integer (the shift), from 1 to 25.",
                    "Extremely vulnerable to brute-force attacks and frequency analysis.",
                    "Key concept: modular arithmetic (`% 26`)."
                ]
            },
            "vigenere": {
                title: "The Vigenère Cipher: The Unbreakable Square",
                excerpt: "Caesar's evolution. A polyalphabetic cipher that uses a keyword to defeat frequency analysis.",
                category: "Intermediate",
                content: "The Vigenère (pronounced 'Vee-zha-naire') cipher was considered unbreakable for centuries. It's a **polyalphabetic cipher**, meaning it uses *multiple* substitution alphabets (multiple Caesar shifts) within the same message, based on a **keyword**.",
                sections: [
                    {
                        title: "Principle: The Tabula Recta",
                        content: "The algorithm uses a 26x26 grid (the *Tabula Recta* or 'Vigenère Square'). Each row in this grid is a Caesar alphabet, shifted from 0 ('A') to 25 ('Z').\n\nTo encrypt:\n1. Choose a keyword (e.g., 'KEY').\n2. Repeat this keyword under the plaintext.\n\nText: A T T A C K\nKey : K E Y K E Y\n\n3. For each letter, use the plaintext letter to find the **column** and the key letter to find the **row**.\n   - (Column 'A', Row 'K') -> 'K'\n   - (Column 'T', Row 'E') -> 'X'\n   - (Column 'T', Row 'Y') -> 'R'\n   - etc.\n\nThe ciphertext becomes **'KXR ...'**."
                    },
                    {
                        title: "Mathematically",
                        content: "Vigenère is just a series of Caesar ciphers.\nIf the plaintext letter is `P` and the key letter is `K`:\n`c = (P + K) % 26`\n\n- 'A' (0) + 'K' (10) = 10 -> 'K'\n- 'T' (19) + 'E' (4) = 23 -> 'X'\n\nDecryption is the inverse:\n`p = (c - K + 26) % 26`"
                    },
                    {
                        title: "Vulnerabilities: The Kasiski Examination",
                        content: "Vigenère resists simple frequency analysis because the same letter (e.g., 'E') will be encrypted differently each time ('E'+'K', 'E'+'E', 'E'+'Y').\n\nHowever, it was broken in the 19th century by Charles Babbage and later by Friedrich Kasiski.\nThe **Kasiski Examination** involves finding *repeated* sequences of letters in the ciphertext (e.g., 'ABC' appears twice). The distance between these repetitions is often a **multiple of the keyword length**. By finding several such distances and calculating their greatest common divisor (GCD), an attacker can guess the key length (e.g., 3).\n\nOnce the key length (3) is known, the attacker splits the ciphertext into 3 'buckets' (letters 1,4,7...; letters 2,5,8...; letters 3,6,9...) and applies simple frequency analysis to each bucket, breaking it like 3 separate Caesar ciphers."
                    }
                ],
                keyPoints: [
                    "A polyalphabetic substitution cipher.",
                    "The key is a keyword (e.g., 'KEY').",
                    "Resists simple frequency analysis.",
                    "Vulnerable to the Kasiski Examination to find the key length."
                ]
            },
            "railfence": {
                title: "The Rail Fence: Writing on a Fence",
                excerpt: "A transposition cipher that changes the order of letters by writing them on an imaginary grid.",
                category: "Beginner",
                content: "The 'Rail Fence' is a **transposition** cipher. Unlike Caesar, it doesn't change the letters, but it changes their *order*.\n\nThe concept is simple: imagine writing your message diagonally on a 'fence' with a certain number of 'rails' (the key), then reading the result row by row.",
                sections: [
                    {
                        title: "How It Works (Zigzag)",
                        content: "The most classic version of Rail Fence is written in a zigzag.\nTo encrypt 'HELLO WORLD' with a key (depth) of 3:\n\nH . . . O . . . L . \n. E . L . W . R . D\n. . L . . . O . . \n\nYou write 'H' top, 'E' middle, 'L' bottom, 'L' middle, 'O' top, etc.\nThen, you read the result row by row:\n- Row 1: 'HOL'\n- Row 2: 'ELWRD'\n- Row 3: 'LO'\n\nThe ciphertext is **'HOLELWRDLO'**."
                    },
                    {
                        title: "Variant: The Grid (Columnar Transposition)",
                        content: "The version we simulate is a simpler variant, often called a **Grid Cipher** (or simple Columnar Transposition).\n\nTo encrypt 'SECRET MESSAGE' with a key of 4:\n1. Write the text vertically, column by column, in a grid with 4 rows.\n2. Pad empty spaces with 'X'.\n\n S | R | T | E | G | X\n E | E | M | S | E | X\n C | T | E | A | _ | X\n R | _ | S | G | E | X\n\n3. Read the result horizontally, row by row.\n\n- Row 1: 'SRTEGX'\n- Row 2: 'EEMSEX'\n- Row 3: 'CTEAX'\n- Row 4: 'RSGEX'\n\nThe ciphertext is **'SRTEGXEEMSEXCTEAXRSGEX'**."
                    },
                    {
                        title: "Vulnerabilities",
                        content: "This cipher is also very weak. An attacker can simply try all possible depths (keys). If the key is 3, they try to decrypt with 3. If it's 4, they try with 4, etc. They will quickly find the plaintext. This is another form of **brute force**."
                    }
                ],
                keyPoints: [
                    "A transposition cipher (the order of letters changes).",
                    "The key is an integer (the depth or number of rows).",
                    "Ciphertext is obtained by reading the grid differently from how it was written (e.g., write vertically, read horizontally).",
                    "Vulnerable to a simple brute-force attack on the depth."
                ]
            },
            "playfair": {
                title: "The Playfair Cipher: Encrypting in Pairs",
                excerpt: "The first digraphic cipher, which encrypts two letters at a time using a 5x5 matrix.",
                category: "Intermediate",
                content: "Invented by Charles Wheatstone but popularized by Lord Playfair, this cipher was a major breakthrough. It's the first **digraphic substitution cipher**: it operates on pairs of letters (digraphs) instead of single letters. This makes it *much* more resistant to frequency analysis than the Caesar Cipher.",
                sections: [
                    {
                        title: "The 5x5 Matrix",
                        content: "The core of Playfair is a 5x5 matrix (grid) generated from a **secret keyword**.\n1. Take the keyword (e.g., 'CRYPTO').\n2. Remove duplicates (becomes 'CRYPTO').\n3. Fill the grid with these letters.\n4. Fill the rest of the grid with the alphabet, combining 'I' and 'J' in one square (or omitting 'Q' or 'J').\n\nKey = 'CRYPTO'\n\n C | R | Y | P | T\n O | A | B | D | E\n F | G | H | I/J | K\n L | M | N | Q | S\n U | V | W | X | Z\n"
                    },
                    {
                        title: "The 3 Encryption Rules",
                        content: "To encrypt, you divide the message into pairs of letters (digraphs), handling duplicates ('BALLOON' -> 'BA LX LO NX') and odd-length pairs.\n\nThen, for each pair (e.g., 'AB'):\n1. **Rectangle Rule:** If the letters are on different rows and columns (e.g., 'C' and 'A'), they form a rectangle. Replace them with the letters at the opposite corners on the *same row*. 'C' (0,0) and 'A' (1,1) -> 'R' (0,1) and 'O' (1,0). 'CA' becomes 'RO'.\n\n2. **Row Rule:** If the letters are in the same row (e.g., 'C' and 'P'), take the letter immediately to the right of each (wrapping around if necessary). 'CP' becomes 'RT'.\n\n3. **Column Rule:** If the letters are in the same column (e.g., 'C' and 'F'), take the letter immediately below each. 'CF' becomes 'OL'."
                    }
                ],
                keyPoints: [
                    "First digraphic substitution cipher (pairs of letters).",
                    "The key is a keyword that generates a 5x5 matrix.",
                    "Resists simple frequency analysis (as you analyze 26x26 pairs, not 26 letters).",
                    "Three encryption rules: Rectangle, Row, Column."
                ]
            },
            "des": {
                title: "DES: The Standard of an Era",
                excerpt: "The 'Data Encryption Standard', the algorithm that defined modern cryptography for over 20 years.",
                category: "Advanced",
                content: "DES (Data Encryption Standard) was adopted as a US government standard in 1977. It's a **symmetric block cipher**: it takes a 64-bit block of plaintext and transforms it into a 64-bit block of ciphertext, using a 56-bit key.",
                sections: [
                    {
                        title: "The Feistel Network",
                        content: "DES is the most famous example of a **Feistel Network**. This is a structure that splits the data block into two halves: Left (L) and Right (R).\n\nThe process is repeated over 16 'rounds'.\nIn each round `i`:\n1. The new Left half becomes the old Right half: `L_i = R_i-1`\n2. The new Right half becomes the old Left half XORed with the result of a 'Mangler Function' (F): `R_i = L_i-1 ⊕ F(R_i-1, K_i)`\n\nThis 'criss-cross' is the core of DES."
                    },
                    {
                        title: "The 'F' (Mangler) Function",
                        content: "The 'magic' of DES happens in the F function. In each round, it takes the Right half (32 bits) and the round key (48 bits) and performs a complex series of operations:\n1. **Expansion:** The 32 bits are 'expanded' to 48 bits to match the key.\n2. **XOR:** The result is XORed with the 48-bit round key.\n3. **S-Boxes (Substitution Boxes):** The 48 bits are split into 8 blocks of 6 bits. Each goes through an 'S-Box' which reduces it to 4 bits. This is the non-linear substitution step that creates confusion.\n4. **Permutation (P-Box):** The resulting 32 bits are permuted (shuffled) before being output."
                    },
                    {
                        title: "The End of DES",
                        content: "DES's 56-bit key (2^56 possibilities) was considered safe in the 70s. However, in 1998, the EFF built a machine (the 'DES Cracker') that could brute-force a DES key in under 3 days.\n\nDES was replaced by **Triple DES (3DES)** (which applies DES three times with 2 or 3 keys) before being officially replaced by AES in 2001."
                    }
                ],
                keyPoints: [
                    "A symmetric block cipher (64-bit block, 56-bit key).",
                    "Based on a structure called a Feistel Network (16 rounds).",
                    "Uses S-Boxes (substitution) and P-Boxes (permutation).",
                    "Now considered obsolete and vulnerable to brute-force attacks."
                ]
            },
            "aes": {
                title: "AES: The Current Gold Standard",
                excerpt: "The Advanced Encryption Standard (Rijndael), the algorithm used everywhere today, from your Wi-Fi to your bank transactions.",
                category: "Advanced",
                content: "AES (Advanced Encryption Standard) is the successor to DES. Adopted in 2001, it's a block cipher based on a **Substitution-Permutation Network**.\n\nUnlike DES, it does not use a Feistel network. It operates on the entire data block (128 bits) in each round.",
                sections: [
                    {
                        title: "The 'State'",
                        content: "AES operates on 128-bit blocks (16 bytes). The first step is to arrange these 16 bytes into a 4x4 matrix called the **'State'**.\n\n`[b0, b1, b2, ..., b15]` ->\n\n[ b0 | b4 | b8  | b12 ]\n[ b1 | b5 | b9  | b13 ]\n[ b2 | b6 | b10 | b14 ]\n[ b3 | b7 | b11 | b15 ]\n\nAll AES operations are performed on this state matrix."
                    },
                    {
                        title: "The 4 Round Operations",
                        content: "AES-128 performs 10 rounds (12 for 192-bit, 14 for 256-bit). Each round consists of 4 steps:\n\n1. **SubBytes (Substitute bytes):** Each byte in the 'State' is replaced with another using a fixed lookup table (the Rijndael S-Box). This is the non-linear confusion step.\n\n2. **ShiftRows (Shift rows):** The rows of the 'State' are shifted cyclically. Row 0 doesn't move, Row 1 shifts left by 1, Row 2 by 2, and Row 3 by 3. This shuffles data vertically.\n\n3. **MixColumns (Mix columns):** Each column is transformed into a new column using complex mathematics (multiplication in a Galois Field, `$GF(2^8)$`). This is the main diffusion step.\n\n4. **AddRoundKey (Add round key):** The 'State' is XORed with the 128-bit round key for that specific round.\n\n(The final round omits the MixColumns step)."
                    },
                    {
                        title: "AES-GCM",
                        content: "When you use AES in a real application (like our simulator), you don't use 'raw' AES. You use a **mode of operation**, like GCM (Galois/Counter Mode).\n\nAES-GCM is an **AEAD** (Authenticated Encryption with Associated Data) mode. It not only **encrypts** your data but also produces an **Authentication Tag**. This tag guarantees that the data hasn't been tampered with (integrity) and that it truly came from the sender (authenticity)."
                    }
                ],
                keyPoints: [
                    "The current global standard for symmetric encryption.",
                    "128-bit block cipher, with 128, 192, or 256-bit keys.",
                    "Operates on a 4x4 matrix called the 'State'.",
                    "Each round performs 4 steps: SubBytes, ShiftRows, MixColumns, AddRoundKey.",
                    "Used in modes like GCM to provide authenticity and integrity."
                ]
            },
            "rsa": {
                title: "RSA: The Public-Key Revolution",
                excerpt: "Discover asymmetric encryption, the magic that lets you send secrets without ever having shared a key.",
                category: "Advanced",
                content: "Named after its inventors (Rivest, Shamir, Adleman), RSA is the most famous **asymmetric** (or public-key) encryption algorithm.\n\nIts revolution? It uses **two keys**: a **Public Key** (which you can give to everyone) and a **Private Key** (which you must keep secret).",
                sections: [
                    {
                        title: "How It Works",
                        content: "The asymmetry works like this:\n- What is **encrypted** with the Public Key can *only* be **decrypted** with the Private Key.\n- What is **signed** (encrypted) with the Private Key can *only* be **verified** (decrypted) with the Public Key.\n\nThis solves the biggest problem of symmetric encryption: **key distribution**. You never need to send your private key to anyone."
                    },
                    {
                        title: "The Magic: A Trapdoor Function",
                        content: "RSA is based on a mathematical 'trapdoor function': the **difficulty of factoring large prime numbers**.\n1. **Key Generation:** You pick two very large prime numbers, `p` and `q`. You multiply them to get `n = p * q`. This `n` is part of your Public Key.\n2. **The Problem:** It's very easy to multiply `p` and `q` to get `n`. But it is *extremely* difficult (practically impossible for large numbers) to take `n` and find `p` and `q` again.\n3. **The Trapdoor:** Your Private Key is derived from `p` and `q`. Only you can easily reverse the encryption because only you know the original prime factors."
                    },
                    {
                        title: "Real-World Use: HTTPS and Signatures",
                        content: "RSA is slow. You *never* use it to encrypt large files.\nIt's used for two main things:\n1. **Key Exchange (e.g., HTTPS):** When you connect to your bank, your browser uses the server's Public Key (RSA) to securely encrypt a small symmetric key (AES). The rest of the session uses that fast AES key.\n2. **Digital Signatures:** To prove you sent an email, you 'sign' its hash with your Private Key. Anyone can verify that signature with your Public Key."
                    }
                ],
                keyPoints: [
                    "Asymmetric encryption (uses a key pair: Public and Private).",
                    "Allows secure communication without prior secret key exchange.",
                    "Security relies on the difficulty of factoring large prime numbers.",
                    "Mainly used for Key Exchange (KEM) and Digital Signatures."
                ]
            },
            "sha256": {
                title: "SHA-256: The Digital Fingerprint",
                excerpt: "Discover hash functions, the mathematical 'meat grinders' that guarantee data integrity.",
                category: "Intermediate",
                content: "SHA-256 (Secure Hash Algorithm 256-bit) is **not** an encryption algorithm. It's a **cryptographic hash function**.\n\nIts purpose isn't to hide information, but to create a unique, fixed-size 'fingerprint' (digest) (256 bits, or 64 hex characters) for any input data.",
                sections: [
                    {
                        title: "The 4 Properties of a Good Hash",
                        content: "A hash like SHA-256 must have four properties:\n\n1. **Deterministic:** The same input (e.g., 'hello') will *always* produce the same output (hash).\n2. **Non-reversible (Pre-image resistant):** It's impossible to take a hash and find the original 'hello' text.\n3. **Avalanche Effect (Collision resistant):** Changing a single bit of the input (e.g., 'hello' -> 'hell**O**') must *drastically* change (about 50%) the output. This is collision resistance.\n4. **Fast:** It must be very fast to compute."
                    },
                    {
                        title: "Use Cases",
                        content: "Hashing is used everywhere to **verify integrity**.\n\n- **File Downloads:** When you download software, the website provides a SHA-256 hash. You can hash the downloaded file on your machine and compare the two hashes. If they match, you know the file wasn't corrupted or modified by a hacker.\n- **Blockchains (Bitcoin):** SHA-256 is at the heart of Bitcoin 'mining'. Miners try to find a hash (by adding a 'nonce') that starts with a certain number of zeros, proving their 'work'.\n- **Digital Signatures:** You don't sign the whole document (too slow), you sign its hash."
                    }
                ],
                keyPoints: [
                    "A hash function, not encryption.",
                    "Creates a unique 256-bit digital fingerprint (digest).",
                    "Is non-reversible (one-way) and collision-resistant (avalanche effect).",
                    "Used to guarantee data integrity (e.g., downloads, blockchain)."
                ]
            },
            "bcrypt": {
                title: "Bcrypt: The Password Guardian",
                excerpt: "Learn why SHA-256 is a bad choice for passwords and why Bcrypt is the modern solution.",
                category: "Intermediate",
                content: "Bcrypt is a **password hashing function** (KDF). Its purpose is to take a password and store it securely, making it *extremely* difficult to crack, even if a database is stolen.",
                sections: [
                    {
                        title: "The Problem with SHA-256",
                        content: "SHA-256 is *fast*. This is a feature for file integrity, but a **fatal flaw** for passwords.\n\nAn attacker who steals your database can test *billions* of passwords per second (using GPUs and 'rainbow tables'). SHA-256 is too fast to stop them."
                    },
                    {
                        title: "Bcrypt's 3 Strengths",
                        content: "Bcrypt solves this problem in three ways:\n\n1. **It's SLOW:** Bcrypt is *intentionally* slow. You can set a **'cost' (work factor)** (e.g., 12) which determines the number of rounds. The higher the cost, the longer the hash takes (e.g., 100 milliseconds). For a user logging in, 100ms is invisible. For an attacker, it means they can only test 10 passwords per second, instead of 10 billion. This is **adaptive defense**: as computers get faster, you just increase the cost.\n\n2. **It uses a 'Salt':** Bcrypt automatically generates a 'salt' (a random string) for *each* password and embeds it in the final hash. This means two users with the same password '123456' will have completely different hashes in the database. This makes 'rainbow tables' (pre-computed hash dictionaries) useless.\n\n3. **It's Memory-hard:** It was designed to be difficult to parallelize on GPUs, making it resistant to modern hardware attacks."
                    }
                ],
                keyPoints: [
                    "A password hashing function (KDF), not a general-purpose hash.",
                    "Is intentionally SLOW and ADAPTIVE via a 'work factor' (cost).",
                    "Automatically includes a random 'salt' to prevent rainbow tables.",
                    "Used exclusively for secure password storage."
                ]
            }
        },
        quizzes: {
            "caesar": [
                {
                    question: "What is the main vulnerability of the Caesar Cipher?",
                    options: ["It's too slow", "It uses prime numbers", "Frequency analysis and brute force", "It requires a 5x5 matrix"],
                    correct: 2,
                    explanation: "With only 25 possible keys, Caesar is trivial to 'crack' by brute force or by analyzing letter frequency."
                },
                {
                    question: "If 'A' becomes 'C' (Key=2), what does 'ZEBRA' become?",
                    options: ["ZGDTC", "BGDTC", "BGFTC", "YDCPA"],
                    correct: 1,
                    explanation: "Z+2 -> B (wraps around), E+2 -> G, B+2 -> D, R+2 -> T, A+2 -> C. The result is BGDTC."
                }
            ],
            "vigenere": [
                {
                    question: "What is the main difference between Caesar and Vigenère?",
                    options: ["Caesar uses letters, Vigenère uses numbers", "Vigenère uses multiple shifts (polyalphabetic)", "Vigenère is a transposition cipher", "Caesar is more secure"],
                    correct: 1,
                    explanation: "Vigenère is polyalphabetic (multiple shifts based on a keyword), while Caesar is mono-alphabetic (one single shift)."
                },
                {
                    question: "How does the Kasiski attack manage to break Vigenère?",
                    options: ["By trying all possible keys", "By finding the frequency of the letter 'E'", "By finding repeated sequences to guess the key length", "By using a quantum computer"],
                    correct: 2,
                    explanation: "The Kasiski examination looks for repeated ciphertext sequences. The distance between them is often a multiple of the key length, which reduces the problem to several separate Caesar ciphers."
                }
            ],
            "railfence": [
                {
                    question: "What type of cipher is the Rail Fence an example of?",
                    options: ["Substitution (letters changed)", "Asymmetric (two keys)", "Transposition (order changed)", "Hashing (one-way)"],
                    correct: 2,
                    explanation: "The Rail Fence doesn't change the letters, it only changes their order (transposition) by reading them off a grid."
                },
                {
                    question: "With a key (depth) of 2, what does 'HELLO' become (Grid version)?",
                    options: ["HLO ELX", "HLELO", "ELHOL", "HLOEL"],
                    correct: 0,
                    explanation: "Grid (P=2): \nH L O\nE L X\nReading Row 1: 'HLO'. Reading Row 2: 'ELX'. Result: 'HLOELX'."
                }
            ],
            "playfair": [
                {
                    question: "Why is Playfair more secure than Caesar?",
                    options: ["It uses a longer key", "It encrypts in pairs (digraphs)", "It uses prime numbers", "It is asymmetric"],
                    correct: 1,
                    explanation: "By encrypting in pairs, Playfair hides the simple frequency analysis of single letters (e.g., 'E' is no longer always encrypted to the same letter)."
                },
                {
                    question: "In a 5x5 matrix, if 'A' and 'B' are in the same row, which rule applies?",
                    options: ["Rectangle Rule", "Row Rule (shift right)", "Column Rule (shift down)", "Duplicate Rule (add 'X')"],
                    correct: 1,
                    explanation: "Letters in the same row are replaced by the letters immediately to their right (wrapping around if necessary)."
                }
            ],
            "des": [
                {
                    question: "What is the core structure of the DES algorithm?",
                    options: ["A Substitution-Permutation Network", "A Feistel Network", "A 5x5 Grid", "Modular Arithmetic"],
                    correct: 1,
                    explanation: "DES is the classic example of a Feistel Network, which splits the block in two and applies 16 'crossing' rounds."
                },
                {
                    question: "Why is DES considered obsolete today?",
                    options: ["It is too slow", "Its 56-bit key is too short", "It doesn't use S-Boxes", "It was replaced by Playfair"],
                    correct: 1,
                    explanation: "A 56-bit key (2^56) is vulnerable to brute-force attacks with modern hardware."
                }
            ],
            "aes": [
                {
                    question: "What is the fixed block size used by AES?",
                    options: ["64 bits", "128 bits", "256 bits", "Variable"],
                    correct: 1,
                    explanation: "AES (Rijndael) always operates on 128-bit blocks, regardless of the key size (128, 192, or 256 bits)."
                },
                {
                    question: "Which step of the AES round is NOT performed on the very last round?",
                    options: ["SubBytes", "ShiftRows", "MixColumns", "AddRoundKey"],
                    correct: 2,
                    explanation: "The MixColumns step is omitted on the final round to allow decryption to work correctly."
                }
            ],
            "rsa": [
                {
                    question: "What difficult math problem does RSA's security rely on?",
                    options: ["The Discrete Logarithm problem", "Factoring large prime numbers", "The Knapsack problem", "Calculating S-Boxes"],
                    correct: 1,
                    explanation: "It's easy to multiply two large primes (p, q) to get N, but it's practically impossible to do the reverse."
                },
                {
                    question: "How does HTTPS (secure web) use RSA?",
                    options: ["It encrypts all website traffic with RSA.", "It uses it to digitally sign every packet.", "It uses it only to exchange a symmetric key (AES) at the start.", "It doesn't use it; it prefers DES."],
                    correct: 2,
                    explanation: "RSA is slow. It's only used for the initial handshake (KEM) to encrypt and exchange an AES key, which is then used to encrypt the session."
                }
            ],
            "sha256": [
                {
                    question: "What is the main difference between SHA-256 and AES?",
                    options: ["SHA-256 is faster.", "SHA-256 is symmetric.", "SHA-256 is a hash function (one-way).", "SHA-256 uses a 256-bit key."],
                    correct: 2,
                    explanation: "AES is encryption (reversible with a key), while SHA-256 is a hash function (non-reversible) used for integrity."
                },
                {
                    question: "If I change one character in a file, what happens to its SHA-256 hash?",
                    options: ["The hash will change slightly.", "The hash will be completely different.", "The hash will stay the same.", "The hash will be shorter."],
                    correct: 1,
                    explanation: "This is the 'avalanche effect'. A minimal change in the input produces a radically different output (hash)."
                }
            ],
            "bcrypt": [
                {
                    question: "Why is Bcrypt better than SHA-256 for storing passwords?",
                    options: ["Bcrypt is faster than SHA-256.", "Bcrypt is intentionally slow (adaptive).", "Bcrypt is reversible.", "Bcrypt produces a longer hash."],
                    correct: 1,
                    explanation: "Bcrypt is designed to be slow via a 'cost factor', which makes brute-force attacks billions of times slower than on SHA-256."
                },
                {
                    question: "What is a 'salt' and why does Bcrypt use it?",
                    options: ["It's an extra secret password.", "It's a random string added to prevent 'rainbow tables'.", "It's part of the DES algorithm.", "It's another name for the private key."],
                    correct: 1,
                    explanation: "The 'salt' is a unique random value for each user. It ensures that two users with the same password have different hashes, making pre-computed hash dictionaries (rainbow tables) useless."
                }
            ]
        }
    },
    // =================================================================================
    // VERSION FRANÇAISE (VOTRE CONTENU)
    // =================================================================================
    "fr": {
        articles: {
            "caesar": {
                title: "Le Chiffre de César : L'Introduction",
                excerpt: "Découvrez le plus ancien et le plus simple des chiffrements par substitution, utilisé par Jules César lui-même.",
                category: "Beginner",
                content: "Le chiffre de César est un type de chiffrement par substitution où chaque lettre du texte en clair est remplacée par une lettre à un certain nombre de positions plus loin dans l'alphabet. Par exemple, avec un décalage de 3, 'A' devient 'D', 'B' devient 'E', etc. C'est le point de départ parfait pour comprendre la cryptographie.",
                sections: [
                    {
                        title: "Principe de Fonctionnement",
                        content: "L'algorithme fonctionne sur le principe du **décalage modulaire**. La 'clé' de ce chiffrement est simplement le nombre de positions dont on décale l'alphabet. \n\nMathématiquement, pour un décalage (clé) `k` et une lettre `p`, la lettre chiffrée `c` est obtenue par : \n`c = (p + k) % 26` \n\nEt le déchiffrement est l'inverse : \n`p = (c - k) % 26` \n\nLe `% 26` (modulo 26) est ce qui permet à l'alphabet de 'boucler' sur lui-même. 'Z' (position 25) + 2 devient 'B' (position 1), car `(25 + 2) % 26 = 1`."
                    },
                    {
                        title: "Exemple Pratique (Clé = 3)",
                        content: "Chiffrons le mot 'BONJOUR' avec une clé de 3.\n- 'B' + 3 -> 'E'\n- 'O' + 3 -> 'R'\n- 'N' + 3 -> 'Q'\n- 'J' + 3 -> 'M'\n- 'O' + 3 -> 'R'\n- 'U' + 3 -> 'X'\n- 'R' + 3 -> 'U'\n\nLe texte chiffré est **'ERQMRXU'**."
                    },
                    {
                        title: "Vulnérabilités : L'Attaque par Force Brute",
                        content: "Le chiffre de César est extrêmement faible. Puisqu'il n'y a que 25 décalages possibles (un décalage de 26 ramène au texte original), un attaquant peut simplement essayer les 25 clés. C'est ce qu'on appelle une **attaque par force brute**. \n\nUne autre méthode est l'**analyse de fréquence**. En français, la lettre 'E' est la plus fréquente. Si 'H' est la lettre la plus fréquente dans votre texte chiffré, il est très probable que le décalage soit de 3 (de 'E' à 'H')."
                    }
                ],
                keyPoints: [
                    "Un chiffrement par substitution mono-alphabétique.",
                    "La clé est un simple entier (le décalage), de 1 à 25.",
                    "Extrêmement vulnérable à l'attaque par force brute et à l'analyse de fréquence.",
                    "Concept clé : l'arithmétique modulaire (`% 26`)."
                ]
            },
            "vigenere": {
                title: "Le Chiffre de Vigenère : Le Carré Indéchiffrable",
                excerpt: "L'évolution de César. Un chiffrement polyalphabétique qui utilise un mot-clé pour vaincre l'analyse de fréquence.",
                category: "Intermediate",
                content: "Le chiffre de Vigenère (prononcé 'Vij-e-naire') a été considéré comme incassable pendant des siècles. C'est un **chiffrement polyalphabétique**, ce qui signifie qu'il utilise *plusieurs* alphabets de substitution (plusieurs décalages de César) au sein d'un même message, en fonction d'un **mot-clé**.",
                sections: [
                    {
                        title: "Principe : La Tabula Recta",
                        content: "L'algorithme utilise une grille 26x26 (la *Tabula Recta* ou 'Carré de Vigenère'). Chaque ligne de cette grille est un alphabet de César, décalé de 0 (pour 'A') à 25 (pour 'Z').\n\nPour chiffrer :\n1. On choisit un mot-clé (ex: 'CLE').\n2. On répète ce mot-clé sous le texte en clair.\n\nTexte : B O N J O U R\nClé   : C L E C L E C\n\n3. Pour chaque lettre, on utilise la lettre du texte pour trouver la **colonne** et la lettre de la clé pour trouver la **ligne**.\n   - (Colonne 'B', Ligne 'C') -> 'D'\n   - (Colonne 'O', Ligne 'L') -> 'Z'\n   - (Colonne 'N', Ligne 'E') -> 'R'\n   - etc.\n\nLe chiffré devient **'DZR LGR'**."
                    },
                    {
                        title: "Mathématiquement",
                        content: "Le Vigenère n'est qu'une série de chiffrements de César.\nSi la lettre du texte est `P` et la lettre de la clé est `K`:\n`c = (P + K) % 26`\n\n- 'B' (1) + 'C' (2) = 1 + 2 = 3 -> 'D'\n- 'O' (14) + 'L' (11) = 14 + 11 = 25 -> 'Z'\n\nLe déchiffrement est l'inverse :\n`p = (c - K + 26) % 26`"
                    },
                    {
                        title: "Vulnérabilités : L'Attaque de Kasiski",
                        content: "Le Vigenère résiste à l'analyse de fréquence simple, car la même lettre (ex: 'E') sera chiffrée différemment à chaque fois ('E'+'C', 'E'+'L', 'E'+'E').\n\nCependant, il a été cassé au 19ème siècle par Charles Babbage et plus tard par Friedrich Kasiski.\nL'**Examen de Kasiski** consiste à trouver des séquences de lettres *répétées* dans le texte chiffré (ex: la séquence 'ABC' apparaît deux fois). L'écart entre ces répétitions est souvent un **multiple de la longueur du mot-clé**. En trouvant plusieurs de ces écarts et en calculant leur plus grand commun diviseur (PGCD), un attaquant peut deviner la longueur de la clé (ex: 3). \n\nUne fois la longueur de clé (3) connue, l'attaquant divise le texte chiffré en 3 'seaux' (lettres 1,4,7... ; lettres 2,5,8... ; lettres 3,6,9...) et applique une simple analyse de fréquence sur chaque seau, cassant le code comme 3 chiffrements de César distincts."
                    }
                ],
                keyPoints: [
                    "Un chiffrement par substitution polyalphabétique.",
                    "La clé est un mot-clé (ex: 'CLE').",
                    "Résiste à l'analyse de fréquence simple.",
                    "Vulnérable à l'Examen de Kasiski pour trouver la longueur de la clé."
                ]
            },
            "railfence": {
                title: "Le Rail Fence : Écrire sur une Clôture",
                excerpt: "Un chiffrement par transposition qui change l'ordre des lettres en les écrivant sur une grille imaginaire.",
                category: "Beginner",
                content: "Le 'Rail Fence' (ou 'Grille') est un chiffrement par **transposition**. Contrairement à César, il ne change pas les lettres, mais il change leur *ordre*. \n\nLe concept est simple : imaginez écrire votre message en diagonale sur une 'clôture' (rail) d'un certain nombre de 'lattes' (la clé), puis de lire le résultat ligne par ligne.",
                sections: [
                    {
                        title: "Principe de Fonctionnement (Zigzag)",
                        content: "La version la plus classique du Rail Fence s'écrit en zigzag.\nPour chiffrer 'BONJOUR' avec une clé (profondeur) de 3 :\n\nB . . . O . . . R \n. O . J . U . \n. . N . . . \n\nOn écrit 'B' en haut, 'O' au milieu, 'N' en bas, 'J' au milieu, 'O' en haut, etc. \nEnsuite, on lit le résultat ligne par ligne :\n- Ligne 1: 'BOR'\n- Ligne 2: 'OJU'\n- Ligne 3: 'N'\n\nLe chiffré est **'BOROJUN'**."
                    },
                    {
                        title: "Variante : La Grille (Transposition Colonne)",
                        content: "La version que nous simulons est une variante plus simple, souvent appelée **Chiffre de Grille** (ou Transposition Colonne simple).\n\nPour chiffrer 'MESSAGE CONFIDENTIEL' avec une clé de 4 :\n1. On écrit le texte verticalement, colonne par colonne, dans une grille de 4 lignes.\n2. On remplit les cases vides avec des 'X'.\n\n M | E | G | N | D | T | L\n E | S | E | C | F | I | X\n S | A | _ | O | I | E | X\n A | G | C | N | E | L | X\n\n3. On lit le résultat horizontalement, ligne par ligne.\n\n- Ligne 1: 'MEGNDTL'\n- Ligne 2: 'ESEIFIX'\n- Ligne 3: 'SAOIEX'\n- Ligne 4: 'AGCNELX'\n\nLe chiffré est **'MEGNDTLESEIFIXSAOIEXAGCNELX'**."
                    },
                    {
                        title: "Vulnérabilités",
                        content: "Ce chiffre est également très faible. Un attaquant peut simplement essayer toutes les profondeurs (clés) possibles. Si la clé est 3, il essaie de déchiffrer avec 3. Si la clé est 4, il essaie avec 4, etc. Il trouvera rapidement le texte en clair. C'est une autre forme de **force brute**."
                    }
                ],
                keyPoints: [
                    "Un chiffrement par transposition (l'ordre des lettres change).",
                    "La clé est un entier (la profondeur ou le nombre de lignes).",
                    "Le texte chiffré est obtenu en lisant la grille différemment de son écriture (ex: écrire verticalement, lire horizontalement).",
                    "Vulnérable à une simple attaque par force brute sur la profondeur."
                ]
            },
            "playfair": {
                title: "Le Chiffre de Playfair : Chiffrer par Paires",
                excerpt: "Le premier chiffrement par digrammes, qui chiffre deux lettres à la fois à l'aide d'une matrice 5x5.",
                category: "Intermediate",
                content: "Inventé par Charles Wheatstone mais popularisé par Lord Playfair, ce chiffre était une avancée majeure. C'est le premier **chiffrement par substitution de digrammes** : il opère sur des paires de lettres (digrammes) au lieu de lettres uniques. Cela le rend *beaucoup* plus résistant à l'analyse de fréquence que le Chiffre de César.",
                sections: [
                    {
                        title: "La Matrice 5x5",
                        content: "Le cœur de Playfair est une matrice 5x5 (grille) générée à partir d'un **mot-clé secret**.\n1. On prend le mot-clé (ex: 'CRYPTO').\n2. On supprime les doublons (devient 'CRYPTO').\n3. On remplit la grille avec ces lettres.\n4. On remplit le reste de la grille avec l'alphabet, en combinant 'I' et 'J' dans une seule case (ou en omettant 'Q' ou 'J').\n\nClé = 'CRYPTO'\n\n C | R | Y | P | T\n O | A | B | D | E\n F | G | H | I/J | K\n L | M | N | Q | S\n U | V | W | X | Z\n"
                    },
                    {
                        title: "Les 3 Règles de Chiffrement",
                        content: "Pour chiffrer, on divise le message en paires de lettres (digrammes), en gérant les doublons ('BALLON' -> 'BA LX LO NX') et les paires impaires.\n\nEnsuite, pour chaque paire (ex: 'AB') :\n1. **Règle du Rectangle :** Si les lettres sont sur des lignes et colonnes différentes (ex: 'C' et 'A'), elles forment un rectangle. On les remplace par les lettres aux coins opposés sur la *même ligne*. 'C' (0,0) et 'A' (1,1) -> 'R' (0,1) et 'O' (1,0). 'CA' devient 'RO'.\n\n2. **Règle de la Ligne :** Si les lettres sont sur la même ligne (ex: 'C' et 'P'), on prend la lettre immédiatement à droite de chacune (en bouclant si nécessaire). 'CP' devient 'RT'.\n\n3. **Règle de la Colonne :** Si les lettres sont sur la même colonne (ex: 'C' et 'F'), on prend la lettre immédiatement en dessous de chacune. 'CF' devient 'OL'."
                    }
                ],
                keyPoints: [
                    "Premier chiffrement par substitution de digrammes (paires de lettres).",
                    "La clé est un mot-clé qui génère une matrice 5x5.",
                    "Résiste à l'analyse de fréquence simple (car on analyse 26x26 paires, pas 26 lettres).",
                    "Trois règles de chiffrement : Rectangle, Ligne, Colonne."
                ]
            },
            "des": {
                title: "DES : Le Standard d'une Époque",
                excerpt: "Le 'Data Encryption Standard', l'algorithme qui a défini la cryptographie moderne pendant plus de 20 ans.",
                category: "Advanced",
                content: "Le DES (Data Encryption Standard) a été adopté comme standard par le gouvernement américain en 1977. C'est un **chiffrement par bloc** symétrique : il prend un bloc de 64 bits de texte en clair et le transforme en un bloc de 64 bits de texte chiffré, en utilisant une clé de 56 bits.",
                sections: [
                    {
                        title: "Le Réseau de Feistel",
                        content: "Le DES est l'exemple le plus célèbre d'un **Réseau de Feistel**. C'est une structure qui divise le bloc de données en deux moitiés : Gauche (L) et Droite (R).\n\nLe processus se répète sur 16 'rounds' (étapes).\nÀ chaque round `i` :\n1. La nouvelle moitié Gauche devient l'ancienne moitié Droite : `L_i = R_i-1`\n2. La nouvelle moitié Droite devient l'ancienne moitié Gauche XORée avec le résultat d'une 'Fonction Mangler' (F) : `R_i = L_i-1 ⊕ F(R_i-1, K_i)`\n\nCe 'croisement' est le cœur du DES."
                    },
                    {
                        title: "La Fonction 'F' (Mangler)",
                        content: "La 'magie' du DES se trouve dans la fonction F. À chaque round, elle prend la moitié Droite (32 bits) et la clé du round (48 bits) et effectue une série d'opérations complexes :\n1. **Expansion :** Les 32 bits sont 'étendus' à 48 bits pour correspondre à la clé.\n2. **XOR :** Le résultat est XORé avec la clé de round de 48 bits.\n3. **S-Boxes (Boîtes de Substitution) :** Les 48 bits sont divisés en 8 blocs de 6 bits. Chacun passe par une 'S-Box' qui le réduit à 4 bits. C'est l'étape de substitution non-linéaire qui crée la confusion.\n4. **Permutation (P-Box) :** Les 32 bits résultants sont permutés (mélangés) avant de sortir."
                    },
                    {
                        title: "La Fin du DES",
                        content: "La clé de 56 bits du DES (2^56 possibilités) était considérée comme sûre dans les années 70. Cependant, en 1998, l'EFF a construit une machine (le 'DES Cracker') capable de casser une clé DES en moins de 3 jours par force brute. \n\nLe DES a été remplacé par le **Triple DES (3DES)** (qui applique DES trois fois avec 2 ou 3 clés) avant d'être officiellement remplacé par l'AES en 2001."
                    }
                ],
                keyPoints: [
                    "Un chiffrement par bloc symétrique (64 bits de bloc, 56 bits de clé).",
                    "Basé sur une structure appelée Réseau de Feistel (16 rounds).",
                    "Utilise des S-Boxes (substitution) et des P-Boxes (permutation).",
                    "Désormais considéré comme obsolète et vulnérable à la force brute."
                ]
            },
            "aes": {
                title: "AES : Le Standard d'Or Actuel",
                excerpt: "L'Advanced Encryption Standard (Rijndael), l'algorithme utilisé partout aujourd'hui, de votre Wi-Fi à vos transactions bancaires.",
                category: "Advanced",
                content: "L'AES (Advanced Encryption Standard) est le successeur du DES. Adopté en 2001, c'est un chiffrement par bloc basé sur un **réseau de substitution-permutation**. \n\nContrairement au DES, il n'utilise pas de réseau de Feistel. Il opère sur la totalité du bloc de données (128 bits) à chaque round.",
                sections: [
                    {
                        title: "Le 'State' (État)",
                        content: "L'AES fonctionne sur des blocs de 128 bits (16 octets). La première étape est d'organiser ces 16 octets dans une matrice 4x4 appelée le **'State' (État)**.\n\n`[b0, b1, b2, ..., b15]` ->\n\n[ b0 | b4 | b8  | b12 ]\n[ b1 | b5 | b9  | b13 ]\n[ b2 | b6 | b10 | b14 ]\n[ b3 | b7 | b11 | b15 ]\n\nToutes les opérations de l'AES se font sur cette matrice."
                    },
                    {
                        title: "Les 4 Opérations d'un Round",
                        content: "L'AES-128 exécute 10 rounds (12 pour 192 bits, 14 pour 256 bits). Chaque round est composé de 4 étapes :\n\n1. **SubBytes (Substitution d'octets) :** Chaque octet du 'State' est remplacé par un autre en utilisant une table de consultation fixe (la S-Box de Rijndael). C'est l'étape de confusion non-linéaire.\n\n2. **ShiftRows (Décalage de lignes) :** Les lignes du 'State' sont décalées circulairement. La Ligne 0 ne bouge pas, la Ligne 1 est décalée de 1 vers la gauche, la Ligne 2 de 2, et la Ligne 3 de 3. Cela mélange les données verticalement.\n\n3. **MixColumns (Mélange de colonnes) :** Chaque colonne est transformée en une nouvelle colonne en utilisant des mathématiques complexes (multiplication dans un corps de Galois, `$GF(2^8)$`). C'est l'étape de diffusion principale.\n\n4. **AddRoundKey (Ajout de la clé de round) :** Le 'State' est XORé avec la clé de round (128 bits) de ce round spécifique.\n\n(Le dernier round omet l'étape MixColumns)."
                    },
                    {
                        title: "AES-GCM",
                        content: "Lorsque vous utilisez AES dans une application réelle (comme notre simulateur), vous n'utilisez pas l'AES 'pur'. Vous utilisez un **mode d'opération**, comme GCM (Galois/Counter Mode).\n\nAES-GCM est un mode **AEAD** (Authenticated Encryption with Associated Data). Non seulement il **chiffre** vos données, mais il produit aussi un **Tag d'Authentification**. Ce tag garantit que les données n'ont pas été modifiées (intégrité) et qu'elles proviennent bien de l'expéditeur (authenticité)."
                    }
                ],
                keyPoints: [
                    "Le standard mondial actuel pour le chiffrement symétrique.",
                    "Chiffrement par bloc de 128 bits, avec clés de 128, 192, ou 256 bits.",
                    "Opère sur une matrice 4x4 appelée 'State'.",
                    "Chaque round exécute 4 étapes : SubBytes, ShiftRows, MixColumns, AddRoundKey.",
                    "Utilisé dans des modes comme GCM pour garantir l'authenticité et l'intégrité."
                ]
            },
            "rsa": {
                title: "RSA : La Révolution de la Clé Publique",
                excerpt: "Découvrez le chiffrement asymétrique, la magie qui permet d'envoyer des secrets sans jamais avoir partagé de clé.",
                category: "Advanced",
                content: "Nommé d'après ses inventeurs (Rivest, Shamir, Adleman), le RSA est l'algorithme de **chiffrement asymétrique** (ou à clé publique) le plus connu. \n\nSa révolution ? Il utilise **deux clés** : une **Clé Publique** (que vous pouvez donner à tout le monde) et une **Clé Privée** (que vous devez garder secrète).",
                sections: [
                    {
                        title: "Le Principe de Fonctionnement",
                        content: "L'asymétrie fonctionne comme suit :\n- Ce qui est **chiffré** avec la Clé Publique ne peut être **déchiffré** qu'avec la Clé Privée.\n- Ce qui est **signé** (chiffré) avec la Clé Privée ne peut être **vérifié** (déchiffré) qu'avec la Clé Publique.\n\nCela résout le plus grand problème du chiffrement symétrique : la **distribution de la clé**. Vous n'avez jamais besoin d'envoyer votre clé privée à qui que ce soit."
                    },
                    {
                        title: "La Magie : Une Fonction à Trappe",
                        content: "Le RSA est basé sur une 'fonction à trappe' mathématique : la **difficulté de la factorisation des grands nombres premiers**.\n1. **Génération de la clé :** Vous choisissez deux très grands nombres premiers, `p` et `q`. Vous les multipliez pour obtenir `n = p * q`. Ce `n` fait partie de votre Clé Publique.\n2. **Le Problème :** Il est très facile de multiplier `p` et `q` pour obtenir `n`. Mais il est *extrêmement* difficile (pratiquement impossible pour de grands nombres) de prendre `n` et de retrouver `p` et `q`.\n3. **La Trappe :** Votre Clé Privée est dérivée de `p` et `q`. Vous seul pouvez facilement inverser le chiffrement car vous seul connaissez les facteurs premiers originaux."
                    },
                    {
                        title: "Utilisation Réelle : HTTPS et Signatures",
                        content: "Le RSA est lent. On ne l'utilise *jamais* pour chiffrer des fichiers volumineux.\nOn l'utilise pour deux choses :\n1. **Échange de Clé (ex: HTTPS) :** Lorsque vous vous connectez à votre banque, votre navigateur utilise la Clé Publique du serveur (RSA) pour chiffrer en toute sécurité une petite clé symétrique (AES). Le reste de la session utilise cette clé AES, qui est rapide.\n2. **Signatures Numériques :** Pour prouver que vous avez envoyé un e-mail, vous 'signez' son hash avec votre Clé Privée. Tout le monde peut vérifier cette signature avec votre Clé Publique."
                    }
                ],
                keyPoints: [
                    "Chiffrement asymétrique (utilise une paire de clés : Publique et Privée).",
                    "Permet de communiquer de manière sécurisée sans échange de clé secrète préalable.",
                    "La sécurité repose sur la difficulté de factoriser de grands nombres premiers.",
                    "Principalement utilisé pour l'échange de clés (KEM) et les signatures numériques."
                ]
            },
            "sha256": {
                title: "SHA-256 : L'Empreinte Numérique",
                excerpt: "Découvrez les fonctions de hachage, des 'moulins à viande' mathématiques qui garantissent l'intégrité des données.",
                category: "Intermediate",
                content: "Le SHA-256 (Secure Hash Algorithm 256-bit) n'est **pas** un algorithme de chiffrement. C'est une **fonction de hachage cryptographique**. \n\nSon but n'est pas de cacher l'information, mais de créer une 'empreinte' (digest) unique et de taille fixe (256 bits, soit 64 caractères hexadécimaux) pour n'importe quelle donnée d'entrée.",
                sections: [
                    {
                        title: "Les 4 Propriétés d'un Bon Hash",
                        content: "Un hash comme le SHA-256 doit avoir quatre propriétés :\n\n1. **Déterministe :** La même entrée (ex: 'bonjour') donnera *toujours* la même sortie (hash).\n2. **Non-réversible (Pré-image) :** Il est impossible de prendre un hash et de retrouver le texte 'bonjour' original.\n3. **Effet d'Avalanche (Collision) :** Changer un seul bit de l'entrée (ex: 'bonjour' -> 'bonjou**S**') doit changer *radicalement* (environ 50%) la sortie. C'est la résistance aux collisions.\n4. **Rapidité :** Il doit être très rapide à calculer."
                    },
                    {
                        title: "Cas d'Utilisation",
                        content: "Le hachage est utilisé partout pour **vérifier l'intégrité**.\n\n- **Téléchargements de Fichiers :** Lorsque vous téléchargez un logiciel, le site web fournit un hash SHA-256. Vous pouvez hacher le fichier téléchargé sur votre machine et comparer les deux hashs. S'ils correspondent, vous savez que le fichier n'a pas été corrompu ou modifié par un pirate.\n- **Blockchains (Bitcoin) :** Le SHA-256 est au cœur du 'minage' de Bitcoin. Les mineurs essaient de trouver un hash (en ajoutant un 'nonce') qui commence par un certain nombre de zéros, ce qui prouve leur 'travail'.\n- **Signatures Numériques :** On ne signe pas le document entier (trop lent), on signe son hash."
                    }
                ],
                keyPoints: [
                    "Une fonction de hachage, pas un chiffrement.",
                    "Crée une empreinte numérique unique (digest) de 256 bits.",
                    "Est non-réversible (à sens unique) et résistant aux collisions (effet d'avalanche).",
                    "Utilisé pour garantir l'intégrité des données (ex: téléchargements, blockchain)."
                ]
            },
            "bcrypt": {
                title: "Bcrypt : Le Gardien des Mots de Passe",
                excerpt: "Apprenez pourquoi le SHA-256 est un mauvais choix pour les mots de passe et pourquoi Bcrypt est la solution moderne.",
                category: "Intermediate",
                content: "Bcrypt est une **fonction de hachage de mot de passe** (KDF). Son but est de prendre un mot de passe et de le stocker de manière sécurisée, en le rendant *extrêmement* difficile à casser, même si une base de données est volée.",
                sections: [
                    {
                        title: "Le Problème avec SHA-256",
                        content: "Le SHA-256 est *rapide*. C'est une qualité pour l'intégrité des fichiers, mais un **défaut mortel** pour les mots de passe. \n\nUn attaquant qui vole votre base de données peut tester des *milliards* de mots de passe par seconde (en utilisant des GPU et des 'rainbow tables'). Le SHA-256 est trop rapide pour les arrêter."
                    },
                    {
                        title: "Les 3 Forces de Bcrypt",
                        content: "Bcrypt résout ce problème de trois façons :\n\n1. **Il est LENT :** Bcrypt est conçu pour être *intentionnellement* lent. Vous pouvez définir un **'coût' (work factor)** (ex: 12) qui détermine le nombre de rounds. Plus le coût est élevé, plus le hachage prend de temps (ex: 100 millisecondes). Pour un utilisateur qui se connecte, 100ms est invisible. Pour un attaquant, cela signifie qu'il ne peut tester que 10 mots de passe par seconde, au lieu de 10 milliards. C'est la **défense adaptative** : à mesure que les ordinateurs deviennent plus rapides, vous augmentez simplement le coût.\n\n2. **Il utilise un 'Salt' (Sel) :** Bcrypt génère automatiquement un 'salt' (une chaîne aléatoire) pour *chaque* mot de passe et l'intègre dans le hash final. Cela signifie que deux utilisateurs avec le même mot de passe '123456' auront des hashs totalement différents dans la base de données. Cela rend les 'rainbow tables' (dictionnaires de hashs pré-calculés) inutiles.\n\n3. **Il est gourmand en mémoire (Memory-hard) :** Il a été conçu pour être difficile à paralléliser sur les GPU, ce qui le rend résistant aux types d'attaques matérielles modernes."
                    }
                ],
                keyPoints: [
                    "Une fonction de hachage de mot de passe (KDF), pas un hash généraliste.",
                    "Est intentionnellement LENT et ADAPTATIF grâce à un 'facteur de coût' (work factor).",
                    "Intègre automatiquement un 'salt' (sel) aléatoire pour empêcher les rainbow tables.",
                    "Utilisé exclusivement pour le stockage sécurisé des mots de passe."
                ]
            }
        },
        quizzes: {
            "caesar": [
                {
                    question: "Quelle est la principale vulnérabilité du Chiffre de César ?",
                    options: ["Il est trop lent", "Il utilise des nombres premiers", "L'analyse de fréquence et la force brute", "Il nécessite une matrice 5x5"],
                    correct: 2,
                    explanation: "Avec seulement 25 clés possibles, César est trivial à 'casser' par force brute ou en analysant la fréquence des lettres."
                },
                {
                    question: "Si 'A' devient 'C' (Clé=2), que devient 'ZEBRA' ?",
                    options: ["ZGDTC", "BGDTC", "BGFTC", "YDCPA"],
                    correct: 1,
                    explanation: "Z+2 -> B (boucle), E+2 -> G, B+2 -> D, R+2 -> T, A+2 -> C. Le résultat est BGDTC."
                }
            ],
            "vigenere": [
                {
                    question: "Quelle est la principale différence between César et Vigenère ?",
                    options: ["César utilise des lettres, Vigenère des chiffres", "Vigenère utilise plusieurs décalages (polyalphabétique)", "Vigenère est une transposition", "César est plus sécurisé"],
                    correct: 1,
                    explanation: "Vigenère est polyalphabétique (plusieurs décalages basés sur un mot-clé), tandis que César est mono-alphabétique (un seul décalage)."
                },
                {
                    question: "Comment l'attaque de Kasiski parvient-elle à casser Vigenère ?",
                    options: ["En essayant toutes les clés possibles", "En trouvant la fréquence de la lettre 'E'", "En trouvant des séquences répétées pour deviner la longueur de la clé", "En utilisant un ordinateur quantique"],
                    correct: 2,
                    explanation: "L'examen de Kasiski recherche des séquences de texte chiffré répétées. L'écart entre elles est souvent un multiple de la longueur de la clé, ce qui permet de réduire le problème à plusieurs chiffrements de César."
                }
            ],
            "railfence": [
                {
                    question: "De quel type de chiffrement le Rail Fence est-il un exemple ?",
                    options: ["Substitution (lettres changées)", "Asymétrique (deux clés)", "Transposition (ordre changé)", "Hachage (à sens unique)"],
                    correct: 2,
                    explanation: "Le Rail Fence ne change pas les lettres, il change seulement leur ordre (transposition) en les lisant sur une grille."
                },
                {
                    question: "Avec une clé (profondeur) de 2, que devient 'BONJOUR' (version Grille) ?",
                    options: ["BOJO NUXR", "BNJRUO", "BJROONU", "BOJRNOU"],
                    correct: 0,
                    explanation: "Grille (P=2) : \nB O J O\nN U R X\nLecture Ligne 1: 'BOJO'. Lecture Ligne 2: 'NURX'. Résultat: 'BOJONURX' (ou 'BOJO NUXR' avec l'espace)."
                }
            ],
            "playfair": [
                {
                    question: "Pourquoi Playfair est-il plus sécurisé que César ?",
                    options: ["Il utilise une clé plus longue", "Il chiffre par paires (digrammes)", "Il utilise des nombres premiers", "Il est asymétrique"],
                    correct: 1,
                    explanation: "En chiffrant par paires, Playfair masque l'analyse de fréquence simple des lettres (ex: 'E' n'est plus toujours chiffré par la même lettre)."
                },
                {
                    question: "Dans une matrice 5x5, si 'A' et 'B' sont sur la même ligne, quelle règle s'applique ?",
                    options: ["Règle du Rectangle", "Règle de la Ligne (décaler à droite)", "Règle de la Colonne (décaler en bas)", "Règle du Doublon (ajouter 'X')"],
                    correct: 1,
                    explanation: "Les lettres sur la même ligne sont remplacées par les lettres immédiatement à leur droite (en bouclant si nécessaire)."
                }
            ],
            "des": [
                {
                    question: "Quelle est la structure au cœur de l'algorithme DES ?",
                    options: ["Un Réseau de Substitution-Permutation", "Un Réseau de Feistel", "Une Grille 5x5", "L'arithmétique modulaire"],
                    correct: 1,
                    explanation: "Le DES est l'exemple classique d'un Réseau de Feistel, qui divise le bloc en deux et applique 16 rounds de 'croisement'."
                },
                {
                    question: "Pourquoi le DES est-il considéré comme obsolète aujourd'hui ?",
                    options: ["Il est trop lent", "Sa clé de 56 bits est trop courte", "Il n'utilise pas de S-Boxes", "Il a été remplacé par Playfair"],
                    correct: 1,
                    explanation: "Une clé de 56 bits (2^56) est vulnérable aux attaques par force brute avec le matériel moderne."
                }
            ],
            "aes": [
                {
                    question: "Quelle est la taille de bloc fixe utilisée par l'AES ?",
                    options: ["64 bits", "128 bits", "256 bits", "Variable"],
                    correct: 1,
                    explanation: "L'AES (Rijndael) opère toujours sur des blocs de 128 bits, quelle que soit la taille de la clé (128, 192, ou 256 bits)."
                },
                {
                    question: "Quelle étape du round AES n'est PAS exécutée lors du tout dernier round ?",
                    options: ["SubBytes", "ShiftRows", "MixColumns", "AddRoundKey"],
                    correct: 2,
                    explanation: "L'étape MixColumns est omise lors du dernier round pour permettre au déchiffrement de fonctionner correctement."
                }
            ],
            "rsa": [
                {
                    question: "Sur quel problème mathématique difficile la sécurité du RSA repose-t-elle ?",
                    options: ["Le logarithme discret", "La factorisation de grands nombres premiers", "Le problème du sac à dos", "Le calcul des S-Boxes"],
                    correct: 1,
                    explanation: "Il est facile de multiplier deux grands nombres premiers (p, q) pour obtenir N, mais il est quasi-impossible de faire l'inverse."
                },
                {
                    question: "Comment le HTTPS (web sécurisé) utilise-t-il le RSA ?",
                    options: ["Il chiffre tout le trafic du site web avec RSA.", "Il l'utilise pour signer numériquement chaque paquet.", "Il l'utilise uniquement pour échanger une clé symétrique (AES) au début.", "Il ne l'utilise pas, il préfère DES."],
                    correct: 2,
                    explanation: "Le RSA est lent. Il n'est utilisé que pour la poignée de main initiale (KEM) afin de chiffrer et d'échanger une clé AES, qui est ensuite utilisée pour chiffrer la session."
                }
            ],
            "sha256": [
                {
                    question: "Quelle est la principale différence between le SHA-256 et l'AES ?",
                    options: ["Le SHA-256 est plus rapide.", "Le SHA-256 est symétrique.", "Le SHA-256 est une fonction de hachage (à sens unique).", "Le SHA-256 utilise une clé de 256 bits."],
                    correct: 2,
                    explanation: "L'AES est un chiffrement (réversible avec une clé), tandis que le SHA-256 est une fonction de hachage (non-réversible) utilisée pour l'intégrité."
                },
                {
                    question: "Si je change un seul caractère dans un fichier, que se passera-t-il avec son hash SHA-256 ?",
                    options: ["Le hash changera légèrement.", "Le hash sera complètement différent.", "Le hash restera le même.", "Le hash sera plus court."],
                    correct: 1,
                    explanation: "C'est 'l'effet d'avalanche'. Un changement minime en entrée produit une sortie (hash) radicalement différente."
                }
            ],
            "bcrypt": [
                {
                    question: "Pourquoi Bcrypt est-il meilleur que SHA-256 pour stocker les mots de passe ?",
                    options: ["Bcrypt est plus rapide que SHA-256.", "Bcrypt est intentionnellement lent (adaptatif).", "Bcrypt est réversible.", "Bcrypt produit un hash plus long."],
                    correct: 1,
                    explanation: "Bcrypt est conçu pour être lent grâce à un 'facteur de coût', ce qui rend les attaques par force brute des milliards de fois plus lentes que sur SHA-256."
                },
                {
                    question: "Qu'est-ce qu'un 'salt' (sel) et pourquoi Bcrypt l'utilise-t-il ?",
                    options: ["C'est un mot de passe secret supplémentaire.", "C'est une chaîne aléatoire ajoutée pour empêcher les 'rainbow tables'.", "C'est une partie de l'algorithme DES.", "C'est un autre nom pour la clé privée."],
                    correct: 1,
                    explanation: "Le 'salt' est une valeur aléatoire unique pour chaque utilisateur. Il garantit que deux utilisateurs avec le même mot de passe aient des hashs différents, rendant les dictionnaires de hashs pré-calculés (rainbow tables) inutiles."
                }
            ]
        }
    }
}