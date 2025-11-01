"use client"

import { Navigation } from "@/components/navigation"
import { learnArticles } from "@/lib/learn-content"
import { LearnSection } from "@/components/learn-section"
import { KeyPoints } from "@/components/key-points"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"
import { ProgressBar } from "@/components/progress-bar"
import { InteractiveQuiz, type QuizQuestion } from "@/components/interactive-quiz"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { useTranslation } from "@/lib/i18n"

const quizzes: Record<string, QuizQuestion[]> = {
  "caesar-theory": [
    {
      question: "What is the shift value in the Caesar cipher example where A becomes D?",
      options: ["1", "3", "5", "7"],
      correct: 1,
      explanation: "In this example, each letter is shifted 3 positions forward in the alphabet.",
    },
    {
      question: "Why is the Caesar cipher vulnerable?",
      options: [
        "It uses too many keys",
        "It only has 25 possible keys",
        "It requires a password",
        "It uses block encryption",
      ],
      correct: 1,
      explanation: "With only 25 possible shift values, a brute force attack can easily break it.",
    },
    {
      question: "Which of these best describes the Caesar cipher?",
      options: ["Asymmetric encryption", "Hash function", "Substitution cipher", "Stream cipher"],
      correct: 2,
      explanation: "The Caesar cipher is a substitution cipher that replaces each letter with another.",
    },
  ],
  "symmetric-encryption": [
    {
      question: "What key size does AES support?",
      options: ["64 bits only", "128, 192, or 256 bits", "512 bits only", "1024 bits"],
      correct: 1,
      explanation: "AES supports three key sizes: 128, 192, and 256 bits for different security levels.",
    },
    {
      question: "What is the main challenge of symmetric encryption?",
      options: ["It's too slow", "Key distribution", "It doesn't encrypt data", "It requires two keys"],
      correct: 1,
      explanation: "The main challenge is securely sharing the secret key between parties.",
    },
  ],
  "public-key-crypto": [
    {
      question: "How many keys does public-key cryptography use?",
      options: ["One", "Two", "Three", "Four"],
      correct: 1,
      explanation: "Public-key cryptography uses a pair of keys: one public and one private.",
    },
  ],
  hashing: [
    {
      question: "Is it possible to reverse a cryptographic hash?",
      options: ["Yes, always", "Yes, sometimes", "No, it's one-way", "Only with the key"],
      correct: 2,
      explanation: "Cryptographic hashes are one-way functions; you cannot reverse them to get the original input.",
    },
  ],
}

export default function LearnArticlePage({ params }: { params: { id: string } }) {
  const { language } = useLanguage()
  const t = useTranslation(language)

  const article = learnArticles.find((a) => a.id === params.id)
  const currentIndex = learnArticles.findIndex((a) => a.id === params.id)
  const prevArticle = currentIndex > 0 ? learnArticles[currentIndex - 1] : null
  const nextArticle = currentIndex < learnArticles.length - 1 ? learnArticles[currentIndex + 1] : null
  const quiz = quizzes[params.id] || []

  if (!article) {
    return (
      <main className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-2xl font-bold text-foreground">{t("article.not-found")}</h1>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <BreadcrumbNav items={[{ label: t("article.breadcrumb-learn"), href: "/learn" }, { label: article.title }]} />

        <ProgressBar current={currentIndex + 1} total={learnArticles.length} className="mb-8" />

        <div className="mb-8">
          <span
            className={`inline-block px-4 py-1 rounded-full text-sm font-semibold mb-4 ${
              article.category === "Beginner"
                ? "bg-green-500/20 text-green-300"
                : article.category === "Intermediate"
                  ? "bg-yellow-500/20 text-yellow-300"
                  : "bg-red-500/20 text-red-300"
            }`}
          >
            {t(`difficulty.${article.category.toLowerCase()}`)}
          </span>
          <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-accent-primary to-accent-secondary">
            {article.title}
          </h1>
          <p className="text-xl text-foreground-secondary">{article.excerpt}</p>
        </div>

        <LearnSection title="Overview" content={article.content} />

        {article.sections.map((section, index) => (
          <LearnSection key={index} title={section.title} content={section.content} />
        ))}

        <div className="mb-12">
          <KeyPoints points={article.keyPoints} />
        </div>

        {quiz.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">{t("article.test-knowledge")}</h2>
            <InteractiveQuiz questions={quiz} />
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 mb-12">
          {prevArticle ? (
            <Link href={`/learn/${prevArticle.id}`}>
              <Button
                variant="outline"
                className="w-full glass border-accent-secondary rounded-xl bg-transparent border-2"
                style={{ borderColor: "var(--accent-secondary)", backgroundColor: "var(--surface)" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--surface-hover)")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--surface)")}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t("article.previous")}
              </Button>
            </Link>
          ) : (
            <div />
          )}
          {nextArticle ? (
            <Link href={`/learn/${nextArticle.id}`}>
              <Button className="w-full bg-gradient-to-r from-accent-primary to-accent-tertiary hover:opacity-90 text-white rounded-xl">
                {t("article.next")}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          ) : (
            <div />
          )}
        </div>
      </div>
    </main>
  )
}
