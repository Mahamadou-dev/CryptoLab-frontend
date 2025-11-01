export type Language = "en" | "fr"

export const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.simulations": "Simulations",
    "nav.learn": "Learn",
    "nav.about": "About",

    // Hero Section
    "hero.title": "CryptoLab",
    "hero.subtitle": "Interactive Cryptography Playground",
    "hero.description":
      "Explore cryptographic algorithms with interactive simulations and stunning 3D visualizations. Understand encryption, decryption, and hashing through hands-on learning.",
    "hero.start-simulating": "Start Exploring",
    "hero.explore-learning": "Learn Algorithms",

    // Feature Cards
    "features.encryption": "Encryption",
    "features.encryption-desc": "Visualize how your data gets secured",
    "features.interactive": "Interactive",
    "features.interactive-desc": "Hands-on cryptography experiments",
    "features.educational": "Educational",
    "features.educational-desc": "Learn the math behind security",

    // Sections
    "section.simulations": "Algorithm Simulators",
    "section.simulations-desc": "Explore cryptographic algorithms with step-by-step visualizations",
    "section.learn": "Learning Hub",
    "section.learn-desc": "Master cryptography concepts from basics to advanced topics",
    "section.about": "About CryptoLab",
    "section.about-desc": "Building an open-source platform for cryptography education",

    // Difficulty
    "difficulty.beginner": "Beginner",
    "difficulty.intermediate": "Intermediate",
    "difficulty.advanced": "Advanced",

    // Buttons
    "button.encrypt": "Encrypt",
    "button.decrypt": "Decrypt",
    "button.hash": "Hash",
    "button.simulate": "Simulate",
    "button.copy": "Copy",
    "button.clear": "Clear",
    "button.learn-more": "Learn More",

    // Theme
    "theme.light": "Light",
    "theme.dark": "Dark",
    "theme.system": "System",

    // Colors
    "color.red": "Red",
    "color.blue": "Blue",
    "color.pink": "Pink",
    "color.purple": "Purple",

    // Errors
    "error.invalid-input": "Invalid input provided",
    "error.encryption-failed": "Encryption failed",
    "error.decryption-failed": "Decryption failed",

    // About Page
    "about.title": "About CryptoLab",
    "about.mission": "Mission",
    "about.mission-desc":
      "CryptoLab makes cryptography accessible and beautiful. We combine interactive simulations, stunning visualizations, and comprehensive education to help anyone understand the mathematics behind modern security.",
    "about.tech-stack": "Technology Stack",
    "about.open-source": "Open Source",
    "about.open-source-desc": "CryptoLab is open source and community-driven. Contributions are welcome!",
    "about.view-github": "View on GitHub",
    "about.made-with": "Made with",
    "about.for-crypto": "for cryptography enthusiasts",
    "about.tech-items":
      "Next.js 15 with App Router|React 19 for interactive UI|Three.js for 3D visualizations|TailwindCSS for styling|FastAPI backend for crypto operations",

    // Simulations Page
    "simulations.title": "Cryptography Simulations",
    "simulations.description":
      "Choose an algorithm to explore. Each simulator offers interactive encryption/decryption with step-by-step visualization.",

    // Simulator Page
    "simulator.title": "Simulator",
    "simulator.visualization": "3D Visualization",
    "simulator.not-found": "Algorithm not found",

    // Learn Page
    "learn.title": "Learn Cryptography",
    "learn.description": "Master cryptographic concepts and algorithms through interactive courses and tutorials.",

    // Learn Article Page
    "article.not-found": "Article not found",
    "article.test-knowledge": "Test Your Knowledge",
    "article.previous": "Previous",
    "article.next": "Next",
    "article.breadcrumb-learn": "Learn",

    // Simulations Categories
    "category.classical": "Classical Ciphers",
    "category.symmetric": "Symmetric Encryption",
    "category.asymmetric": "Asymmetric Encryption",
    "category.hashing": "Hashing Algorithms",

    // Quiz
    "quiz.explanation": "Explanation",
    "quiz.check-answer": "Check Answer",
    "quiz.correct": "Correct!",
    "quiz.incorrect": "Incorrect",
    "quiz.score": "Your Score",
  },
  fr: {
    // Navigation
    "nav.home": "Accueil",
    "nav.simulations": "Simulations",
    "nav.learn": "Apprendre",
    "nav.about": "À propos",

    // Hero Section
    "hero.title": "CryptoLab",
    "hero.subtitle": "Terrain de jeu de cryptographie interactive",
    "hero.description":
      "Explorez les algorithmes cryptographiques avec des simulations interactives et des visualisations 3D époustouflantes. Comprenez le chiffrement, le déchiffrement et le hachage par l'apprentissage pratique.",
    "hero.start-simulating": "Commencer l'exploration",
    "hero.explore-learning": "Apprendre les algorithmes",

    // Feature Cards
    "features.encryption": "Chiffrement",
    "features.encryption-desc": "Visualisez comment vos données sont sécurisées",
    "features.interactive": "Interactif",
    "features.interactive-desc": "Expériences de cryptographie pratiques",
    "features.educational": "Éducatif",
    "features.educational-desc": "Apprenez les mathématiques derrière la sécurité",

    // Sections
    "section.simulations": "Simulateurs d'algorithmes",
    "section.simulations-desc": "Explorez les algorithmes cryptographiques avec des visualisations étape par étape",
    "section.learn": "Centre d'apprentissage",
    "section.learn-desc": "Maîtrisez les concepts de cryptographie des bases aux sujets avancés",
    "section.about": "À propos de CryptoLab",
    "section.about-desc": "Construire une plateforme open-source pour l'éducation à la cryptographie",

    // Difficulty
    "difficulty.beginner": "Débutant",
    "difficulty.intermediate": "Intermédiaire",
    "difficulty.advanced": "Avancé",

    // Buttons
    "button.encrypt": "Chiffrer",
    "button.decrypt": "Déchiffrer",
    "button.hash": "Hachage",
    "button.simulate": "Simuler",
    "button.copy": "Copier",
    "button.clear": "Effacer",
    "button.learn-more": "En savoir plus",

    // Theme
    "theme.light": "Clair",
    "theme.dark": "Sombre",
    "theme.system": "Système",

    // Colors
    "color.red": "Rouge",
    "color.blue": "Bleu",
    "color.pink": "Rose",
    "color.purple": "Violet",

    // Errors
    "error.invalid-input": "Entrée invalide fournie",
    "error.encryption-failed": "Le chiffrement a échoué",
    "error.decryption-failed": "Le déchiffrement a échoué",

    // About Page
    "about.title": "À propos de CryptoLab",
    "about.mission": "Mission",
    "about.mission-desc":
      "CryptoLab rend la cryptographie accessible et magnifique. Nous combinons des simulations interactives, des visualisations époustouflantes et une éducation complète pour aider quiconque à comprendre les mathématiques derrière la sécurité moderne.",
    "about.tech-stack": "Pile technologique",
    "about.open-source": "Open Source",
    "about.open-source-desc": "CryptoLab est open source et communautaire. Les contributions sont les bienvenues!",
    "about.view-github": "Voir sur GitHub",
    "about.made-with": "Fait avec",
    "about.for-crypto": "pour les passionnés de cryptographie",
    "about.tech-items":
      "Next.js 15 avec App Router|React 19 pour l'interface utilisateur interactive|Three.js pour les visualisations 3D|TailwindCSS pour le style|Backend FastAPI pour les opérations cryptographiques",

    // Simulations Page
    "simulations.title": "Simulations de cryptographie",
    "simulations.description":
      "Choisissez un algorithme à explorer. Chaque simulateur offre un chiffrement/déchiffrement interactif avec visualisation étape par étape.",

    // Simulator Page
    "simulator.title": "Simulateur",
    "simulator.visualization": "Visualisation 3D",
    "simulator.not-found": "Algorithme non trouvé",

    // Learn Page
    "learn.title": "Apprendre la cryptographie",
    "learn.description":
      "Maîtrisez les concepts et algorithmes cryptographiques grâce à des cours interactifs et des didacticiels.",

    // Learn Article Page
    "article.not-found": "Article non trouvé",
    "article.test-knowledge": "Testez vos connaissances",
    "article.previous": "Précédent",
    "article.next": "Suivant",
    "article.breadcrumb-learn": "Apprendre",

    // Simulations Categories
    "category.classical": "Chiffres classiques",
    "category.symmetric": "Chiffrement symétrique",
    "category.asymmetric": "Chiffrement asymétrique",
    "category.hashing": "Algorithmes de hachage",

    // Quiz
    "quiz.explanation": "Explication",
    "quiz.check-answer": "Vérifier la réponse",
    "quiz.correct": "Correct!",
    "quiz.incorrect": "Incorrect",
    "quiz.score": "Votre score",
  },
}

export function useTranslation(language: Language) {
  return (key: string, defaultValue?: string): string => {
    return translations[language][key] || defaultValue || key
  }
}
