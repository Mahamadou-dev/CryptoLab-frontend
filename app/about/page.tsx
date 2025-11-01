"use client"

import { Navigation } from "@/components/navigation"
import { Github, Heart } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/lib/language-context"
import { useTranslation } from "@/lib/i18n"

export default function AboutPage() {
  const { language } = useLanguage()
  const t = useTranslation(language)

  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-accent-primary to-accent-secondary">
            {t("about.title")}
          </h1>
        </div>

        <div className="glass p-8 rounded-2xl mb-8">
          <h2 className="text-2xl font-bold mb-4">{t("about.mission")}</h2>
          <p className="text-foreground-secondary leading-relaxed mb-6">{t("about.mission-desc")}</p>
        </div>

        <div className="glass p-8 rounded-2xl mb-8">
          <h2 className="text-2xl font-bold mb-4">{t("about.tech-stack")}</h2>
          <ul className="space-y-2 text-foreground-secondary">
            {t("about.tech-items")
              .split("|")
              .map((item, index) => (
                <li key={index}>• {item}</li>
              ))}
          </ul>
        </div>

        <div className="glass p-8 rounded-2xl">
          <h2 className="text-2xl font-bold mb-4">{t("about.open-source")}</h2>
          <p className="text-foreground-secondary mb-6">{t("about.open-source-desc")}</p>
          <Link
            href="https://github.com"
            className="inline-flex items-center gap-2 text-accent-secondary hover:text-accent-tertiary transition-colors"
          >
            <Github className="w-5 h-5" />
            {t("about.view-github")}
          </Link>
        </div>

        <div className="mt-12 text-center text-foreground-tertiary">
          <p className="flex items-center justify-center gap-2">
            {t("about.made-with")} <Heart className="w-4 h-4 text-accent-primary" /> {t("about.for-crypto")}
          </p>
        </div>
      </div>
    </main>
  )
}
