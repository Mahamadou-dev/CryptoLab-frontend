"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Lock } from "lucide-react"
import { cn } from "@/lib/utils"
import { ThemeLanguageSwitcher } from "@/components/theme-language-switcher"
import { useLanguage } from "@/lib/language-context"
import { useTranslation } from "@/lib/i18n"

export function Navigation() {
    const pathname = usePathname()
    const { language } = useLanguage()
    const t = useTranslation(language)

    const navLinks = [
        { href: "/", label: t("nav.home", "Accueil") }, // Ajout de valeurs par défaut
        { href: "/simulations", label: t("nav.simulations", "Simulations") },
        { href: "/learn", label: t("nav.learn", "Cours") },
        { href: "/about", label: t("nav.about", "À Propos") },
    ]

    return (
        <nav
            className={cn(
                "sticky top-0 z-[9999] w-full backdrop-blur-lg",
                /* Ces variables (surface, border-color) sont maintenant
                   contrôlées par vos classes de thème ! */
                "border-b border-[var(--border-color)] bg-[var(--surface)]",
                "transition-all duration-300"
            )}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 font-bold text-lg">
                    {/* REMARQUE : Utilise la variable générique --color-primary */}
                    <Lock className="w-6 h-6 text-[var(--color-primary)]" />
                    {/* .text-gradient utilise déjà --gradient-primary, c'est parfait. */}
                    <span className="text-gradient">
                        CryptoLab
                    </span>
                </Link>

                {/* Liens principaux */}
                <div className="hidden md:flex gap-1">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "px-4 py-2 rounded-lg transition-colors",
                                // REMARQUE : Utilise les variables génériques
                                pathname === link.href
                                    ? "text-[var(--color-secondary)] bg-[var(--surface-active)]"
                                    : "text-foreground-secondary hover:text-[var(--color-secondary)]",
                            )}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                    <Link
                        href="/simulations"
                        className={cn(
                            /* .btn-gemini utilise déjà --gradient-primary, c'est parfait. */
                            "btn-gemini hidden md:flex items-center text-sm"
                        )}
                    >
                        Labs
                    </Link>
                    <ThemeLanguageSwitcher />
                </div>
            </div>
        </nav>
    )
}