"use client"

import React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion, Variants } from "framer-motion"
import {
    ArrowRight, BookOpen, Zap, Eye,
    Smartphone, CreditCard, Share2, ShieldCheck
} from "lucide-react"
import { Hero } from "@/components/landing/hero"
import { Navigation } from "@/components/navigation"
import { useLanguage } from "@/lib/language-context"
import { useTranslation } from "@/lib/i18n"
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// --- Variantes d’animation ---
const sectionVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
}

// REMARQUE : Ajout des variantes manquantes
const cardContainerVariants: Variants = {
    hidden: { opacity: 1 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
}

const cardVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
}


export default function Home() {
    const { language } = useLanguage()
    const t = useTranslation(language)

    return (
        <main
            className={cn(
                "relative min-h-screen overflow-x-clip transition-colors duration-500",
                // REMARQUE : Suppression des gradients de fond ici.
                // Le fond est maintenant géré par le `body` dans votre CSS global
                // pour que le radial-gradient s'applique.
            )}
        >
            <Navigation />

            <Hero />


            {/* --- SECTION "PONT" (Comment ça marche ?) --- */}
            <motion.section
                className="relative z-10 py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={sectionVariants}
            >
                <div className="text-center mb-16">
                    <h2 className="text-4xl sm:text-5xl font-bold mb-4">
                        {t("features.title", "Comment Ça Marche ?")}
                    </h2>
                    <p className="text-lg text-foreground-secondary">
                        {t("features.subtitle", "Une approche en 3 points pour maîtriser la cryptographie.")}
                    </p>
                </div>
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-3 gap-8"
                    variants={cardContainerVariants} // Utilise la variante
                >
                    {[
                        {
                            icon: Zap,
                            title: t("features.card1.title", "1. Simuler"),
                            desc: t("features.card1.desc", "Testez 8+ algorithmes en temps réel. Chiffrez, déchiffrez et hachez avec vos propres données dans notre laboratoire interactif."),
                        },
                        {
                            icon: Eye,
                            title: t("features.card2.title", "2. Visualiser"),
                            desc: t("features.card2.desc", "Ne vous contentez pas de lire. Voyez comment les données sont transformées étape par étape avec nos visualisations 3D uniques."),
                        },
                        {
                            icon: BookOpen,
                            title: t("features.card3.title", "3. Apprendre"),
                            desc: t("features.card3.desc", "Suivez un mini-cours complet, de la théorie de César aux mathématiques de RSA, avec des quiz pour valider vos acquis."),
                        },
                    ].map((feature, index) => (
                        <motion.div key={index} variants={cardVariants}>
                            {/* REMARQUE : Classes simplifiées pour utiliser .glass de globals.css */}
                            <Card
                                className="glass p-8 h-full flex flex-col"
                            >
                                {/* REMARQUE : Utilisation de var(--color-violet) */}
                                <feature.icon className="w-12 h-12 text-[var(--color-violet)] mb-6" />
                                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                                <p className="text-foreground-secondary leading-relaxed">{feature.desc}</p>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>
            </motion.section>

            {/* --- SECTION: Introduction --- */}
            <motion.section
                className="relative z-10 py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={sectionVariants}
            >
                <div className="text-center">
                    {/* REMARQUE : Utilisation de .text-gradient */}
                    <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-gradient">
                        {t("intro.title", "Le Pilier de Notre Monde Numérique")}
                    </h2>
                    <p className="text-xl text-foreground-secondary leading-relaxed max-w-3xl mx-auto">
                        {t(
                            "intro.description",
                            "La cryptographie n'est pas seulement pour les espions. C'est l'art de protéger l'information, le gardien silencieux qui sécurise vos e-mails, vos achats en ligne et vos conversations privées. CryptoLab est conçu pour démystifier cette science essentielle.",
                        )}
                    </p>
                </div>
            </motion.section>

            {/* --- SECTION: Rôle Actuel --- */}
            <motion.section
                className="relative z-10 py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={sectionVariants}
            >
                <div className="text-center mb-16">
                    <h2 className="text-4xl sm:text-5xl font-bold mb-4">
                        {t("role.title", "Pourquoi la Cryptographie est Partout")}
                    </h2>
                    <p className="text-lg text-foreground-secondary">
                        {t("role.subtitle", "De vos messages à la finance mondiale, elle est la base de la confiance numérique.")}
                    </p>
                </div>
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-3 gap-8"
                    variants={cardContainerVariants}
                >
                    {[
                        {
                            icon: Smartphone,
                            title: t("role.card1.title", "Messagerie Privée"),
                            desc: t(
                                "role.card1.desc",
                                "Des algorithmes comme AES (que vous pouvez simuler ici) protègent vos conversations sur WhatsApp et Signal, garantissant que vous seul puissiez les lire.",
                            ),
                        },
                        {
                            icon: CreditCard,
                            title: t("role.card2.title", "Transactions Sécurisées"),
                            desc: t(
                                "role.card2.desc",
                                "Le petit 'cadenas' dans votre navigateur ? C'est RSA et AES qui travaillent ensemble pour protéger votre numéro de carte de crédit lors de vos achats.",
                            ),
                        },
                        {
                            icon: Share2,
                            title: t("role.card3.title", "L'Avenir du Web"),
                            desc: t(
                                "role.card3.desc",
                                "Des concepts comme le hachage (SHA-256) et les signatures (RSA) sont le moteur de la révolution Blockchain, des crypto-monnaies et du Web3.",
                            ),
                        },
                    ].map((feature, index) => (
                        <motion.div key={index} variants={cardVariants}>
                            {/* REMARQUE : Classes simplifiées pour utiliser .glass de globals.css */}
                            <Card
                                className="glass p-8 h-full flex flex-col"
                            >
                                {/* REMARQUE : Utilisation de var(--color-violet) */}
                                <feature.icon className="w-12 h-12 text-[var(--color-violet)] mb-6" />
                                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                                <p className="text-foreground-secondary leading-relaxed">{feature.desc}</p>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>
            </motion.section>

            {/* --- SECTION: Valeur & Tendance --- */}
            <motion.section
                className="relative z-10 py-24 px-4 sm:px-6 lg:px-8"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={sectionVariants}
            >
                <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="min-w-0">
                        <Badge
                            variant="secondary"
                            // REMARQUE : Utilisation de var(--color-magenta) comme accent secondaire
                            className="mb-4 bg-[var(--color-magenta)]/10 text-[var(--color-magenta)] border-[var(--color-magenta)]/20"
                        >
                            {t("value.badge", "Votre Avenir")}
                        </Badge>
                        <h2 className="text-4xl sm:text-5xl font-bold mb-6">
                            {t("value.title", "Une Compétence Qui Ouvre des Portes")}
                        </h2>
                        <p className="text-xl text-foreground-secondary leading-relaxed mb-6">
                            {t(
                                "value.p1",
                                "Le marché de la cybersécurité est en pleine explosion. Les entreprises s'arrachent les experts qui comprennent comment les données sont protégées, compromises et défendues.",
                            )}
                        </p>
                        <p className="text-xl text-foreground-secondary leading-relaxed">
                            {t(
                                "value.p2",
                                "Maîtriser la cryptographie n'est plus une option de niche ; c'est une compétence fondamentale pour tout développeur, ingénieur de sécurité ou architecte système.",
                            )}
                        </p>
                    </div>
                    <div className="flex items-center justify-center">
                        <div
                            className={cn(
                                "relative flex items-center justify-center w-64 h-64 rounded-full",
                                // REMARQUE : Utilisation des variables de couleur
                                "bg-gradient-to-br from-[var(--color-violet)]/20 to-[var(--color-rose)]/20",
                                "shadow-2xl shadow-[var(--color-rose)]/20"
                            )}
                        >
                            <ShieldCheck className="w-32 h-32 text-[var(--color-violet)] opacity-80" />
                            <div className="absolute inset-0 animate-pulse rounded-full border-4 border-[var(--color-violet)]/30" />
                        </div>
                    </div>
                </div>
            </motion.section>

            {/* --- SECTION: Guide Utilisateur --- */}
            <motion.section
                className="relative z-10 py-24 px-4 sm:px-6 lg:px-8"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={sectionVariants}
            >
                <div className="max-w-5xl mx-auto text-center">
                    <h2 className="text-4xl sm:text-5xl font-bold mb-6">
                        {t("guide.title", "Votre Parcours Commence Ici")}
                    </h2>
                    <p className="text-xl text-foreground-secondary mb-12">
                        {t("guide.subtitle", "Que vous préfériez la pratique ou la théorie, nous avons un chemin pour vous.")}
                    </p>
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 gap-8"
                        variants={cardContainerVariants}
                    >
                        <motion.div variants={cardVariants}>
                            <Link href="/simulations">
                                {/* REMARQUE : Classes simplifiées pour utiliser .glass */}
                                <Card
                                    className="glass p-8 rounded-2xl text-left h-full transition-all group"
                                >
                                    <Zap className="w-10 h-10 text-[var(--color-violet)] mb-4" />
                                    <h3 className="text-2xl font-bold mb-3">
                                        {t("guide.lab.title", "Plongez dans le Laboratoire")}
                                    </h3>
                                    <p className="text-foreground-secondary mb-4">
                                        {t(
                                            "guide.lab.desc",
                                            "Testez plus de 8 algorithmes en temps réel. Voyez l'impact de chaque clé, de chaque paramètre. L'apprentissage par la pratique.",
                                        )}
                                    </p>
                                    <span className="font-semibold text-[var(--color-violet)] flex items-center group-hover:gap-3 transition-all">
                                        {t("guide.lab.cta", "Ouvrir les Simulations")} <ArrowRight className="w-4 h-4 ml-2" />
                                    </span>
                                </Card>
                            </Link>
                        </motion.div>
                        <motion.div variants={cardVariants}>
                            <Link href="/learn">
                                {/* REMARQUE : Classes simplifiées pour utiliser .glass */}
                                <Card
                                    className="glass p-8 rounded-2xl text-left h-full transition-all group"
                                >
                                    {/* REMARQUE : Utilisation de var(--color-magenta) comme accent secondaire */}
                                    <BookOpen className="w-10 h-10 text-[var(--color-magenta)] mb-4" />
                                    <h3 className="text-2xl font-bold mb-3">
                                        {t("guide.learn.title", "Suivez le Cours Complet")}
                                    </h3>
                                    <p className="text-foreground-secondary mb-4">
                                        {t(
                                            "guide.learn.desc",
                                            "Un mini-cours universitaire, de la théorie de César aux mathématiques de RSA, avec des quiz pour tester vos connaissances.",
                                        )}
                                    </p>
                                    <span className="font-semibold text-[var(--color-magenta)] flex items-center group-hover:gap-3 transition-all">
                                        {t("guide.learn.cta", "Commencer à Apprendre")} <ArrowRight className="w-4 h-4 ml-2" />
                                    </span>
                                </Card>
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
            </motion.section>

            {/* Footer */}
            <footer
                className="relative z-10 border-t py-8 px-4 sm:px-6 lg:px-8 border-[var(--border-color)]"
            >
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                        <div>
                            <h3 className="font-bold text-lg mb-4">{t("hero.title", "CryptoLab")}</h3>
                            <p className="text-foreground-secondary">
                                {t("footer.desc", "Plateforme d'éducation cryptographique interactive")}
                            </p>
                        </div>
                        <div>
                            <h3 className="font-bold mb-4">{t("footer.explore", "Explorer")}</h3>
                            <ul className="space-y-2 text-foreground-secondary">
                                <li>
                                    {/* REMARQUE : Hover de lien mis à jour */}
                                    <Link href="/simulations" className="hover:text-[var(--color-rose)] transition-colors">
                                        {t("nav.simulations")}
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/learn" className="hover:text-[var(--color-rose)] transition-colors">
                                        {t("nav.learn")}
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/about" className="hover:text-[var(--color-rose)] transition-colors">
                                        {t("nav.about")}
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-bold mb-4">{t("footer.connect", "Connexion")}</h3>
                            <p className="text-foreground-secondary">
                                {t("footer.follow", "Suivez-nous pour les mises à jour")}
                            </p>
                        </div>
                    </div>
                    <div
                        className="text-center text-sm text-foreground-tertiary pt-8 border-t border-[var(--border-color)]"
                    >
                        © {new Date().getFullYear()} CryptoLab. {t("footer.rights", "Tous droits réservés.")}
                        <p> {t("footer.by")} <a href='https://gremah.vercel.app' target='_blank' className="text-gradient" >GremahTech</a></p>
                    </div>
                </div>
            </footer>
        </main>
    )
}