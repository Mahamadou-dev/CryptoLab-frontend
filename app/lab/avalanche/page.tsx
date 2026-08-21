"use client"

import { useEffect, useMemo, useState } from "react"
import { Navigation } from "@/components/navigation"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

/**
 * Effet avalanche : un bit change dans l'entree, environ la moitie des bits
 * de sortie basculent. Calcul entierement local (Web Crypto SubtleCrypto,
 * SHA-256) — aucune donnee n'est envoyee au backend, CLAUDE.md §5
 * ("calcul local d'abord").
 */

async function sha256Bits(text: string): Promise<string> {
    const data = new TextEncoder().encode(text)
    const digest = await crypto.subtle.digest("SHA-256", data)
    return Array.from(new Uint8Array(digest))
        .map((byte) => byte.toString(2).padStart(8, "0"))
        .join("")
}

/** Bascule le bit `index` (0 = bit de poids fort du premier octet) d'une chaine UTF-8. */
function flipBit(text: string, index: number): string {
    const bytes = new TextEncoder().encode(text)
    if (bytes.length === 0) return text
    const byteIndex = Math.floor(index / 8) % bytes.length
    const bitInByte = 7 - (index % 8)
    bytes[byteIndex] ^= 1 << bitInByte
    return new TextDecoder().decode(bytes)
}

export default function AvalanchePage() {
    const [text, setText] = useState("CryptoLab")
    const [bitsA, setBitsA] = useState("")
    const [bitsB, setBitsB] = useState("")
    const [flippedText, setFlippedText] = useState("")

    useEffect(() => {
        let cancelled = false
        const flipped = flipBit(text, 0)

        Promise.all([sha256Bits(text), sha256Bits(flipped)]).then(([a, b]) => {
            if (cancelled) return
            setBitsA(a)
            setBitsB(b)
            setFlippedText(flipped)
        })

        return () => {
            cancelled = true
        }
    }, [text])

    const { diffCount, diffRatio } = useMemo(() => {
        if (!bitsA || !bitsB || bitsA.length !== bitsB.length) {
            return { diffCount: 0, diffRatio: 0 }
        }
        let count = 0
        for (let i = 0; i < bitsA.length; i++) {
            if (bitsA[i] !== bitsB[i]) count++
        }
        return { diffCount: count, diffRatio: count / bitsA.length }
    }, [bitsA, bitsB])

    return (
        <main className="relative min-h-screen">
            <Navigation />

            <section className="mx-auto w-full max-w-4xl px-4 pt-32 pb-32 sm:px-6 lg:px-8">
                <h1 className="mb-4 text-4xl font-bold sm:text-5xl">
                    <span className="text-gradient">Effet avalanche</span>
                </h1>
                <p className="mb-8 max-w-2xl text-lg text-foreground-secondary">
                    Un bon hash cryptographique est chaotique : changer{" "}
                    <strong>un seul bit</strong> de l&apos;entree fait basculer environ la
                    moitie des bits de sortie, de facon imprevisible. C&apos;est l&apos;effet
                    avalanche — la propriete qui rend impossible de deviner comment une
                    petite modification du message affecte son empreinte SHA-256.
                </p>

                <Card className="glass mb-8 p-6">
                    <Label htmlFor="avalanche-text">Texte d&apos;entree</Label>
                    <Input
                        id="avalanche-text"
                        value={text}
                        onChange={(event) => setText(event.target.value)}
                        className="glass mt-2 font-mono"
                        placeholder="Tapez un texte..."
                    />
                    <p className="mt-2 font-mono text-xs text-foreground-tertiary">
                        Le premier bit du premier octet sera bascule automatiquement pour la
                        comparaison.
                    </p>
                </Card>

                {bitsA && bitsB && (
                    <>
                        <div className="glass mb-8 grid grid-cols-1 gap-6 rounded-2xl p-6 sm:grid-cols-3">
                            <Figure value={text.length > 0 ? 1 : 0} label="bit modifie en entree" />
                            <Figure
                                value={diffCount}
                                label={`bits differents sur ${bitsA.length} (SHA-256)`}
                                highlight
                            />
                            <Figure
                                value={`${(diffRatio * 100).toFixed(1)}%`}
                                label="taux de bits bascules (ideal : 50%)"
                            />
                        </div>

                        <BitGrid
                            title={`SHA-256("${text}")`}
                            bits={bitsA}
                            diffBits={bitsB}
                        />
                        <div className="mt-4" />
                        <BitGrid
                            title={`SHA-256("${flippedText}") — un bit d'entree bascule`}
                            bits={bitsB}
                            diffBits={bitsA}
                        />
                    </>
                )}
            </section>
        </main>
    )
}

function Figure({
    value,
    label,
    highlight = false,
}: {
    value: number | string
    label: string
    highlight?: boolean
}) {
    return (
        <div>
            <p
                className={`font-mono text-4xl font-bold ${
                    highlight ? "text-accent-secondary" : "text-accent-primary"
                }`}
            >
                {value}
            </p>
            <p className="mt-1 text-sm text-foreground-secondary">{label}</p>
        </div>
    )
}

/** Grille des 256 bits d'une empreinte, chaque bit different de l'autre empreinte en surbrillance. */
function BitGrid({
    title,
    bits,
    diffBits,
}: {
    title: string
    bits: string
    diffBits: string
}) {
    return (
        <Card className="glass p-6">
            <p className="mb-3 font-mono text-xs text-foreground-tertiary">{title}</p>
            <div
                className="grid grid-cols-16 gap-1"
                role="img"
                aria-label={`Representation binaire de l'empreinte : ${diffCountLabel(bits, diffBits)} bits differents de l'autre empreinte, sur ${bits.length}.`}
            >
                {bits.split("").map((bit, index) => {
                    const changed = diffBits[index] !== undefined && diffBits[index] !== bit
                    return (
                        <span
                            key={index}
                            className={`flex h-5 w-5 items-center justify-center rounded font-mono text-[10px] ${
                                changed
                                    ? "bg-danger/80 text-white"
                                    : "bg-surface-active text-foreground-tertiary"
                            }`}
                        >
                            {bit}
                        </span>
                    )
                })}
            </div>
        </Card>
    )
}

function diffCountLabel(a: string, b: string): number {
    let count = 0
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) count++
    }
    return count
}
