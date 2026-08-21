"use client"

import { useMemo, useState } from "react"
import { Navigation } from "@/components/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

/**
 * CSPRNG (crypto.getRandomValues) contre Math.random() : les deux paraissent
 * uniformes a l'oeil sur un petit echantillon, mais Math.random() n'est pas
 * concu pour resister a un adversaire (implementation V8 : PRNG xorshift128+,
 * predictible a partir de quelques sorties observees). getRandomValues()
 * s'appuie sur le generateur cryptographique du systeme d'exploitation.
 *
 * 100% frontend : aucun appel au backend.
 */

const BUCKET_COUNT = 16
const SAMPLE_SIZE = 5_000

function sampleMathRandom(count: number): number[] {
    const buckets = new Array(BUCKET_COUNT).fill(0)
    for (let i = 0; i < count; i++) {
        const bucket = Math.floor(Math.random() * BUCKET_COUNT)
        buckets[bucket]++
    }
    return buckets
}

function sampleCrypto(count: number): number[] {
    const buckets = new Array(BUCKET_COUNT).fill(0)
    const bytes = new Uint8Array(count)
    crypto.getRandomValues(bytes)
    for (let i = 0; i < count; i++) {
        // 256 / 16 = 16 valeurs d'octet par case, repartition exacte.
        buckets[Math.floor(bytes[i] / 16)]++
    }
    return buckets
}

/** Ecart-type des occurrences par case : plus il est bas, plus la repartition est uniforme. */
function stdDev(buckets: number[]): number {
    const mean = buckets.reduce((a, b) => a + b, 0) / buckets.length
    const variance =
        buckets.reduce((total, value) => total + (value - mean) ** 2, 0) / buckets.length
    return Math.sqrt(variance)
}

export default function EntropyPage() {
    const [mathBuckets, setMathBuckets] = useState<number[] | null>(null)
    const [cryptoBuckets, setCryptoBuckets] = useState<number[] | null>(null)

    const runSample = () => {
        setMathBuckets(sampleMathRandom(SAMPLE_SIZE))
        setCryptoBuckets(sampleCrypto(SAMPLE_SIZE))
    }

    const maxCount = useMemo(() => {
        if (!mathBuckets || !cryptoBuckets) return 1
        return Math.max(...mathBuckets, ...cryptoBuckets, 1)
    }, [mathBuckets, cryptoBuckets])

    return (
        <main className="relative min-h-screen">
            <Navigation />

            <section className="mx-auto w-full max-w-4xl px-4 pt-32 pb-32 sm:px-6 lg:px-8">
                <h1 className="mb-4 text-4xl font-bold sm:text-5xl">
                    <span className="text-gradient">CSPRNG contre Math.random()</span>
                </h1>
                <p className="mb-8 max-w-2xl text-lg text-foreground-secondary">
                    Les deux generateurs produisent une repartition qui parait uniforme sur
                    un grand echantillon — la difference n&apos;est pas dans la distribution
                    visible, mais dans la <strong>predictibilite</strong>.{" "}
                    <code className="font-mono text-sm">Math.random()</code> n&apos;offre
                    aucune garantie cryptographique : son etat interne peut etre reconstruit
                    a partir de quelques sorties. {" "}
                    <code className="font-mono text-sm">crypto.getRandomValues()</code> puise
                    dans le generateur cryptographique du systeme d&apos;exploitation, concu
                    pour resister a cette reconstruction.
                </p>

                <Button onClick={runSample} className="btn-gemini mb-8">
                    Tirer {SAMPLE_SIZE.toLocaleString("fr-FR")} valeurs
                </Button>

                {mathBuckets && cryptoBuckets && (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <Histogram
                            title="Math.random()"
                            buckets={mathBuckets}
                            maxCount={maxCount}
                            stdDevValue={stdDev(mathBuckets)}
                        />
                        <Histogram
                            title="crypto.getRandomValues()"
                            buckets={cryptoBuckets}
                            maxCount={maxCount}
                            stdDevValue={stdDev(cryptoBuckets)}
                            highlight
                        />
                    </div>
                )}

                <p className="mt-8 text-sm text-foreground-tertiary">
                    L&apos;ecart-type entre cases mesure seulement l&apos;uniformite de cet
                    echantillon — les deux generateurs le reussissent. Ce que ce graphique ne
                    peut pas montrer, precisement parce que c&apos;est le point : un
                    attaquant qui observe la sortie de <code>Math.random()</code> peut en
                    deduire les tirages suivants (utilise par V8, pas concu pour resister a
                    l&apos;analyse) ; il ne le peut pas avec un CSPRNG.
                </p>
            </section>
        </main>
    )
}

function Histogram({
    title,
    buckets,
    maxCount,
    stdDevValue,
    highlight = false,
}: {
    title: string
    buckets: number[]
    maxCount: number
    stdDevValue: number
    highlight?: boolean
}) {
    return (
        <Card className="glass p-6">
            <p className="mb-1 font-mono text-sm font-semibold">{title}</p>
            <p className="mb-4 font-mono text-xs text-foreground-tertiary">
                ecart-type entre cases : {stdDevValue.toFixed(1)}
            </p>
            <div
                className="flex h-40 items-end gap-1"
                role="img"
                aria-label={`Histogramme de repartition sur ${buckets.length} cases pour ${title} : ${buckets.join(", ")}`}
            >
                {buckets.map((count, index) => (
                    <div
                        key={index}
                        className={`flex-1 rounded-t ${
                            highlight ? "bg-accent-secondary" : "bg-accent-primary"
                        }`}
                        style={{ height: `${Math.max((count / maxCount) * 100, 2)}%` }}
                        title={`Case ${index} : ${count}`}
                    />
                ))}
            </div>
        </Card>
    )
}
