"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Zap, BookOpen, Lock, Code2 } from "lucide-react"
import { HeroScene } from "@/components/3d/hero-scene"
import { Navigation } from "@/components/navigation"
import { useLanguage } from "@/lib/language-context"
import { useTranslation } from "@/lib/i18n"

export default function Home() {
  const { language } = useLanguage()
  const t = useTranslation(language)

  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated 3D background */}
        <div className="absolute inset-0 opacity-50">
          <HeroScene />
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/50 to-background pointer-events-none" />

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 text-center max-w-4xl mx-auto">
          <div className="mb-4 inline-flex items-center gap-2 px-4 py-2 rounded-full glass">
            <Sparkles className="w-4 h-4 text-accent-primary" />
            <span className="text-sm text-foreground-secondary">
              {language === "en" ? "Interactive Learning Platform" : "Plateforme d'apprentissage interactif"}
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-accent-primary via-accent-secondary to-accent-tertiary leading-tight">
            {t("hero.title", "CryptoLab")}
          </h1>

          <p className="text-xl sm:text-2xl text-foreground-secondary mb-6 max-w-2xl leading-relaxed">
            {t(
              "hero.description",
              "Explore cryptography through interactive simulations and stunning 3D visualizations",
            )}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-16 w-full sm:w-auto justify-center">
            <Link href="/simulations" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full text-white rounded-xl group bg-accent-primary hover:bg-accent-magenta text-base font-semibold px-8"
              >
                <Zap className="w-5 h-5 mr-2" />
                {t("hero.start-simulating", "Start Exploring")}
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/learn" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="w-full border-2 rounded-xl bg-background hover:bg-background/80 text-base font-semibold px-8"
                style={{
                  borderColor: "var(--accent-secondary)",
                  color: "var(--accent-secondary)",
                }}
              >
                <BookOpen className="w-5 h-5 mr-2" />
                {t("hero.explore-learning", "Learn Algorithms")}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="relative z-10 py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            {language === "en" ? "Why CryptoLab?" : "Pourquoi CryptoLab?"}
          </h2>
          <p className="text-lg text-foreground-secondary">
            {language === "en"
              ? "Experience the future of cryptography education"
              : "Découvrez l'avenir de l'éducation cryptographique"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: Lock,
              titleEn: "Visual Learning",
              titleFr: "Apprentissage visuel",
              descEn: "See how encryption algorithms work in real-time with stunning 3D visualizations",
              descFr: "Voyez comment fonctionnent les algorithmes de chiffrement en temps réel",
            },
            {
              icon: Zap,
              titleEn: "Interactive Simulations",
              titleFr: "Simulations interactives",
              descEn: "Experiment with cryptographic algorithms and see immediate results",
              descFr: "Testez des algorithmes cryptographiques et voyez les résultats immédiatement",
            },
            {
              icon: BookOpen,
              titleEn: "Deep Learning",
              titleFr: "Apprentissage approfondi",
              descEn: "Master cryptography from basics to advanced concepts with guided tutorials",
              descFr: "Maîtrisez la cryptographie des notions de base aux concepts avancés",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="glass p-8 rounded-2xl hover:glass-hover transition-all duration-300 group cursor-pointer h-full flex flex-col"
              style={{
                backgroundColor: "var(--surface)",
                borderColor: "var(--border-color)",
              }}
            >
              <feature.icon className="w-12 h-12 text-accent-primary mb-4 group-hover:text-accent-secondary transition-colors" />
              <h3 className="text-xl font-bold mb-3">{language === "en" ? feature.titleEn : feature.titleFr}</h3>
              <p className="text-foreground-secondary">{language === "en" ? feature.descEn : feature.descFr}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { number: "10+", label: language === "en" ? "Algorithms" : "Algorithmes" },
              { number: "3D", label: language === "en" ? "Visualizations" : "Visualisations" },
              { number: "∞", label: language === "en" ? "Learning Paths" : "Chemins d'apprentissage" },
              { number: "100%", label: language === "en" ? "Open Source" : "Code ouvert" },
            ].map((stat, index) => (
              <div
                key={index}
                className="glass p-8 rounded-2xl text-center"
                style={{
                  backgroundColor: "var(--surface)",
                  borderColor: "var(--border-color)",
                }}
              >
                <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-accent-primary to-accent-secondary mb-2">
                  {stat.number}
                </div>
                <div className="text-foreground-secondary">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div
            className="glass p-12 sm:p-16 rounded-3xl text-center"
            style={{
              backgroundColor: "var(--surface)",
              borderColor: "var(--border-color)",
            }}
          >
            <Code2 className="w-16 h-16 mx-auto mb-6 text-accent-primary" />
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              {language === "en" ? "Ready to Learn?" : "Prêt à apprendre?"}
            </h2>
            <p className="text-lg text-foreground-secondary mb-8">
              {language === "en"
                ? "Start your cryptography journey today with interactive simulations and guided learning paths."
                : "Commencez votre parcours cryptographique aujourd'hui avec des simulations interactives."}
            </p>
            <Link href="/simulations">
              <Button
                size="lg"
                className="text-white rounded-xl bg-accent-primary hover:bg-accent-magenta text-base font-semibold px-8"
              >
                {t("hero.start-simulating", "Start Exploring")}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="relative z-10 border-t py-8 px-4 sm:px-6 lg:px-8"
        style={{ borderColor: "var(--border-color)" }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-lg mb-4">{language === "en" ? "CryptoLab" : "CryptoLab"}</h3>
              <p className="text-foreground-secondary">
                {language === "en"
                  ? "Interactive cryptography education platform"
                  : "Plateforme d'éducation cryptographique interactive"}
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-4">{language === "en" ? "Explore" : "Explorer"}</h3>
              <ul className="space-y-2 text-foreground-secondary">
                <li>
                  <Link href="/simulations" className="hover:text-accent-primary transition-colors">
                    {t("nav.simulations")}
                  </Link>
                </li>
                <li>
                  <Link href="/learn" className="hover:text-accent-primary transition-colors">
                    {t("nav.learn")}
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-accent-primary transition-colors">
                    {t("nav.about")}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">{language === "en" ? "Connect" : "Connexion"}</h3>
              <p className="text-foreground-secondary">
                {language === "en" ? "Follow us for updates" : "Suivez-nous pour les mises à jour"}
              </p>
            </div>
          </div>
          <div
            className="text-center text-sm text-foreground-tertiary pt-8 border-t"
            style={{ borderColor: "var(--border-color)" }}
          >
            © 2025 CryptoLab. {language === "en" ? "All rights reserved." : "Tous droits réservés."}
          </div>
        </div>
      </footer>
    </main>
  )
}
