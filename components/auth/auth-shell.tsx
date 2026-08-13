"use client"

import Link from "next/link"
import { motion, useReducedMotion } from "framer-motion"
import { Lock } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * Cadre commun aux pages de connexion et d'inscription.
 *
 * Le decor est un mur d'octets en chasse fixe, volontairement en 2D : une scene
 * WebGL derriere un formulaire couterait des ressources sans rien expliquer.
 */
export function AuthShell({
    title,
    subtitle,
    children,
    footer,
}: {
    title: string
    subtitle: string
    children: React.ReactNode
    footer: React.ReactNode
}) {
    return (
        <main className="relative min-h-screen flex items-center justify-center px-4 py-16 overflow-hidden">
            <ByteWall />

            <motion.div
                className="relative z-10 w-full max-w-md"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
            >
                <Link
                    href="/"
                    className="flex items-center justify-center gap-2 font-bold text-xl mb-8"
                >
                    <Lock className="w-6 h-6 text-[var(--color-primary)]" />
                    <span className="text-gradient">CryptoLab</span>
                </Link>

                <div className="glass rounded-2xl p-8">
                    <h1 className="text-2xl font-bold mb-2">{title}</h1>
                    <p className="text-sm text-foreground-secondary mb-6">{subtitle}</p>
                    {children}
                </div>

                <div className="mt-6 text-center text-sm text-foreground-secondary">{footer}</div>
            </motion.div>
        </main>
    )
}

/** Grille d'octets hexadecimaux qui scintille doucement en fond. */
function ByteWall() {
    const reduceMotion = useReducedMotion()

    // Motif fixe et deterministe : un tirage aleatoire differerait entre le
    // rendu serveur et le rendu client, et provoquerait une erreur d'hydratation.
    const bytes = Array.from({ length: 240 }, (_, index) =>
        (((index * 37 + 11) % 256) | 0).toString(16).padStart(2, "0"),
    )

    return (
        <div
            aria-hidden
            className={cn(
                "pointer-events-none absolute inset-0 select-none",
                "flex flex-wrap content-center justify-center gap-x-3 gap-y-2",
                "font-mono text-xs opacity-[0.07] dark:opacity-[0.12]",
            )}
        >
            {bytes.map((value, index) => (
                <motion.span
                    key={index}
                    className="text-[var(--color-secondary)]"
                    animate={reduceMotion ? undefined : { opacity: [0.25, 1, 0.25] }}
                    transition={
                        reduceMotion
                            ? undefined
                            : {
                                  duration: 4,
                                  repeat: Infinity,
                                  ease: "easeInOut",
                                  delay: (index % 24) * 0.12,
                              }
                    }
                >
                    {value}
                </motion.span>
            ))}
        </div>
    )
}
