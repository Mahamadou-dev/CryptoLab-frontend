"use client"

import { Navigation } from "@/components/navigation"
import { Github, Heart, Loader2, Send, CheckCircle } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { useTranslation } from "@/lib/i18n"
import React, { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

export default function AboutPage() {
    const { language } = useLanguage()
    const t = useTranslation(language)

    const [type, setType] = useState("bug")
    const [page, setPage] = useState("")
    const [description, setDescription] = useState("")
    const [email, setEmail] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
    const [errorMessage, setErrorMessage] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setErrorMessage("")

        if (!description) {
            setErrorMessage(t("report.error.description", "Veuillez entrer une description."))
            setSubmitStatus("error")
            return
        }

        setIsSubmitting(true)
        setSubmitStatus("idle")

        try {
            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({
                    access_key: process.env.NEXT_PUBLIC_WEB3FORMS_KEY, // clé publique (client)
                    sujet: `Rapport de Problème - CryptoLab (${type})`,
                    type,
                    page,
                    description,
                    email,
                }),
            })

            const result = await response.json()

            if (response.ok && result.success) {
                setIsSubmitting(false)
                setSubmitStatus("success")

                setTimeout(() => {
                    setSubmitStatus("idle")
                    setType("bug")
                    setPage("")
                    setDescription("")
                    setEmail("")
                }, 3000)
            } else {
                console.error("Erreur API:", result.message)
                setErrorMessage(result.message || "Erreur inconnue.")
                setIsSubmitting(false)
                setSubmitStatus("error")
            }
        } catch (error) {
            console.error("Erreur Fetch:", error)
            setErrorMessage(t("report.error.network", "Erreur réseau."))
            setIsSubmitting(false)
            setSubmitStatus("error")
        }
    }

    return (
        <main className="min-h-screen">
            <Navigation />
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="mb-12">
                    <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-gradient">
                        {t("about.title", "À Propos de CryptoLab")}
                    </h1>
                </div>

                {/* --- MINI ABOUT --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    <Card className="glass">
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold text-[var(--color-violet)]">
                                {t("about.mission", "Notre Mission")}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>
                                {t(
                                    "about.mission-desc",
                                    "Démystifier la cryptographie pour tous. CryptoLab rend l'apprentissage interactif et amusant."
                                )}
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="glass">
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold text-[var(--color-magenta)]">
                                {t("about.open-source", "Open Source")}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="mb-6">
                                {t(
                                    "about.open-source-desc",
                                    "Ce projet est ouvert à la communauté. Explorez et contribuez sur GitHub."
                                )}
                            </p>
                            <Button
                                asChild
                                variant="ghost"
                                className="text-[var(--color-rose)] hover:text-[var(--color-rose)] hover:bg-[var(--surface-hover)]"
                            >
                                <a href="https://github.com/Mahamadou-dev/CryptoLab-backend.git" target="_blank" className="inline-flex items-center gap-2">
                                    <Github className="w-5 h-5" />
                                    {t("about.view-github", "Voir sur GitHub")}
                                </a>
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* --- FORMULAIRE DE SIGNALEMENT --- */}
                <Card className="glass">
                    <CardHeader>
                        <CardTitle className="text-3xl font-bold text-gradient">
                            {t("report.title", "Signaler un Problème")}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {submitStatus === "success" ? (
                            <div className="flex flex-col items-center justify-center text-center p-8 text-green-300">
                                <CheckCircle className="w-16 h-16 mb-4" />
                                <h3 className="text-2xl font-bold">{t("report.success.title", "Merci !")}</h3>
                                <p>{t("report.success.desc", "Votre rapport a été envoyé.")}</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <Label htmlFor="type" className="font-semibold">
                                        {t("report.type", "Type de problème")}
                                    </Label>
                                    <select
                                        id="type"
                                        value={type}
                                        onChange={(e) => setType(e.target.value)}
                                        className="glass w-full mt-2"
                                        disabled={isSubmitting}
                                    >
                                        <option value="bug">{t("report.type.bug", "Bug de Simulation")}</option>
                                        <option value="visuel">{t("report.type.visual", "Bug Visuel / Faute de frappe")}</option>
                                        <option value="contenu">{t("report.type.content", "Erreur dans le Contenu")}</option>
                                        <option value="autre">{t("report.type.other", "Autre")}</option>
                                    </select>
                                </div>

                                <div>
                                    <Label htmlFor="page" className="font-semibold">
                                        {t("report.page", "Page ou Algorithme Concerné")}
                                    </Label>
                                    <Input
                                        id="page"
                                        value={page}
                                        onChange={(e) => setPage(e.target.value)}
                                        className="glass mt-2"
                                        placeholder={t("report.page.placeholder", "Ex: Simulation AES...")}
                                        disabled={isSubmitting}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="description" className="font-semibold">
                                        {t("report.description", "Description")} <span className="text-[var(--color-rose)]">*</span>
                                    </Label>
                                    <Textarea
                                        id="description"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className={cn(
                                            "glass mt-2 w-full min-h-[120px] resize-none rounded-xl px-4 py-3 text-sm leading-relaxed",
                                            "border border-border/40 focus:border-pink-500/60 focus:ring-2 focus:ring-pink-400/40",
                                            "bg-white/20 dark:bg-surface/20 backdrop-blur-md",
                                            "placeholder:text-foreground/60 text-foreground transition-all duration-200"
                                        )}
                                        placeholder={t("report.description.placeholder", "Décrivez le problème en détail...")}
                                        required
                                        disabled={isSubmitting}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="email" className="font-semibold">
                                        {t("report.email", "Email (Optionnel)")}
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="glass mt-2"
                                        placeholder={t("report.email.placeholder", "vous@email.com")}
                                        disabled={isSubmitting}
                                    />
                                </div>

                                {submitStatus === "error" && (
                                    <div className="text-center p-3 rounded-lg bg-[var(--color-rose)]/10 border border-[var(--color-rose)]/20 text-[var(--color-rose)]">
                                        <p>{errorMessage || t("report.error.generic", "Une erreur est survenue.")}</p>
                                    </div>
                                )}

                                <Button type="submit" disabled={isSubmitting} className="btn-gemini w-full text-lg py-6">
                                    {isSubmitting ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <>
                                            <Send className="w-5 h-5 mr-2" />
                                            {t("report.submit", "Envoyer le Rapport")}
                                        </>
                                    )}
                                </Button>
                            </form>
                        )}
                    </CardContent>
                </Card>

                <div className="mt-12 text-center">
                    <p className="flex items-center justify-center gap-2">
                        {t("about.made-with", "Fait avec")} <Heart className="w-4 h-4 text-[var(--color-rose)]" />{" "}
                        {t("about.for-crypto", "pour la communauté crypto.")}
                    </p>
                    <p> {t("about.by")} <a href='https://gremah.vercel.app' target='_blank' className="text-gradient" >GremahTech</a></p>
                </div>
            </div>
        </main>
    )
}
