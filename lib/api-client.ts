// Fichier: lib/api-client.ts

// 1. DÉFINIR L'URL DE BASE

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

// --- Interfaces Pydantic (correspondent au backend) ---
// Note : Nous n'utilisons plus "EncryptionRequest" générique

// /api/classical/*
export interface CaesarInput {
    text: string
    shift: number
}
export interface KeyTextInput {
    text: string
    key: string
}

// /api/hash/*
export interface TextInput {
    text: string
}
export interface BcryptVerifyInput {
    text: string
    hashed_text: string
}

// /api/modern/*
export interface AesInput {
    text: string
    key: string
}
export interface AesDecryptInput {
    cipher_hex: string
    key: string
    nonce_hex: string
    tag_hex: string
}
export interface DesInput {
    text: string
    key: string
}
export interface DesDecryptInput {
    cipher_hex: string
    key: string
    iv_hex: string
}

// /api/asymmetric/*
export interface RsaEncryptInput {
    text: string
    public_key: string
}
export interface RsaDecryptInput {
    cipher_hex: string
    private_key: string
}

/**
 * Résultat d'une opération de chiffrement/déchiffrement/hachage.
 *
 * La forme exacte dépend de l'algorithme et de l'action (un `cipher` en clair
 * pour César, un `cipher_hex` + `nonce_hex` + `tag_hex` pour AES-GCM, un
 * `public_key`/`private_key` pour la génération de clés RSA…) : les
 * simulateurs ne lisent que les champs qui les concernent, d'où l'index
 * signature en complément des champs connus.
 */
export interface CryptoActionResult {
    cipher?: string
    plain?: string
    cipher_hex?: string
    nonce_hex?: string
    tag_hex?: string
    iv_hex?: string
    hash?: string
    match?: boolean
    public_key?: string
    private_key?: string
    final_result?: string
    [key: string]: unknown
}

/**
 * Trace d'une simulation pas à pas, telle que renvoyée par `/api/simulate/*`.
 * Le format précis (liste d'étapes, matrices, etc.) varie par algorithme ;
 * les visualisations 3D en dérivent leur propre lecture.
 */
export interface SimulationTrace {
    steps?: unknown[]
    [key: string]: unknown
}

// --- /api/algorithms (catalogue servi par le registre) ---

/** Ce qu'on a le droit de faire d'un algorithme, porté par la donnée. */
export type Maturity = "current" | "broken" | "educational"

export interface AlgorithmOperation {
    name: string
    method: string
    path: string
    summary: string
    /** Schéma JSON de l'entrée : de quoi construire un formulaire sans rien coder. */
    schema: Record<string, unknown> | null
}

export interface TestVector {
    operation: string
    inputs: Record<string, unknown>
    expected: Record<string, unknown>
    /** « NIST FIPS 180-4, exemple B.1 », « RFC 3602 §4 »… */
    source: string
}

export interface AlgorithmSummary {
    slug: string
    name: string
    family: string
    family_label: string
    summary: string
    maturity: Maturity
    difficulty: number
    year: number | null
    simulator: string | null
    aliases: string[]
    /** Nombre de vecteurs officiels rejoués par la CI à chaque commit. */
    vector_count: number
    vector_sources: string[]
    operations: AlgorithmOperation[]
}

export interface AlgorithmCatalog {
    count: number
    total_vectors: number
    families: { value: string; label: string; prefix: string }[]
    algorithms: AlgorithmSummary[]
}

/**
 * Enveloppe de réponse de l'API (phase 2).
 *
 * Toute route d'algorithme répond `{ok, data, error}`, et le code HTTP porte la
 * même information que `ok`. Auparavant, un échec de déchiffrement arrivait en
 * `200 OK` avec la chaîne « Erreur: … » dans le champ résultat : il fallait la
 * renifler, et un texte déchiffré contenant ce mot cassait le contrat.
 */
export interface ApiEnvelope<T> {
    ok: boolean
    data: T | null
    error: { code: string; message: string; details?: Record<string, unknown> } | null
}

/**
 * Erreur de l'API, portant le code métier stable en plus du statut HTTP.
 *
 * `code` vaut `decryption_failed`, `invalid_key`, `validation_error`… — c'est
 * lui qu'il faut tester, jamais le message, qui est traduisible.
 */
export class ApiError extends Error {
    readonly status: number
    readonly code: string
    readonly details: Record<string, unknown>

    constructor(message: string, status: number, code: string, details: Record<string, unknown> = {}) {
        super(message)
        this.name = "ApiError"
        this.status = status
        this.code = code
        this.details = details
    }
}

/**
 * Déballe une réponse : rend `data`, ou lève une `ApiError`.
 *
 * Tolère une réponse hors enveloppe pour ne pas casser sur une erreur émise par
 * l'infrastructure (502 d'un proxy, page d'erreur d'hébergeur) — qui n'a aucune
 * raison de connaître notre format.
 */
async function unwrap<T>(response: Response): Promise<T> {
    let body: unknown = null
    try {
        body = await response.json()
    } catch {
        // Corps vide ou non JSON : le statut suffit à décider.
    }

    const envelope = body as Partial<ApiEnvelope<T>> | null

    if (!response.ok || envelope?.ok === false) {
        const error = envelope?.error
        throw new ApiError(
            error?.message ?? `Le service a répondu ${response.status}.`,
            response.status,
            error?.code ?? "http_error",
            error?.details ?? {},
        )
    }

    // Réponse enveloppée : on rend le contenu. Sinon on rend le corps tel quel.
    return (envelope && "data" in envelope ? envelope.data : body) as T
}

/**
 * Client API mis à jour pour correspondre parfaitement au backend FastAPI
 */
export class CryptoAPIClient {
    private baseUrl: string

    constructor(baseUrl: string = API_BASE_URL) {
        this.baseUrl = baseUrl
    }

    /** Construit une URL propre, sans double barre oblique. */
    private url(endpoint: string): string {
        return `${this.baseUrl.replace(/\/$/, "")}${endpoint}`
    }

    private async post<T = unknown>(endpoint: string, body: unknown): Promise<T> {
        const response = await fetch(this.url(endpoint), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        })
        return unwrap<T>(response)
    }

    private async get<T = unknown>(endpoint: string): Promise<T> {
        return unwrap<T>(await fetch(this.url(endpoint)))
    }

    // --- Catalogue ---
    /**
     * Le catalogue servi par l'API : le frontend découvre ce que le backend
     * sait faire au lieu de le coder en dur. Un algorithme ajouté au registre
     * apparaît ici sans qu'une ligne de TypeScript ne change.
     */
    async listAlgorithms(params: { family?: string; q?: string } = {}) {
        const query = new URLSearchParams(
            Object.entries(params).filter(([, value]) => Boolean(value)) as [string, string][],
        ).toString()
        return this.get<AlgorithmCatalog>(`/api/algorithms${query ? `?${query}` : ""}`)
    }

    async getAlgorithm(slug: string) {
        return this.get<AlgorithmSummary & { vectors: TestVector[] }>(`/api/algorithms/${slug}`)
    }

    async caesarEncrypt(data: CaesarInput) {
        return this.post<CryptoActionResult>("/api/classical/caesar/encrypt", data)
    }
    async vigenereEncrypt(data: KeyTextInput) {
        return this.post<CryptoActionResult>("/api/classical/vigenere/encrypt", data)
    }
    async playfairEncrypt(data: KeyTextInput) {
        return this.post<CryptoActionResult>("/api/classical/playfair/encrypt", data)
    }
    /**
     * Rail Fence : le vrai chiffre en zigzag.
     * `shift` est le nombre de rails. Espaces et ponctuation sont conservés,
     * et l'aller-retour est exact.
     */
    async railfenceEncrypt(data: CaesarInput) {
        return this.post<CryptoActionResult>("/api/classical/railfence/encrypt", data)
    }
    /**
     * Transposition par colonnes : l'algorithme que la route `/railfence`
     * implémentait réellement avant la v2. Il a désormais son propre nom.
     */
    async columnarEncrypt(data: KeyTextInput) {
        return this.post<CryptoActionResult>("/api/classical/columnar/encrypt", data)
    }
    async columnarDecrypt(data: KeyTextInput) {
        return this.post<CryptoActionResult>("/api/classical/columnar/decrypt", data)
    }

    async caesarDecrypt(data: CaesarInput) {
        return this.post<CryptoActionResult>("/api/classical/caesar/decrypt", data)
    }
    async vigenereDecrypt(data: KeyTextInput) {
        return this.post<CryptoActionResult>("/api/classical/vigenere/decrypt", data)
    }
    async playfairDecrypt(data: KeyTextInput) {
        return this.post<CryptoActionResult>("/api/classical/playfair/decrypt", data)
    }
    async railfenceDecrypt(data: CaesarInput) {
        return this.post<CryptoActionResult>("/api/classical/railfence/decrypt", data)
    }


    // --- Méthodes "Hashing" ---
    async hashSha256(data: TextInput) {
        return this.post<CryptoActionResult>("/api/hash/sha256", data)
    }
    async hashBcrypt(data: TextInput) {
        return this.post<CryptoActionResult>("/api/hash/bcrypt", data)
    }
    async bcryptVerify(data: BcryptVerifyInput) {
        return this.post<CryptoActionResult>("/api/hash/bcrypt/verify", data)
    }

    // --- Méthodes "Modern Symmetric" ---
    async aesEncrypt(data: AesInput) {
        return this.post<CryptoActionResult>("/api/modern/aes/encrypt", data)
    }
    async aesDecrypt(data: AesDecryptInput) {
        return this.post<CryptoActionResult>("/api/modern/aes/decrypt", data)
    }
    async desEncrypt(data: DesInput) {
        return this.post<CryptoActionResult>("/api/modern/des/encrypt", data)
    }
    async desDecrypt(data: DesDecryptInput) {
        return this.post<CryptoActionResult>("/api/modern/des/decrypt", data)
    }

    // --- Méthodes "Asymmetric" ---
    async rsaGenerateKeys() {
        return this.get<CryptoActionResult>("/api/asymmetric/rsa/generate-keys")
    }
    async rsaEncrypt(data: RsaEncryptInput) {
        return this.post<CryptoActionResult>("/api/asymmetric/rsa/encrypt", data)
    }
    async rsaDecrypt(data: RsaDecryptInput) {
        return this.post<CryptoActionResult>("/api/asymmetric/rsa/decrypt", data)
    }

    // --- Méthodes "Simulation" ---
    async simulate(algo: string, data: Record<string, unknown>) {
        return this.post<SimulationTrace>(`/api/simulate/${algo}`, data)
    }
}

// Exporte une instance unique (singleton)
export const cryptoAPI = new CryptoAPIClient()