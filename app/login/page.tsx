"use client"

import { Suspense, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { AlertCircle, Loader2, LogIn } from "lucide-react"

import { AuthShell } from "@/components/auth/auth-shell"
import { Field } from "@/components/auth/field"
import { Button } from "@/components/ui/button"
import { AuthError, useAuth } from "@/lib/auth-context"
import { safeRedirect } from "@/lib/safe-redirect"

export default function LoginPage() {
    // useSearchParams impose une frontiere de Suspense en rendu statique.
    return (
        <Suspense fallback={null}>
            <LoginForm />
        </Suspense>
    )
}

function LoginForm() {
    const router = useRouter()
    const params = useSearchParams()
    const { login } = useAuth()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState<string | null>(
        params.get("reason") === "expired" ? "Votre session a expire. Reconnectez-vous." : null,
    )
    const [pending, setPending] = useState(false)

    const destination = safeRedirect(params.get("next"))

    async function onSubmit(event: React.FormEvent) {
        event.preventDefault()
        setError(null)
        setPending(true)

        try {
            await login({ email: email.trim(), password })
            router.replace(destination)
            router.refresh()
        } catch (cause) {
            setError(
                cause instanceof AuthError
                    ? cause.message
                    : "Connexion impossible. Verifiez votre reseau et reessayez.",
            )
            setPending(false)
        }
    }

    return (
        <AuthShell
            title="Connexion"
            subtitle="Accedez au cours et au laboratoire."
            footer={
                <>
                    Pas encore de compte ?{" "}
                    <Link
                        href={`/register${params.get("next") ? `?next=${encodeURIComponent(destination)}` : ""}`}
                        className="text-[var(--color-secondary)] hover:underline"
                    >
                        Creer un compte
                    </Link>
                </>
            }
        >
            <form onSubmit={onSubmit} className="space-y-4" noValidate>
                {error && (
                    <div
                        role="alert"
                        className="flex items-start gap-2 rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-300"
                    >
                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                <Field
                    label="Adresse e-mail"
                    type="email"
                    name="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                />

                <Field
                    label="Mot de passe"
                    type="password"
                    name="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                />

                <Button type="submit" className="btn-gemini w-full justify-center" disabled={pending}>
                    {pending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <LogIn className="mr-2 h-4 w-4" />
                    )}
                    {pending ? "Connexion..." : "Se connecter"}
                </Button>
            </form>
        </AuthShell>
    )
}
