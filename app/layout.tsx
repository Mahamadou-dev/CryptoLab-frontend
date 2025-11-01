import type React from "react"
import { Inter, Fira_Code } from "next/font/google"
import { ThemeProvider } from "@/lib/theme-context"
import { LanguageProvider } from "@/lib/language-context"
import { AccessibilitySkipLink } from "@/components/accessibility-skip-link"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })
const firaCode = Fira_Code({ subsets: ["latin"], variable: "--font-mono" })

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
      </head>
      <body className={`${inter.variable} ${firaCode.variable} font-sans`}>
        <ThemeProvider>
          <LanguageProvider>
            <AccessibilitySkipLink />
            {children}
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
