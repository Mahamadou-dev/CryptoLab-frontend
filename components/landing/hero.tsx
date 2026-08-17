"use client"

import dynamic from "next/dynamic"
import Link from "next/link"
import { motion, useReducedMotion } from "framer-motion"
import { ArrowRight, BookOpen, ChevronDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"

// La scene WebGL ne rend rien cote serveur et pese plusieurs centaines de
// kilo-octets : elle est chargee apres coup, une fois la page lisible.
const HeroCanvas = dynamic(
    () => import("@/components/3d/landing/hero-canvas").then((module) => module.HeroCanvas),
    { ssr: false },
)

const container = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } },
}

const rise = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as const } },
}

export function Hero() {
    const { user, loading } = useAuth()
    const reduceMotion = useReducedMotion()

    // Une fois connecte, le bouton principal mene au laboratoire ; sinon il mene
    // a l'inscription, qui est la porte d'entree reelle.
    const primary = user
        ? { href: "/simulations", label: "Ouvrir le laboratoire" }
        : { href: "/register", label: "Creer mon compte" }

    return (
        <section className="relative flex min-h-[92vh] items-center justify-center overflow-hidden">
            <HeroCanvas className="absolute inset-0 -z-10" />

            {/* Fondu vers le fond de page : la scene doit s'eteindre sous le
                texte, pas rivaliser avec lui. */}
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-[var(--background)]/70 via-transparent to-[var(--background)]"
            />

            <motion.div
                className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-6 text-center"
                variants={container}
                initial="hidden"
                animate="visible"
            >
                <motion.h1
                    variants={rise}
                    className="mb-6 text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl"
                >
                    <span className="text-gradient">CryptoLab</span>
                </motion.h1>

                <motion.p
                    variants={rise}
                    className="mb-4 max-w-2xl text-lg text-foreground-secondary sm:text-xl"
                >
                    Le laboratoire ou la cryptographie se voit. Chaque algorithme est trace pas a
                    pas, chaque octet transforme est montre, chaque resultat est verifie contre les
                    vecteurs officiels du NIST.
                </motion.p>

                <motion.p variants={rise} className="mb-10 font-mono text-xs text-foreground-tertiary">
                    AES · DES · RSA · SHA-256 · Vigenere · Playfair · Rail Fence · Transposition
                </motion.p>

                <motion.div variants={rise} className="flex flex-col gap-4 sm:flex-row">
                    <Link href={primary.href}>
                        <Button className="btn-gemini flex items-center" disabled={loading}>
                            {primary.label}
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </Link>
                    <Link href="/learn">
                        <Button
                            variant="outline"
                            className="glass flex items-center rounded-xl text-[var(--foreground)] backdrop-blur-md"
                        >
                            <BookOpen className="mr-2 h-5 w-5" /> Parcourir le cours
                        </Button>
                    </Link>
                </motion.div>

                {!user && !loading && (
                    <motion.p variants={rise} className="mt-6 text-xs text-foreground-tertiary">
                        Le cours et le laboratoire demandent un compte gratuit.
                    </motion.p>
                )}
            </motion.div>

            {!reduceMotion && (
                <motion.div
                    aria-hidden
                    className="absolute bottom-10 left-1/2 z-10 -translate-x-1/2"
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                >
                    <ChevronDown className="h-6 w-6 text-foreground-tertiary" />
                </motion.div>
            )}
        </section>
    )
}
