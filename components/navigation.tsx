"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Lock, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { ThemeLanguageSwitcher } from "@/components/theme-language-switcher"
import { UserMenu } from "@/components/auth/user-menu"
import { useLanguage } from "@/lib/language-context"
import { useTranslation } from "@/lib/i18n"

export function Navigation() {
    const pathname = usePathname()
    const { language } = useLanguage()
    const t = useTranslation(language)
    const [mobileOpen, setMobileOpen] = useState(false)
    // Reinitialise a chaque changement de route, sans passer par un effet
    // (pattern "adjust state during render" recommande par React) : une
    // page ne devrait jamais rester coincee ouverte apres une navigation.
    const [lastPathname, setLastPathname] = useState(pathname)
    if (pathname !== lastPathname) {
        setLastPathname(pathname)
        setMobileOpen(false)
    }

    const navLinks = [
        { href: "/", label: t("nav.home", "Accueil") }, // Ajout de valeurs par défaut
        { href: "/algorithms", label: t("nav.algorithms", "Catalogue") },
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
                    <UserMenu />

                    {/* Bascule mobile : sans elle, les liens ci-dessus (caches
                        sous `md:`) sont totalement inaccessibles en dessous de
                        768px. */}
                    <button
                        type="button"
                        aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
                        aria-expanded={mobileOpen}
                        aria-controls="mobile-nav-panel"
                        onClick={() => setMobileOpen((open) => !open)}
                        className={cn(
                            "flex h-9 w-9 items-center justify-center rounded-lg md:hidden",
                            "border border-[var(--border-color)] hover:bg-[var(--surface-hover)] transition-colors",
                        )}
                    >
                        {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                    </button>
                </div>
            </div>

            {/* Panneau mobile : pas de verrou de scroll (voir le bug du menu
                compte, corrige le 22 aout) — un panneau qui pousse le contenu
                plutot qu'une superposition modale. */}
            {mobileOpen && (
                <div
                    id="mobile-nav-panel"
                    className={cn(
                        "flex flex-col gap-1 border-t border-[var(--border-color)] p-4 md:hidden",
                        "bg-[var(--surface)]",
                    )}
                >
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "rounded-lg px-4 py-3 text-sm transition-colors",
                                pathname === link.href
                                    ? "text-[var(--color-secondary)] bg-[var(--surface-active)]"
                                    : "text-foreground-secondary hover:text-[var(--color-secondary)]",
                            )}
                        >
                            {link.label}
                        </Link>
                    ))}
                    <Link
                        href="/simulations"
                        className="btn-gemini mt-2 flex items-center justify-center text-sm"
                    >
                        Labs
                    </Link>
                </div>
            )}
        </nav>
    )
}