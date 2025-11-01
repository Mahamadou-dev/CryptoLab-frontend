"use client"

import { Navigation } from "@/components/navigation"
import { PageHeader } from "@/components/page-header"
import { LearnCard } from "@/components/learn-card"
import { useLanguage } from "@/lib/language-context"

const courses = [
  {
    id: "caesar-theory",
    title: "Caesar Cipher: The Foundation",
    excerpt:
      "Understand the oldest encryption method and how it shaped modern cryptography. Learn basic concepts of substitution ciphers.",
    category: "Beginner" as const,
  },
  {
    id: "symmetric-encryption",
    title: "Symmetric Encryption Explained",
    excerpt:
      "Deep dive into AES and DES. Learn how shared keys work and why symmetric encryption is crucial for data security.",
    category: "Intermediate" as const,
  },
  {
    id: "public-key-crypto",
    title: "Public-Key Cryptography",
    excerpt:
      "Master RSA, asymmetric encryption, and digital signatures. Perfect for understanding modern secure communication.",
    category: "Advanced" as const,
  },
  {
    id: "hashing",
    title: "Cryptographic Hashing",
    excerpt:
      "Explore one-way functions, password security, and blockchain technology. Learn why hashing is essential for data integrity.",
    category: "Intermediate" as const,
  },
  {
    id: "elliptic-curves",
    title: "Elliptic Curve Cryptography",
    excerpt: "Understand ECC, its advantages over RSA, and its applications in modern security protocols.",
    category: "Advanced" as const,
  },
  {
    id: "key-exchange",
    title: "Key Exchange Protocols",
    excerpt: "Learn about Diffie-Hellman, ECDH, and how secure communication is established over insecure channels.",
    category: "Advanced" as const,
  },
]

export default function LearnPage() {
  const { language } = useLanguage()

  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <PageHeader
          title={language === "en" ? "Learn Cryptography" : "Apprendre la cryptographie"}
          description={
            language === "en"
              ? "Choose your learning path and master cryptographic algorithms through interactive content and visualizations."
              : "Choisissez votre chemin d'apprentissage et maîtrisez les algorithmes cryptographiques."
          }
        />

        <div className="space-y-12">
          {/* Beginner Section */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="inline-block px-4 py-1 rounded-full bg-gradient-to-r from-green-500/20 to-green-400/20 border border-green-500/30">
                <span className="text-sm font-semibold text-green-300">
                  {language === "en" ? "Beginner" : "Débutant"}
                </span>
              </div>
              <h2 className="text-2xl font-bold">{language === "en" ? "Start Here" : "Commencez ici"}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {courses
                .filter((c) => c.category === "Beginner")
                .map((course) => (
                  <LearnCard key={course.id} {...course} href={`/learn/${course.id}`} />
                ))}
            </div>
          </section>

          {/* Intermediate Section */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="inline-block px-4 py-1 rounded-full bg-gradient-to-r from-yellow-500/20 to-yellow-400/20 border border-yellow-500/30">
                <span className="text-sm font-semibold text-yellow-300">
                  {language === "en" ? "Intermediate" : "Intermédiaire"}
                </span>
              </div>
              <h2 className="text-2xl font-bold">
                {language === "en" ? "Build Your Skills" : "Améliorez vos compétences"}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {courses
                .filter((c) => c.category === "Intermediate")
                .map((course) => (
                  <LearnCard key={course.id} {...course} href={`/learn/${course.id}`} />
                ))}
            </div>
          </section>

          {/* Advanced Section */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="inline-block px-4 py-1 rounded-full bg-gradient-to-r from-red-500/20 to-red-400/20 border border-red-500/30">
                <span className="text-sm font-semibold text-red-300">{language === "en" ? "Advanced" : "Avancé"}</span>
              </div>
              <h2 className="text-2xl font-bold">
                {language === "en" ? "Master Cryptography" : "Maîtrisez la cryptographie"}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {courses
                .filter((c) => c.category === "Advanced")
                .map((course) => (
                  <LearnCard key={course.id} {...course} href={`/learn/${course.id}`} />
                ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
