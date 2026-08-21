import type React from "react"
import { Inter, Fira_Code, Space_Grotesk } from "next/font/google"
import { ThemeProvider } from "@/lib/theme-context"
import { LanguageProvider } from "@/lib/language-context"
import { AuthProvider } from "@/lib/auth-context"
import { AccessibilitySkipLink } from "@/components/accessibility-skip-link"
import { ThemeScript } from "@/components/theme-script"
import "./globals.css"
import {ScrollToTopButton} from "@/components/sroll-to-top-button";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })
const firaCode = Fira_Code({ subsets: ["latin"], variable: "--font-mono" })
// Voix editoriale : titres et articles. Un caractere geometrique et technique,
// distinct de l'interface neutre — la grille et l'octet ont une typographie
// qui leur ressemble, pas un sans-serif generique.
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-display" })

export const metadata = {
  title: "CryptoLab - Interactive Cryptography Playground",
  description: "Learn, simulate, and visualize cryptography algorithms interactively with beautiful 3D visualizations.",
  keywords: "cryptography, encryption, education, interactive, visualization",
  openGraph: {
    title: "CryptoLab - Interactive Cryptography Playground",
    description: "Learn, simulate, and visualize cryptography algorithms interactively.",
    type: "website",
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Doit rester le premier script du document : il pose les classes de
            theme avant le premier affichage. */}
        <ThemeScript />
      </head>
      <body className={`${inter.variable} ${firaCode.variable} ${spaceGrotesk.variable} font-sans`}>
        <ThemeProvider>
          <LanguageProvider>
            <AuthProvider>
              <AccessibilitySkipLink />
              {children}
              <ScrollToTopButton />
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
