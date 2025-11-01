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
    { href: "/", label: t("nav.home") },
    { href: "/simulations", label: t("nav.simulations") },
    { href: "/learn", label: t("nav.learn") },
    { href: "/about", label: t("nav.about") },
  ]

  return (
    <nav className="glass sticky top-0 z-50 backdrop-blur-xl border-b" style={{ borderColor: "var(--border-color)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <Lock className="w-6 h-6 text-accent-primary" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent-primary to-accent-secondary">
            CryptoLab
          </span>
        </Link>

        <div className="hidden md:flex gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "px-4 py-2 rounded-lg transition-colors",
                pathname === link.href ? "text-accent-secondary" : "text-foreground-secondary hover:text-foreground",
              )}
              style={pathname === link.href ? { backgroundColor: "var(--surface)" } : {}}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden md:flex gap-2">
            <Link
              href="/simulations"
              className="glass px-4 py-2 rounded-lg text-sm transition-colors"
              style={{ backgroundColor: "var(--surface)" }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--surface-hover)")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--surface)")}
            >
              Labs
            </Link>
          </div>
          <ThemeLanguageSwitcher />
        </div>
      </div>
    </nav>
  )
}
