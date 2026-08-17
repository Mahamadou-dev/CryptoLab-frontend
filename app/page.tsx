"use client"

import dynamic from "next/dynamic"
import Link from "next/link"
import { motion, type Variants } from "framer-motion"
import {
    ArrowRight,
    BookOpen,
    CreditCard,
    Eye,
    Share2,
    ShieldCheck,
    Smartphone,
    Zap,
} from "lucide-react"

import { Hero } from "@/components/landing/hero"
import { Navigation } from "@/components/navigation"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/lib/language-context"
import { useTranslation } from "@/lib/i18n"

/**
 * Page d'accueil.
 *
 * Une seule scene WebGL est montee ici, fixee derriere tout le document. Elle
 * n'est jamais demontee : c'est la camera qui traverse la chambre forte au fil
 * du defilement, ce qui evite de reconstruire le contexte WebGL a chaque
 * section et donne l'impression d'un espace continu.
 *
 * Le contenu, lui, reste du HTML pose par-dessus. Modeliser les titres en 3D
 * aurait rendu la page invisible aux moteurs de recherche et aux lecteurs
 * d'ecran, et illisible sur petit ecran.
 */

// La scene ne rend rien cote serveur et pese plusieurs centaines de kilo-octets :
// elle est chargee apres coup, une fois la page lisible.
const VaultScene = dynamic(
    () => import("@/components/3d/landing/vault-scene").then((module) => module.VaultScene),
    { ssr: false },
)

const sectionVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
}

const cardContainerVariants: Variants = {
    hidden: { opacity: 1 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const cardVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
}

export default function Home() {
    const { language } = useLanguage()
    const t = useTranslation(language)

    return (
        <main className="relative min-h-screen overflow-x-clip">
            {/*
                `fixed` et non `absolute` : la scene occupe l'ecran, pas le
                document. C'est ce qui permet a la camera de suivre le
                defilement sans que le canvas ne mesure 8000 pixels de haut.
            */}
            <VaultScene className="fixed inset-0 -z-10 h-screen w-screen" />

            {/*
                Voile de lisibilite. Sans lui, le texte passerait par-dessus les
                zones claires de la scene et deviendrait illisible par endroits.
                Il s'epaissit vers le bas, la ou le contenu est le plus dense.
            */}
            <div
                aria-hidden
                className="pointer-events-none fixed inset-0 -z-10 bg-gradient-to-b from-background/30 via-background/70 to-background/90"
            />

            <Navigation />

            <Hero />

            {/* --- Comment ca marche --- */}
            <motion.section
                className="relative z-10 mx-auto w-full max-w-7xl px-4 py-32 sm:px-6 lg:px-8"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={sectionVariants}
            >
                <div className="mb-16 text-center">
                    <h2 className="mb-4 text-4xl font-bold sm:text-5xl">
                        {t("features.title", "Comment Ça Marche ?")}
                    </h2>
                    <p className="text-lg text-foreground-secondary">
                        {t("features.subtitle", "Une approche en 3 points pour maîtriser la cryptographie.")}
                    </p>
                </div>

                <motion.div
                    className="grid grid-cols-1 gap-8 md:grid-cols-3"
                    variants={cardContainerVariants}
                >
                    {[
                        {
                            icon: Zap,
                            title: t("features.card1.title", "1. Simuler"),
                            desc: t(
                                "features.card1.desc",
                                "Testez 8+ algorithmes en temps réel. Chiffrez, déchiffrez et hachez avec vos propres données dans notre laboratoire interactif.",
                            ),
                        },
                        {
                            icon: Eye,
                            title: t("features.card2.title", "2. Visualiser"),
                            desc: t(
                                "features.card2.desc",
                                "Ne vous contentez pas de lire. Voyez comment les données sont transformées étape par étape avec nos visualisations 3D uniques.",
                            ),
                        },
                        {
                            icon: BookOpen,
                            title: t("features.card3.title", "3. Apprendre"),
                            desc: t(
                                "features.card3.desc",
                                "Suivez un mini-cours complet, de la théorie de César aux mathématiques de RSA, avec des quiz pour valider vos acquis.",
                            ),
                        },
                    ].map((feature) => (
                        <motion.div key={feature.title} variants={cardVariants}>
                            <Card className="glass flex h-full flex-col p-8">
                                <feature.icon className="mb-6 h-12 w-12 text-accent-primary" />
                                <h3 className="mb-3 text-2xl font-bold">{feature.title}</h3>
                                <p className="leading-relaxed text-foreground-secondary">
                                    {feature.desc}
                                </p>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>
            </motion.section>

            {/* --- Introduction --- */}
            <motion.section
                className="relative z-10 mx-auto w-full max-w-5xl px-4 py-32 sm:px-6 lg:px-8"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={sectionVariants}
            >
                <div className="text-center">
                    <h2 className="text-gradient mb-6 text-4xl font-bold sm:text-5xl">
                        {t("intro.title", "Le Pilier de Notre Monde Numérique")}
                    </h2>
                    <p className="mx-auto max-w-3xl text-xl leading-relaxed text-foreground-secondary">
                        {t(
                            "intro.description",
                            "La cryptographie n'est pas seulement pour les espions. C'est l'art de protéger l'information, le gardien silencieux qui sécurise vos e-mails, vos achats en ligne et vos conversations privées. CryptoLab est conçu pour démystifier cette science essentielle.",
                        )}
                    </p>
                </div>
            </motion.section>

            {/* --- Role actuel --- */}
            <motion.section
                className="relative z-10 mx-auto w-full max-w-7xl px-4 py-32 sm:px-6 lg:px-8"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={sectionVariants}
            >
                <div className="mb-16 text-center">
                    <h2 className="mb-4 text-4xl font-bold sm:text-5xl">
                        {t("role.title", "Pourquoi la Cryptographie est Partout")}
                    </h2>
                    <p className="text-lg text-foreground-secondary">
                        {t("role.subtitle", "De vos messages à la finance mondiale, elle est la base de la confiance numérique.")}
                    </p>
                </div>

                <motion.div
                    className="grid grid-cols-1 gap-8 md:grid-cols-3"
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
                    ].map((feature) => (
                        <motion.div key={feature.title} variants={cardVariants}>
                            <Card className="glass flex h-full flex-col p-8">
                                <feature.icon className="mb-6 h-12 w-12 text-accent-primary" />
                                <h3 className="mb-3 text-2xl font-bold">{feature.title}</h3>
                                <p className="leading-relaxed text-foreground-secondary">
                                    {feature.desc}
                                </p>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>
            </motion.section>

            {/* --- Valeur --- */}
            <motion.section
                className="relative z-10 px-4 py-32 sm:px-6 lg:px-8"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={sectionVariants}
            >
                <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-16 lg:grid-cols-2">
                    <div className="min-w-0">
                        <Badge
                            variant="secondary"
                            className="mb-4 border-accent-secondary/20 bg-accent-secondary/10 text-accent-secondary"
                        >
                            {t("value.badge", "Votre Avenir")}
                        </Badge>
                        <h2 className="mb-6 text-4xl font-bold sm:text-5xl">
                            {t("value.title", "Une Compétence Qui Ouvre des Portes")}
                        </h2>
                        <p className="mb-6 text-xl leading-relaxed text-foreground-secondary">
                            {t(
                                "value.p1",
                                "Le marché de la cybersécurité est en pleine explosion. Les entreprises s'arrachent les experts qui comprennent comment les données sont protégées, compromises et défendues.",
                            )}
                        </p>
                        <p className="text-xl leading-relaxed text-foreground-secondary">
                            {t(
                                "value.p2",
                                "Maîtriser la cryptographie n'est plus une option de niche ; c'est une compétence fondamentale pour tout développeur, ingénieur de sécurité ou architecte système.",
                            )}
                        </p>
                    </div>

                    <div className="flex items-center justify-center">
                        <div className="glass relative flex h-64 w-64 items-center justify-center rounded-full">
                            <ShieldCheck className="h-32 w-32 text-accent-primary opacity-80" />
                        </div>
                    </div>
                </div>
            </motion.section>

            {/* --- Guide --- */}
            <motion.section
                className="relative z-10 px-4 py-32 sm:px-6 lg:px-8"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={sectionVariants}
            >
                <div className="mx-auto max-w-5xl text-center">
                    <h2 className="mb-6 text-4xl font-bold sm:text-5xl">
                        {t("guide.title", "Votre Parcours Commence Ici")}
                    </h2>
                    <p className="mb-12 text-xl text-foreground-secondary">
                        {t("guide.subtitle", "Que vous préfériez la pratique ou la théorie, nous avons un chemin pour vous.")}
                    </p>

                    <motion.div
                        className="grid grid-cols-1 gap-8 md:grid-cols-2"
                        variants={cardContainerVariants}
                    >
                        <motion.div variants={cardVariants}>
                            <Link href="/simulations">
                                <Card className="glass group h-full rounded-2xl p-8 text-left">
                                    <Zap className="mb-4 h-10 w-10 text-accent-primary" />
                                    <h3 className="mb-3 text-2xl font-bold">
                                        {t("guide.lab.title", "Plongez dans le Laboratoire")}
                                    </h3>
                                    <p className="mb-4 text-foreground-secondary">
                                        {t(
                                            "guide.lab.desc",
                                            "Testez plus de 8 algorithmes en temps réel. Voyez l'impact de chaque clé, de chaque paramètre. L'apprentissage par la pratique.",
                                        )}
                                    </p>
                                    <span className="flex items-center font-semibold text-accent-primary transition-all group-hover:gap-3">
                                        {t("guide.lab.cta", "Ouvrir les Simulations")}
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </span>
                                </Card>
                            </Link>
                        </motion.div>

                        <motion.div variants={cardVariants}>
                            <Link href="/learn">
                                <Card className="glass group h-full rounded-2xl p-8 text-left">
                                    <BookOpen className="mb-4 h-10 w-10 text-accent-secondary" />
                                    <h3 className="mb-3 text-2xl font-bold">
                                        {t("guide.learn.title", "Suivez le Cours Complet")}
                                    </h3>
                                    <p className="mb-4 text-foreground-secondary">
                                        {t(
                                            "guide.learn.desc",
                                            "Un mini-cours universitaire, de la théorie de César aux mathématiques de RSA, avec des quiz pour tester vos connaissances.",
                                        )}
                                    </p>
                                    <span className="flex items-center font-semibold text-accent-secondary transition-all group-hover:gap-3">
                                        {t("guide.learn.cta", "Commencer à Apprendre")}
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </span>
                                </Card>
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
            </motion.section>

            {/* --- Pied de page --- */}
            <footer className="relative z-10 border-t border-[var(--border-color)] bg-background/60 px-4 py-8 backdrop-blur-xl sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-3">
                        <div>
                            <h3 className="mb-4 text-lg font-bold">{t("hero.title", "CryptoLab")}</h3>
                            <p className="text-foreground-secondary">
                                {t("footer.desc", "Plateforme d'éducation cryptographique interactive")}
                            </p>
                        </div>
                        <div>
                            <h3 className="mb-4 font-bold">{t("footer.explore", "Explorer")}</h3>
                            <ul className="space-y-2 text-foreground-secondary">
                                <li>
                                    <Link href="/simulations" className="transition-colors hover:text-accent-secondary">
                                        {t("nav.simulations")}
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/learn" className="transition-colors hover:text-accent-secondary">
                                        {t("nav.learn")}
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/about" className="transition-colors hover:text-accent-secondary">
                                        {t("nav.about")}
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="mb-4 font-bold">{t("footer.connect", "Connexion")}</h3>
                            <p className="text-foreground-secondary">
                                {t("footer.follow", "Suivez-nous pour les mises à jour")}
                            </p>
                        </div>
                    </div>

                    <div className="border-t border-[var(--border-color)] pt-8 text-center text-sm text-foreground-tertiary">
                        © {new Date().getFullYear()} CryptoLab. {t("footer.rights", "Tous droits réservés.")}
                        <p>
                            {t("footer.by")}{" "}
                            <a
                                href="https://gremah.vercel.app"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gradient"
                            >
                                GremahTech
                            </a>
                        </p>
                    </div>
                </div>
            </footer>
        </main>
    )
}
