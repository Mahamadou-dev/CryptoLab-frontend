"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { AlertTriangle, ArrowRight, BookOpen, CheckCircle2, ShieldCheck } from "lucide-react"

import { Navigation } from "@/components/navigation"
import { Card } from "@/components/ui/card"
import { cryptoAPI, type AlgorithmCatalog, type AlgorithmSummary } from "@/lib/api-client"

/**
 * Catalogue public des algorithmes.
 *
 * Page volontairement ouverte, alors que le cours et le laboratoire demandent
 * un compte : c'est elle qui donne la raison de s'inscrire. Elle affiche ce que
 * le backend sait faire *et* ce qu'il sait prouver — le nombre de vecteurs
 * officiels rejoues a chaque commit, et leur provenance.
 *
 * Rien n'y est code en dur : tout vient de `/api/algorithms`, genere par le
 * registre. Un algorithme ajoute au catalogue apparait ici sans qu'une ligne de
 * TypeScript ne change.
 */
export default function AlgorithmsPage() {
    const [catalog, setCatalog] = useState<AlgorithmCatalog | null>(null)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        let cancelled = false

        cryptoAPI
            .listAlgorithms()
            .then((data) => {
                if (!cancelled) setCatalog(data)
            })
            .catch(() => {
                if (!cancelled) {
                    setError(
                        "Le catalogue est momentanement injoignable. L'API se reveille peut-etre.",
                    )
                }
            })

        return () => {
            cancelled = true
        }
    }, [])

    return (
        <main className="relative min-h-screen">
            <Navigation />

            <section className="mx-auto w-full max-w-7xl px-4 pt-32 pb-16 sm:px-6 lg:px-8">
                <h1 className="mb-4 text-4xl font-bold sm:text-5xl">
                    <span className="text-gradient">Le catalogue</span>
                </h1>
                <p className="max-w-3xl text-lg text-foreground-secondary">
                    Chaque algorithme est implemente pour etre lu et trace, jamais pour proteger de
                    vraies donnees. Ce qui suit n&apos;est pas une liste de promesses : c&apos;est ce
                    que la CI verifie a chaque commit, contre les vecteurs officiels du NIST, des RFC
                    et des references historiques.
                </p>

                {catalog && <ProofBanner catalog={catalog} />}

                {error && (
                    <p role="alert" className="glass mt-8 rounded-xl p-4 text-foreground-secondary">
                        {error}
                    </p>
                )}

                {!catalog && !error && (
                    <p className="mt-8 font-mono text-sm text-foreground-tertiary">
                        Chargement du catalogue...
                    </p>
                )}
            </section>

            {catalog && (
                <section className="mx-auto w-full max-w-7xl px-4 pb-32 sm:px-6 lg:px-8">
                    {catalog.families.map((family) => {
                        const members = catalog.algorithms.filter(
                            (algorithm) => algorithm.family === family.value,
                        )
                        if (members.length === 0) return null

                        return (
                            <div key={family.value} className="mb-16">
                                <h2 className="mb-1 text-2xl font-bold">{family.label}</h2>
                                <p className="mb-6 font-mono text-xs text-foreground-tertiary">
                                    {family.prefix}
                                </p>

                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                                    {members.map((algorithm, index) => (
                                        <motion.div
                                            key={algorithm.slug}
                                            initial={{ opacity: 0, y: 16 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.35, delay: index * 0.05 }}
                                        >
                                            <AlgorithmCard algorithm={algorithm} />
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        )
                    })}
                </section>
            )}
        </main>
    )
}

/** Le chiffre qui porte l'argument : n algorithmes, m vecteurs officiels. */
function ProofBanner({ catalog }: { catalog: AlgorithmCatalog }) {
    const sources = new Set(catalog.algorithms.flatMap((algorithm) => algorithm.vector_sources))

    return (
        <div className="glass mt-10 grid grid-cols-1 gap-6 rounded-2xl p-6 sm:grid-cols-3">
            <Figure value={catalog.count} label="algorithmes exposes" />
            <Figure
                value={catalog.total_vectors}
                label="vecteurs officiels rejoues a chaque commit"
                highlight
            />
            <Figure value={sources.size} label="sources de reference distinctes" />
        </div>
    )
}

function Figure({
    value,
    label,
    highlight = false,
}: {
    value: number
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

/**
 * Etiquette de maturite.
 *
 * CryptoLab enseigne autant par les algorithmes casses que par les surs. La
 * distinction est portee par la donnee, pas par un paragraphe d'article que
 * personne ne lit — et elle est affichee sur la carte, pas enfouie.
 */
const MATURITY: Record<string, { label: string; icon: typeof ShieldCheck; className: string }> = {
    current: {
        label: "En service aujourd'hui",
        icon: ShieldCheck,
        className: "text-accent-primary",
    },
    broken: {
        label: "Casse — valeur historique",
        icon: AlertTriangle,
        className: "text-accent-secondary",
    },
    educational: {
        label: "Implementation pedagogique",
        icon: BookOpen,
        className: "text-foreground-tertiary",
    },
}

function AlgorithmCard({ algorithm }: { algorithm: AlgorithmSummary }) {
    const maturity = MATURITY[algorithm.maturity] ?? MATURITY.educational
    const MaturityIcon = maturity.icon

    return (
        <Card className="glass flex h-full flex-col p-6">
            <div className="mb-3 flex items-start justify-between gap-3">
                <h3 className="text-xl font-bold">{algorithm.name}</h3>
                {algorithm.year !== null && (
                    <span className="shrink-0 font-mono text-xs text-foreground-tertiary">
                        {algorithm.year < 0
                            ? `${Math.abs(algorithm.year)} av. J.-C.`
                            : algorithm.year}
                    </span>
                )}
            </div>

            <p className="mb-4 flex-1 text-sm leading-relaxed text-foreground-secondary">
                {algorithm.summary}
            </p>

            <div className={`mb-3 flex items-center gap-2 text-xs ${maturity.className}`}>
                <MaturityIcon className="h-4 w-4 shrink-0" />
                {maturity.label}
            </div>

            {algorithm.vector_count > 0 ? (
                <div className="mb-3">
                    <p className="flex items-center gap-2 text-xs text-foreground-secondary">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-accent-primary" />
                        Valide contre {algorithm.vector_count} vecteur
                        {algorithm.vector_count > 1 ? "s" : ""} officiel
                        {algorithm.vector_count > 1 ? "s" : ""}
                    </p>
                    <ul className="mt-2 space-y-1 pl-6">
                        {algorithm.vector_sources.map((source) => (
                            <li
                                key={source}
                                className="font-mono text-[11px] text-foreground-tertiary"
                            >
                                {source}
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                // Dire pourquoi, plutot que d'afficher un zero qui ressemble a un oubli.
                <p className="mb-3 text-xs text-foreground-tertiary">
                    Sortie non deterministe (nonce ou IV tire au hasard) : verifie par aller-retour
                    et par le simulateur pas a pas.
                </p>
            )}

            {algorithm.simulator && (
                <Link
                    href={`/simulations/${algorithm.simulator}`}
                    className="group mt-auto flex items-center gap-2 text-sm font-semibold text-accent-secondary"
                >
                    Ouvrir le simulateur
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
            )}
        </Card>
    )
}
